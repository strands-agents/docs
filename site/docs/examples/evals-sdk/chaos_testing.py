import logging
from typing import Any

from pydantic import BaseModel, Field

from strands import Agent
from strands_evals import Case
from strands_evals.chaos import (
    ChaosCase,
    ChaosExperiment,
    ChaosPlugin,
    CorruptValues,
    NetworkError,
    RemoveFields,
    Timeout,
    TruncateFields,
)
from strands_evals.chaos.effects import ExecutionError
from strands_evals.evaluators import GoalSuccessRateEvaluator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.simulation.tool_simulator import ToolSimulator
from strands_evals.telemetry import StrandsEvalsTelemetry

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

# Setup telemetry
telemetry = StrandsEvalsTelemetry().setup_in_memory_exporter()
memory_exporter = telemetry.in_memory_exporter

# 1. Set up ToolSimulator and register tools
tool_simulator = ToolSimulator()

class FlightSearchResponse(BaseModel):
    """Response from the flight search tool."""

    flights: list[dict[str, Any]] = Field(default_factory=list, description="List of available flights")
    total_results: int = Field(default=0, description="Total number of results found")
    status: str = Field(default="success", description="Operation status")

class BookFlightResponse(BaseModel):
    """Response from the flight booking tool."""

    booking_id: str = Field(default="", description="Booking confirmation ID")
    flight_id: str = Field(default="", description="The booked flight ID")
    status: str = Field(default="success", description="Booking status")
    message: str = Field(default="", description="Status message")

class BookingConfirmationResponse(BaseModel):
    """Response from the booking confirmation tool."""

    confirmation_sent: bool = Field(default=False, description="Whether confirmation was sent")
    method: str = Field(default="email", description="Delivery method")
    message: str = Field(default="", description="Confirmation details")

@tool_simulator.tool(output_schema=FlightSearchResponse)
def search_flights(origin: str, destination: str, date: str) -> dict[str, Any]:
    """Search for available flights between two cities on a given date."""
    pass

@tool_simulator.tool(output_schema=BookFlightResponse)
def book_flight(flight_id: str) -> dict[str, Any]:
    """Book a specific flight by its flight ID. Returns booking confirmation."""
    pass

@tool_simulator.tool(output_schema=BookingConfirmationResponse)
def send_booking_confirmation(booking_id: str = "", flight_id: str = "", method: str = "email") -> dict[str, Any]:
    """Send booking confirmation or fallback link to the user via email or SMS."""
    pass

# 2. Create the ChaosPlugin
chaos_plugin = ChaosPlugin()

# 3. Define named effect maps
effect_maps = {
    # Single-tool, pre-hook: tool call is cancelled before execution
    "search_timeout": {
        "tool_effects": {"search_flights": [Timeout()]},
    },
    # Two-tool, post-hook: tools execute but responses are silently corrupted
    "book_corrupt_and_confirm_truncated": {
        "tool_effects": {
            "book_flight": [CorruptValues(corrupt_ratio=0.8)],
            "send_booking_confirmation": [TruncateFields(max_length=5)],
        },
    },
    # All-tool, mixed pre+post: combines hard failures with silent corruption
    "total_chaos": {
        "tool_effects": {
            "search_flights": [NetworkError()],
            "book_flight": [ExecutionError()],
            "send_booking_confirmation": [RemoveFields(remove_ratio=0.7)],
        },
    },
}

# 4. Define the task function
# Pre-create tool instances once (avoids registry issues across runs)
_search_tool = tool_simulator.get_tool("search_flights")
_book_tool = tool_simulator.get_tool("book_flight")
_confirm_tool = tool_simulator.get_tool("send_booking_confirmation")

def travel_agent_task(case: ChaosCase) -> dict:
    """Run the travel agent with a single user query."""
    logger.info(f"\n{'─'*60}")
    logger.info(f"  Case: {case.name}")
    logger.info(f"  User: {case.input}")

    agent = Agent(
        system_prompt=(
            "You are a travel booking assistant. You help users search for flights, "
            "book them, and send confirmations. Use the available tools to complete "
            "the user's request. Today's date is May 18, 2025.\n\n"
            "Always use the tools directly — do not ask the user for clarification "
            "if you can infer reasonable values from context.\n\n"
            "If a tool fails or returns an error:\n"
            "- Acknowledge the failure honestly to the user\n"
            "- Try an alternative approach if possible\n"
            "- Do NOT hallucinate successful results\n"
            "- Do NOT retry more than once\n\n"
            "If tool results look suspicious (e.g., $0 fares, past dates):\n"
            "- Inform the user that results seem unreliable\n"
            "- Suggest alternatives"
        ),
        tools=[_search_tool, _book_tool, _confirm_tool],
        plugins=[chaos_plugin],
        callback_handler=None,
        trace_attributes={"gen_ai.conversation.id": case.session_id, "session.id": case.session_id},
    )

    memory_exporter.clear()
    try:
        result = agent(case.input)
        output = str(result)
    except Exception as e:
        output = f"Agent failed with error: {type(e).__name__}: {str(e)[:200]}"

    logger.info(f"  Agent: {output[:300]}{'...' if len(output) > 300 else ''}")
    logger.info(f"{'─'*60}")

    finished_spans = memory_exporter.get_finished_spans()
    mapper = StrandsInMemorySessionMapper()
    session = mapper.map_to_session(finished_spans, session_id=case.session_id)

    return {"output": output, "trajectory": session}

# 5. Define test cases and expand with effect maps
test_cases = [
    Case(
        name="book_a_flight",
        input="Find me a flight from SFO to JFK on May 20, book the cheapest one, and send me a confirmation.",
    ),
    Case(
        name="search_and_confirm",
        input="Search for flights from Seattle to Tokyo next Tuesday, book one, and email me the confirmation.",
    ),
]

# Expand: 2 cases × (3 effect maps + 1 baseline) = 8 ChaosCase objects
chaos_cases = ChaosCase.expand(test_cases, effect_maps, include_no_effect_baseline=True)

# 6. Create and run the ChaosExperiment
evaluators = [GoalSuccessRateEvaluator()]

experiment = ChaosExperiment(
    cases=chaos_cases,
    evaluators=evaluators,
)

# Run: 8 chaos cases = 8 agent invocations
reports = experiment.run_evaluations(task=travel_agent_task)
reports[0].run_display()
