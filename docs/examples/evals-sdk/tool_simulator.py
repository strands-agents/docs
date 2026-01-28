from typing import Dict, Any

from strands import Agent
from strands.tools.decorator import tool
from strands_evals import Case, Experiment
from strands_evals.evaluators import HelpfulnessEvaluator
from strands_evals.simulation.tool_simulator import ToolSimulator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.telemetry import StrandsEvalsTelemetry

# Clear previous registrations
ToolSimulator.clear_registry()

# Setup telemetry
telemetry = StrandsEvalsTelemetry().setup_in_memory_exporter()
memory_exporter = telemetry.in_memory_exporter

# Function tool for room temperature and humidity (dynamic mode)
@ToolSimulator.function_tool(
    share_state_id="room_environment",
    initial_state_description="Room environment: temperature 68°F, humidity 45%, HVAC off",
    mode="dynamic"
)
def get_room_temperature_humidity() -> Dict[str, Any]:
    """Get current room temperature and humidity levels."""
    pass

# MCP tool (mock mode, shares state with room environment)
def mock_hvac_controller(temperature: float, mode: str) -> Dict[str, Any]:
    """Mock HVAC system logic that affects room environment."""
    energy_cost = abs(temperature - 70) * 0.05  # Cost increases with temperature difference
    result = {
        "target_temperature": temperature,
        "mode": mode,
        "estimated_runtime": f"{abs(temperature - 70) * 10} minutes",
        "energy_cost_per_hour": round(energy_cost, 2),
        "efficiency_rating": "high" if abs(temperature - 70) < 3 else "medium",
        "humidity_impact": "increases" if mode == "heat" else "decreases"
    }
    return result

hvac_schema = {
    "name": "hvac_controller",
    "description": "Control home heating/cooling system that affects room temperature and humidity",
    "inputSchema": {
        "type": "object",
        "properties": {
            "temperature": {"type": "number", "description": "Target temperature in Fahrenheit"},
            "mode": {"type": "string", "enum": ["heat", "cool", "auto", "off"], "description": "HVAC mode"}
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
        }
    }
)
def weather_service(location: str) -> Dict[str, Any]:
    """Get current weather information."""
    pass

# Create simulators
simulator = ToolSimulator()

# Create sub-agent (agent-as-tool) with simulated tools
@tool
def hvac_control_assistant(query: str) -> str:
    """HVAC control assistant that uses room sensors and weather data to control the HVAC system based on user requests."""
    try:
        simulator = ToolSimulator._get_instance()
        temp_tool = simulator.get_tool("get_room_temperature_humidity")
        hvac_tool = simulator.get_tool("hvac_controller")
        weather_tool = simulator.get_tool("weather_service")
        
        control_agent = Agent(
            system_prompt="You are an HVAC control assistant. Your job is to control the HVAC system using the hvac_controller tool based on information from room temperature/humidity sensors and weather conditions. Always check current room conditions first, consider outdoor weather, then make appropriate HVAC adjustments to meet the user's request.",
            tools=[temp_tool, hvac_tool, weather_tool],
            callback_handler=None,
        )
        response = control_agent(f"HVAC control request: {query}")
        return str(response)

    except Exception as e:
        return f"HVAC control assistant error: {str(e)}"

# Define a task function
def user_task_function(case: Case) -> dict:
    # Create agent with simulated tool and sub-agent
    simulator = ToolSimulator._get_instance()
    temp_tool = simulator.get_tool("get_room_temperature_humidity")
    
    # Inspect initial shared state "room_environment"
    initial_state = simulator._state_registry.get_state("room_environment")
    print(f"[Room state (before agent invocation)]:")
    print(f"  Initial state: {initial_state.get('initial_state')}")
    print(f"  Previous calls: {initial_state.get('previous_calls', [])}")
    
    # Showcase how user-agent interaction changes room environment state
    agent = Agent(
        trace_attributes={"gen_ai.conversation.id": case.session_id, "session.id": case.session_id},
        system_prompt="You are a smart home assistant Alessa. You can check room temperature and humidity conditions. For temperature adjustments, you must consult the hvac_control_assistant who has access to the HVAC system.",
        tools=[
            temp_tool,
            hvac_control_assistant,
        ],
        callback_handler=None,
    )

    try:
        agent_response = agent(case.input)
    except Exception as e:
        agent_response = f"Agent execution error: {e}"

    print(f"[User]: {case.input}")
    print(f"[Agent]: {agent_response}")

    # Inspect final shared state "room_environment" after agent interaction
    final_state = simulator._state_registry.get_state("room_environment")
    print(f"[Room state (after agent invocation)]:")
    print(f"  Initial state: {final_state.get('initial_state')}")
    print(f"  Previous calls:")
    for i, call in enumerate(final_state.get('previous_calls', [])):
        print(f"    {i}. Tool: {call.get('tool_name')}, Type: {call.get('tool_type')}")
        print(f"       Response: {str(call.get('response', {}))[:100]}...")

    finished_spans = memory_exporter.get_finished_spans()
    mapper = StrandsInMemorySessionMapper()
    session = mapper.map_to_session(finished_spans, session_id=case.session_id)

    return {"output": str(agent_response), "trajectory": session}

# Create test cases
test_cases = [
    Case(
        name="temperature_control", 
        input="Turn on the heat to 72 degree",
        metadata={"category": "hvac"},
    ),
]

# Create evaluators
evaluators = [HelpfulnessEvaluator()]

# Create an experiment
experiment = Experiment[str, str](cases=test_cases, evaluators=evaluators)

# Run evaluations
reports = experiment.run_evaluations(user_task_function)
reports[0].run_display()
