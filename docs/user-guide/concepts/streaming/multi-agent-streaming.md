# Multi-Agent Streaming

Multi-agent systems (Graph and Swarm) support real-time streaming of events during execution, providing visibility into the orchestration process, node execution, and agent handoffs. This enables responsive UIs, real-time monitoring, and debugging of complex multi-agent workflows.

Both Graph and Swarm use the same `stream_async` method pattern as single agents, yielding events as execution progresses.

## Multi-Agent Event Types

In addition to the standard [streaming events](./overview.md#event-types), multi-agent systems emit coordination events:

### Multi-Agent Coordination Events
- `multi_agent_node_start`: When a node begins execution
  - `node_id`: Unique identifier for the node
  - `node_type`: Type of node ("agent", "swarm", "graph")
- `multi_agent_node_stream`: Forwarded events from agents/multi-agents with node context
  - `node_id`: Identifier of the node generating the event
  - `event`: The original agent event
- `multi_agent_node_stop`: When a node completes execution
  - `node_id`: Unique identifier for the node
  - `node_result`: Complete NodeResult with execution details, metrics, and status
- `multi_agent_handoff`: When control is handed off between agents (Swarm only)
  - `from_node`: Node ID handing off control
  - `to_node`: Node ID receiving control
  - `message`: Handoff message explaining the transfer
- `multi_agent_result`: Final multi-agent result
  - `result`: The final GraphResult or SwarmResult

## Graph Streaming

Graphs stream events as nodes execute according to the graph structure. Events are emitted in real-time, including from parallel node execution.

```python
from strands import Agent
from strands.multiagent import GraphBuilder

# Create specialized agents
researcher = Agent(name="researcher", system_prompt="You are a research specialist...")
analyst = Agent(name="analyst", system_prompt="You are an analysis specialist...")

# Build the graph
builder = GraphBuilder()
builder.add_node(researcher, "research")
builder.add_node(analyst, "analysis")
builder.add_edge("research", "analysis")
builder.set_entry_point("research")
graph = builder.build()

# Stream events during execution
async for event in graph.stream_async("Research and analyze market trends"):
    # Track node execution
    if event.get("multi_agent_node_start"):
        print(f"🔄 Node {event['node_id']} starting ({event['node_type']})")
    
    # Monitor agent events within nodes
    elif event.get("multi_agent_node_stream"):
        inner_event = event["event"]
        
        # Access nested agent events
        if "data" in inner_event:
            print(inner_event["data"], end="")
    
    # Track node completion
    elif event.get("multi_agent_node_stop"):
        node_result = event["node_result"]
        print(f"\n✅ Node {event['node_id']} completed in {node_result.execution_time}ms")
    
    # Get final result
    elif event.get("multi_agent_result"):
        result = event["result"]
        print(f"Graph completed: {result.status}")
```

## Swarm Streaming

Swarms stream events as agents collaborate and hand off tasks. Handoff events provide visibility into the autonomous coordination process.

```python
from strands import Agent
from strands.multiagent import Swarm

# Create specialized agents
coordinator = Agent(name="coordinator", system_prompt="You coordinate tasks...")
specialist = Agent(name="specialist", system_prompt="You handle specialized work...")

# Create swarm
swarm = Swarm([coordinator, specialist])

# Stream events during execution
async for event in swarm.stream_async("Design and implement a REST API"):
    # Track node execution
    if event.get("multi_agent_node_start"):
        print(f"🔄 Agent {event['node_id']} taking control")
    
    # Monitor agent events
    elif event.get("multi_agent_node_stream"):
        inner_event = event["event"]
        
        if "data" in inner_event:
            print(inner_event["data"], end="")
    
    # Track handoffs
    elif event.get("multi_agent_handoff"):
        print(f"\n🔀 Handoff: {event['from_node']} → {event['to_node']}")
    
    # Track node completion
    elif event.get("multi_agent_node_stop"):
        node_result = event["node_result"]
        print(f"✅ Agent {event['node_id']} completed in {node_result.execution_time}ms")
    
    # Get final result
    elif event.get("multi_agent_result"):
        result = event["result"]
        print(f"Swarm completed: {result.status}")
```



## Accessing Node Results

Node stop events include the complete NodeResult with execution details:

```python
from strands import Agent
from strands.multiagent import GraphBuilder

# Create graph
agent_a = Agent(name="agent_a", system_prompt="You are agent A...")
agent_b = Agent(name="agent_b", system_prompt="You are agent B...")

builder = GraphBuilder()
builder.add_node(agent_a, "a")
builder.add_node(agent_b, "b")
builder.add_edge("a", "b")
graph = builder.build()

# Collect node results
node_results = {}

async for event in graph.stream_async("Process task"):
    if event.get("multi_agent_node_stop"):
        node_id = event["node_id"]
        node_result = event["node_result"]
        
        # Store result for analysis
        node_results[node_id] = {
            "status": node_result.status,
            "execution_time": node_result.execution_time,
            "tokens": node_result.accumulated_usage["totalTokens"],
            "result": node_result.result
        }

# Analyze results
for node_id, result in node_results.items():
    print(f"{node_id}: {result['execution_time']}ms, {result['tokens']} tokens")
```

## Next Steps

- Learn about [Graph patterns](../multi-agent/graph.md) for structured workflows
- Explore [Swarm patterns](../multi-agent/swarm.md) for autonomous collaboration
- See [Async Iterators](./async-iterators.md) for async streaming patterns
- Review [Callback Handlers](./callback-handlers.md) for synchronous event processing
