import asyncio
from strands import Agent, tool
from typing import Dict, Any

from strands_evals import Case, Experiment
from strands_evals.evaluators import ToolParameterAccuracyEvaluator, ToolSelectionAccuracyEvaluator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.telemetry import StrandsEvalsTelemetry

from strands_evals.simulation import ToolSimulator

# Setup telemetry
telemetry = StrandsEvalsTelemetry().setup_in_memory_exporter()
memory_exporter = telemetry.in_memory_exporter

# === Natural Language Initial States ===

INVENTORY_INITIAL_STATE = """
The inventory system contains 5 products:
- PROD-001: Wireless Bluetooth Headphones (125 units in stock)
- PROD-002: Ergonomic Office Chair (45 units in stock)  
- PROD-003: Stainless Steel Water Bottle (0 units - out of stock)
- PROD-004: Gaming Mechanical Keyboard (78 units in stock)
- PROD-005: Portable Phone Charger (230 units in stock)

The system last updated inventory counts at 2024-06-18 14:30 UTC.
Restocking for PROD-003 is scheduled for 2024-06-20.
"""

CUSTOMER_DB_INITIAL_STATE = """
Customer database contains 50,000+ customer records with the following segments:
- Premium customers (5,000): High value, low churn risk
- Standard customers (35,000): Medium value, moderate engagement
- Basic customers (10,000): Lower value, higher support needs

Recent activity shows 85% customer satisfaction rate.
Payment processing has 99.2% success rate.
Average response time for customer queries is 2.3 seconds.
"""

# === Tool Registration with Decorators ===

# === Function Tools ===
@tool
@ToolSimulator.function_tool(
    initial_state_description=INVENTORY_INITIAL_STATE,
    share_state_id="inventory_system"
)
def get_inventory(product_id: str) -> Dict[str, Any]:
    """Get inventory information for a specific product."""
    pass

@tool
@ToolSimulator.function_tool(
    initial_state_description=INVENTORY_INITIAL_STATE,
    share_state_id="inventory_system"
)
def update_inventory(product_id: str, quantity: int, operation: str) -> Dict[str, Any]:
    """Update inventory levels for a specific product."""
    pass

# === MCP Tools ===
customer_profile_mcp_schema = {
    "name": "get_customer_profile",
    "description": "Get customer profile information",
    "tool_schema": {
        "inputSchema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string", "description": "Customer ID"}
            },
            "required": ["customer_id"]
        }
    }
}

@tool
@ToolSimulator.mcp_tool(
    schema=customer_profile_mcp_schema,
    initial_state_description=CUSTOMER_DB_INITIAL_STATE,
    share_state_id="customer_database"
)
def get_customer_profile(customer_id: str) -> Dict[str, Any]:
    """Get customer profile via MCP protocol."""
    pass

update_customer_profile_mcp_schema = {
    "name": "update_customer_profile",
    "description": "Update customer profile information",
    "tool_schema": {
        "inputSchema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string", "description": "Customer ID"},
                "profile_data": {"type": "object", "description": "Profile data to update"}
            },
            "required": ["customer_id", "profile_data"]
        }
    }
}

@tool
@ToolSimulator.mcp_tool(
    schema=update_customer_profile_mcp_schema,
    initial_state_description=CUSTOMER_DB_INITIAL_STATE,
    share_state_id="customer_database"
)
def update_customer_profile(customer_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update customer profile via MCP protocol."""
    pass

# === API Tool ===
payment_api_schema = {
    "name": "process_payment",
    "description": "Process payment transaction",
    "tool_schema": {
        "openapi": "3.0.0",
        "info": {"title": "Payment API", "version": "1.0.0"},
        "paths": {
            "/payments/process": {
                "post": {
                    "summary": "Process payment transaction",
                    "requestBody": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "customer_id": {"type": "string"},
                                        "amount": {"type": "number"},
                                        "payment_method": {"type": "string"}
                                    },
                                    "required": ["customer_id", "amount", "payment_method"]
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Payment processed successfully",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "status": {"type": "string"},
                                            "transaction_id": {"type": "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@tool
@ToolSimulator.api_tool(
    name="process_payment",
    path="/payments/process",
    method="POST",
    schema=payment_api_schema
)
def process_payment(customer_id: str, amount: float, payment_method: str) -> Dict[str, Any]:
    """Process payment transaction via REST API."""
    pass

# === Task Function ===
def task_function(case: Case) -> dict:
    """Execute agent with simulated tools and capture trajectory."""
    # Clear telemetry before each test
    memory_exporter.clear()
    
    # ToolSimulator generates overrides per case and tool_context
    tool_simulator = ToolSimulator.from_case_for_tool_simulator(
        case=case,
    )
    
    # Create agent with tools attached
    all_tools = [
        get_inventory,
        update_inventory, 
        get_customer_profile,
        update_customer_profile,
        process_payment
    ]
    
    agent = Agent(
        trace_attributes={"gen_ai.conversation.id": case.session_id, "session.id": case.session_id},
        system_prompt="You are a helpful e-commerce assistant that can manage inventory, customer profiles, and process payments.",
        tools=all_tools,
        callback_handler=None,
    )
    
    # Execute the agent with user input
    agent_response = agent(case.input)
    
    # Capture telemetry and map to session
    finished_spans = memory_exporter.get_finished_spans()
    mapper = StrandsInMemorySessionMapper()
    session = mapper.map_to_session(finished_spans, session_id=case.session_id)
    
    return {"output": str(agent_response), "trajectory": session}


# === Experiment Setup and Execution ===
async def main():
    """Run the tool simulator evaluation experiment."""
    print("=== Tool Simulator Evaluation Example ===")
    
    # Create test cases for e-commerce assistant operations
    test_cases = [
        Case(
            name="Check inventory for out-of-stock item",
            input="Can you check the inventory for the Stainless Steel Water Bottle? I need to know if it's in stock.",
            session_id="session_1"
        ),
        Case(
            name="Update inventory after restocking",
            input="We just received 50 units of PROD-003 (Stainless Steel Water Bottle). Please update the inventory to add these items.",
            session_id="session_2"
        ),
        Case(
            name="Get customer profile for premium customer",
            input="I need to look up the customer profile for customer ID CUST-12345. They're calling about their recent order.",
            session_id="session_3"
        ),
        Case(
            name="Process payment for a customer",
            input="Process a payment of $149.99 for customer CUST-67890 using their credit card ending in 1234.",
            session_id="session_4"
        ),
        Case(
            name="Complex multi-tool scenario",
            input="Customer CUST-55555 wants to buy 2 Gaming Mechanical Keyboards. Check if we have enough inventory, then process the payment of $299.98 with their PayPal account.",
            session_id="session_5"
        )
    ]
    
    # Create experiment
    experiment = Experiment[str, str](
        cases=test_cases,
        evaluators=[
            ToolParameterAccuracyEvaluator(),
            ToolSelectionAccuracyEvaluator(),
        ]
    )

    # Run evaluations
    reports = experiment.run_evaluations(task_function)

    # Display results
    print(f"\nGenerated {len(reports)} evaluation reports")
    for i, report in enumerate(reports):
        print(f"\n--- Report {i+1} ---")
        report.run_display()
    
    # Clean up
    print("\nCleaning up tool registry...")
    ToolSimulator.clear_registry()
    print("Evaluation completed!")

if __name__ == "__main__":
    asyncio.run(main())
