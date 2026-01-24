import asyncio
from typing import Dict, Any

from strands import Agent, tool
from strands_evals import Case, Experiment, ActorSimulator
from strands_evals.evaluators import HelpfulnessEvaluator, ToolParameterAccuracyEvaluator, ToolSelectionAccuracyEvaluator
from strands_evals.simulation.tool_simulator import ToolSimulator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.telemetry import StrandsEvalsTelemetry

# Clear previous registrations
ToolSimulator.clear_registry()

# Function tool for room temperature and humidity (dynamic mode)
@ToolSimulator.function_tool(
    share_state_id="room_environment",
    initial_state_description="Room environment: temperature 72°F, humidity 45%, HVAC target temp 72°F in cool mode",
    mode="dynamic"
)
def get_room_temperature_humidity() -> Dict[str, Any]:
    """Get current room temperature and humidity levels."""
    pass

# MCP tool (mock mode, shares state with room environment)
def mock_hvac_controller(temperature: float, mode: str) -> Dict[str, Any]:
    """Mock HVAC system logic that affects room environment."""
    energy_cost = abs(temperature - 70) * 0.05  # Cost increases with temperature difference
    return {
        "target_temperature": temperature,
        "mode": mode,
        "estimated_runtime": f"{abs(temperature - 70) * 10} minutes",
        "energy_cost_per_hour": round(energy_cost, 2),
        "efficiency_rating": "high" if abs(temperature - 70) < 3 else "medium",
        "humidity_impact": "increases" if mode == "heat" else "decreases"
    }

hvac_schema = {
    "name": "hvac_controller",
    "description": "Control home heating/cooling system that affects room temperature and humidity",
    "inputSchema": {
        "type": "object",
        "properties": {
            "temperature": {"type": "number", "description": "Target temperature in Fahrenheit"},
            "mode": {"type": "string", "enum": ["heat", "cool", "auto"], "description": "HVAC mode"}
        },
        "required": ["temperature", "mode"]
    }
}

@ToolSimulator.mcp_tool(
    schema=hvac_schema, 
    mode="mock", 
    mock_function=mock_hvac_controller,
    share_state_id="room_environment"
)
def hvac_controller(temperature: float, mode: str) -> Dict[str, Any]:
    """Control home HVAC system."""
    pass

# API tool (static mode)
@ToolSimulator.api_tool(
    path="/weather/current",
    method="GET",
    mode="static",
    static_response={
        "status": 200,
        "data": {
            "temperature": 45,
            "condition": "cloudy",
            "humidity": 65,
            "recommendation": "Indoor heating suggested"
        }
    }
)
def weather_service(location: str) -> Dict[str, Any]:
    """Get current weather information."""
    pass

# Agent-as-tool
@tool  
def room_comfort_advisor(query: str) -> str:
    """Consult room comfort expert for temperature and humidity optimization advice."""
    try:
        # Get simulator instance for tool access
        simulator = ToolSimulator._get_instance()
        
        advisor_agent = Agent(
            system_prompt="You are a room comfort advisor. Provide practical advice for optimizing room temperature and humidity for comfort. Consider current weather conditions and room environment.",
            tools=[
                simulator.get_room_temperature_humidity,
                simulator.hvac_controller, 
                simulator.weather_service,
            ],
            callback_handler=None,
        )
        response = advisor_agent(f"Room comfort question: {query}")
        return str(response)
    except Exception as e:
        return f"Room comfort advisor error: {str(e)}"

# Define a task function
async def task_function(case: Case) -> dict:
    # Setup telemetry
    telemetry = StrandsEvalsTelemetry().setup_in_memory_exporter()
    memory_exporter = telemetry.in_memory_exporter

    # Create simulator and user simulator
    simulator = ToolSimulator.from_case_for_tool_simulator(case)
    user_sim = ActorSimulator.from_case_for_user_simulator(case=case, max_turns=3)

    # Create agent with tools
    agent = Agent(
        system_prompt="You are a smart home assistant. Help users manage room comfort and optimize temperature and humidity.",
        tools=[
            simulator.get_room_temperature_humidity,
            room_comfort_advisor,
        ],
        callback_handler=None,
    )

    # Multi-turn conversation
    user_message = case.input
    while user_sim.has_next():
        memory_exporter.clear()  # Clear before each agent call
        agent_response = await agent.invoke_async(user_message)
        agent_message = str(agent_response)
        user_result = user_sim.act(agent_message)
        user_message = str(user_result.structured_output.message)

    # Map session
    mapper = StrandsInMemorySessionMapper()
    finished_spans = memory_exporter.get_finished_spans()
    session = mapper.map_to_session(finished_spans, session_id=case.session_id)

    return {"output": agent_message, "trajectory": session}

# Create test cases
test_cases = [
    Case(
        name="temperature_control", 
        input="It's getting cold outside, adjust my home temperature",
        metadata={"category": "hvac"},
    ),
]

async def main():
    # Create and run experiment
    experiment = Experiment[str, str](
        cases=test_cases,
        evaluators=[
            HelpfulnessEvaluator(),
            ToolParameterAccuracyEvaluator(),
            ToolSelectionAccuracyEvaluator(),
        ]
    )
    reports = await experiment.run_evaluations_async(task_function)
    
    # Display results
    for report in reports:
        report.run_display()

if __name__ == "__main__":
    asyncio.run(main())
