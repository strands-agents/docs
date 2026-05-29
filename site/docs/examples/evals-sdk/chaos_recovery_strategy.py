import logging
from typing import Any

from pydantic import BaseModel, Field

from strands import Agent
from strands_evals.chaos import ChaosCase, ChaosExperiment, ChaosPlugin, Timeout
from strands_evals.chaos.effects import ExecutionError
from strands_evals.chaos.evaluators import RecoveryStrategyEvaluator
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


class HotelSearchResponse(BaseModel):
    hotels: list[dict[str, Any]] = Field(default_factory=list)
    total_results: int = Field(default=0)
    status: str = Field(default="success")


class BookFlightResponse(BaseModel):
    booking_id: str = Field(default="")
    flight_id: str = Field(default="")
    status: str = Field(default="success")
    message: str = Field(default="")


@tool_simulator.tool(output_schema=FlightSearchResponse)
def search_flights(origin: str, destination: str, date: str) -> dict[str, Any]:
    """Search for available flights between two cities on a given date."""
    pass


@tool_simulator.tool(output_schema=HotelSearchResponse)
def search_hotels(city: str, check_in: str, check_out: str) -> dict[str, Any]:
    """Search for available hotels in a city for given dates."""
    pass


@tool_simulator.tool(output_schema=BookFlightResponse)
def book_flight(flight_id: str) -> dict[str, Any]:
    """Book a specific flight by its flight ID."""
    pass


chaos_plugin = ChaosPlugin()

# Two cases that test recovery strategy:
# 1. Flight search times out but hotel search works — agent should pivot to hotel search
# 2. Flight search fails permanently — agent should try once, then move on
chaos_cases = [
    ChaosCase(
        name="flight_timeout_hotel_available",
        input="Plan my trip to Tokyo: find flights from SFO and hotels for May 20-23.",
        effects={"tool_effects": {"search_flights": [Timeout()]}},
    ),
    ChaosCase(
        name="flight_and_booking_fail",
        input="Find a flight from NYC to London on June 1 and book the cheapest option.",
        effects={
            "tool_effects": {
                "search_flights": [ExecutionError(error_message="Internal server error")],
                "book_flight": [ExecutionError(error_message="Service unavailable")],
            },
        },
    ),
]

_search_flights_tool = tool_simulator.get_tool("search_flights")
_search_hotels_tool = tool_simulator.get_tool("search_hotels")
_book_tool = tool_simulator.get_tool("book_flight")


def travel_agent_task(case: ChaosCase) -> dict:
    """Run the travel agent under chaos and return output + trajectory."""
    logger.info(f"\n{'─'*60}")
    logger.info(f"  Case: {case.name}")
    logger.info(f"  User: {case.input}")

    agent = Agent(
        system_prompt=(
            "You are a travel planning assistant. Use the available tools to complete "
            "the user's request. Today's date is May 18, 2025.\n\n"
            "If a tool fails:\n"
            "- Try alternative tools that can partially fulfill the request\n"
            "- Do NOT retry the same failed tool more than once\n"
            "- Do NOT hallucinate results\n"
            "- Complete as much of the request as possible with working tools"
        ),
        tools=[_search_flights_tool, _search_hotels_tool, _book_tool],
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
    evaluators=[RecoveryStrategyEvaluator()],
)

reports = experiment.run_evaluations(task=travel_agent_task)
reports[0].run_display()
