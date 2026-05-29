import logging
from typing import Any

from pydantic import BaseModel, Field

from strands import Agent
from strands_evals.chaos import ChaosCase, ChaosExperiment, ChaosPlugin, TruncateFields
from strands_evals.chaos.effects import NetworkError
from strands_evals.chaos.evaluators import PartialCompletionEvaluator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.simulation.tool_simulator import ToolSimulator
from strands_evals.telemetry import StrandsEvalsTelemetry

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

telemetry = StrandsEvalsTelemetry().setup_in_memory_exporter()
memory_exporter = telemetry.in_memory_exporter

tool_simulator = ToolSimulator()


class FlightSearchResponse(BaseModel):
    flights: list[dict[str, Any]] = Field(default_factory=list)
    total_results: int = Field(default=0)
    status: str = Field(default="success")


class BookFlightResponse(BaseModel):
    booking_id: str = Field(default="")
    flight_id: str = Field(default="")
    status: str = Field(default="success")
    message: str = Field(default="")


class BookingConfirmationResponse(BaseModel):
    confirmation_sent: bool = Field(default=False)
    method: str = Field(default="email")
    message: str = Field(default="")


@tool_simulator.tool(output_schema=FlightSearchResponse)
def search_flights(origin: str, destination: str, date: str) -> dict[str, Any]:
    """Search for available flights between two cities on a given date."""
    pass


@tool_simulator.tool(output_schema=BookFlightResponse)
def book_flight(flight_id: str) -> dict[str, Any]:
    """Book a specific flight by its flight ID."""
    pass


@tool_simulator.tool(output_schema=BookingConfirmationResponse)
def send_booking_confirmation(booking_id: str = "", flight_id: str = "", method: str = "email") -> dict[str, Any]:
    """Send booking confirmation to the user via email or SMS."""
    pass


chaos_plugin = ChaosPlugin()

# Two cases that test partial completion:
# 1. Search works (truncated) but booking fails — user gets degraded flight info but no reservation
# 2. Search and booking work but confirmation fails — user gets most of what they asked for
chaos_cases = [
    ChaosCase(
        name="search_degraded_booking_fails",
        input="Find me a flight from SFO to JFK on May 20, book the cheapest one, and send me a confirmation.",
        effects={
            "tool_effects": {
                "search_flights": [TruncateFields(max_length=5)],
                "book_flight": [NetworkError(error_message="Connection reset by peer")],
            },
        },
    ),
    ChaosCase(
        name="confirmation_fails",
        input="Search for flights from Seattle to Tokyo next Tuesday, book one, and email me the confirmation.",
        effects={
            "tool_effects": {
                "send_booking_confirmation": [NetworkError(error_message="SMTP server unreachable")],
            },
        },
    ),
]

_search_tool = tool_simulator.get_tool("search_flights")
_book_tool = tool_simulator.get_tool("book_flight")
_confirm_tool = tool_simulator.get_tool("send_booking_confirmation")


def travel_agent_task(case: ChaosCase) -> dict:
    """Run the travel agent under chaos and return output + trajectory."""
    logger.info(f"\n{'─'*60}")
    logger.info(f"  Case: {case.name}")
    logger.info(f"  User: {case.input}")

    agent = Agent(
        system_prompt=(
            "You are a travel booking assistant. Use the available tools to complete "
            "the user's request. Today's date is May 18, 2025.\n\n"
            "If a tool fails or returns an error:\n"
            "- Acknowledge the failure honestly\n"
            "- Complete as much of the request as possible\n"
            "- Do NOT hallucinate successful results\n"
            "- Do NOT retry more than once"
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


experiment = ChaosExperiment(
    cases=chaos_cases,
    evaluators=[PartialCompletionEvaluator()],
)

reports = experiment.run_evaluations(task=travel_agent_task)
reports[0].run_display()
