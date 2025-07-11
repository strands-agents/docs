# Multi-Agent Systems and Swarm Intelligence

An agent swarm is a collection of autonomous AI agents working together to solve complex problems through collaboration. Inspired by natural systems like ant colonies or bird flocks, agent swarms leverage collective intelligence where the combined output exceeds what any single agent could produce. By distributing tasks and sharing information, swarms can tackle complex problems more efficiently and effectively than individual agents working in isolation.

Multi-agent systems consist of multiple interacting intelligent agents within an environment. These systems enable:

- **Distributed Problem Solving**: Breaking complex tasks into subtasks for parallel processing
- **Information Sharing**: Agents exchange insights to build collective knowledge
- **Specialization**: Different agents focus on specific aspects of a problem
- **Redundancy**: Multiple agents working on similar tasks improve reliability
- **Emergent Intelligence**: The system exhibits capabilities beyond those of its individual components

Swarm intelligence emphasizes:

1. **Decentralized Control**: No single agent directs the entire system
1. **Local Interactions**: Agents primarily interact with nearby agents
1. **Simple Rules**: Individual agents follow relatively simple behaviors
1. **Emergent Complexity**: Complex system behavior emerges from simple agent interactions

### Components of a Swarm Architecture

A swarm architecture consists of several key components:

#### 1. Communication Patterns

- **Mesh**: All agents can communicate with all other agents

```
graph TD
    Agent1[Agent 1] <--> Agent2[Agent 2]
    Agent1 <--> Agent3[Agent 3]
    Agent2 <--> Agent3
```

#### 2. Shared Memory Systems

For agents to collaborate effectively, they need mechanisms to share information:

- **Centralized Knowledge Repositories**: Common storage for collective insights
- **Message Passing Systems**: Direct communication between agents
- **Blackboard Systems**: Shared workspace where agents post and read information

#### 3. Coordination Mechanisms

Swarms require coordination to ensure agents work together effectively:

- **Collaborative**: Agents build upon others' insights and seek consensus
- **Competitive**: Agents develop independent solutions and unique perspectives
- **Hybrid**: Balances cooperation with independent exploration

#### 4. Task Distribution

How tasks are allocated affects the swarm's efficiency:

- **Static Assignment**: Tasks are pre-assigned to specific agents
- **Dynamic Assignment**: Tasks are allocated based on agent availability and capability
- **Self-Organization**: Agents select tasks based on local information

## Creating a Swarm with Strands Agents

Strands Agents SDK allows you to create swarms using existing Agent objects, even when they use different model providers or have different configurations. While various communication architectures are possible (hierarchical, parallel, sequential, and mesh), the following example demonstrates a mesh architecture implementation, which provides a flexible foundation for agent-to-agent communication.

#### Mesh Swarm Architecture

```
graph TD
    Research[Research Agent] <---> Creative[Creative Agent]
    Research <---> Critical[Critical Agent]
    Creative <---> Critical
    Creative <---> Summarizer[Summarizer Agent]
    Critical <---> Summarizer
    Research <---> Summarizer

    class Research top
    class Creative,Critical middle
    class Summarizer bottom
```

In a mesh architecture, all agents can communicate directly with each other. The following example demonstrates a swarm of specialized agents using mesh communication to solve problems collaboratively:

```
from strands import Agent

# Create specialized agents with different expertise
research_agent = Agent(system_prompt=("""You are a Research Agent specializing in gathering and analyzing information.
Your role in the swarm is to provide factual information and research insights on the topic.
You should focus on providing accurate data and identifying key aspects of the problem.
When receiving input from other agents, evaluate if their information aligns with your research.
"""), 
callback_handler=None)

creative_agent = Agent(system_prompt=("""You are a Creative Agent specializing in generating innovative solutions.
Your role in the swarm is to think outside the box and propose creative approaches.
You should build upon information from other agents while adding your unique creative perspective.
Focus on novel approaches that others might not have considered.
"""), 
callback_handler=None)

critical_agent = Agent(system_prompt=("""You are a Critical Agent specializing in analyzing proposals and finding flaws.
Your role in the swarm is to evaluate solutions proposed by other agents and identify potential issues.
You should carefully examine proposed solutions, find weaknesses or oversights, and suggest improvements.
Be constructive in your criticism while ensuring the final solution is robust.
"""), 
callback_handler=None)

summarizer_agent = Agent(system_prompt="""You are a Summarizer Agent specializing in synthesizing information.
Your role in the swarm is to gather insights from all agents and create a cohesive final solution.
You should combine the best ideas and address the criticisms to create a comprehensive response.
Focus on creating a clear, actionable summary that addresses the original query effectively.
""")

```

The mesh communication is implemented using a dictionary to track messages between agents:

```
# Dictionary to track messages between agents (mesh communication)
messages = {
    "research": [],
    "creative": [],
    "critical": [],
    "summarizer": []
}

```

The swarm operates in multiple phases, with each agent first analyzing the problem independently:

```
# Phase 1: Initial analysis by each specialized agent
research_result = research_agent(query)
creative_result = creative_agent(query)
critical_result = critical_agent(query)

```

After the initial analysis, results are shared with all other agents (mesh communication):

```
# Share results with all other agents (mesh communication)
messages["creative"].append(f"From Research Agent: {research_result}")
messages["critical"].append(f"From Research Agent: {research_result}")
messages["summarizer"].append(f"From Research Agent: {research_result}")

messages["research"].append(f"From Creative Agent: {creative_result}")
messages["critical"].append(f"From Creative Agent: {creative_result}")
messages["summarizer"].append(f"From Creative Agent: {creative_result}")

messages["research"].append(f"From Critical Agent: {critical_result}")
messages["creative"].append(f"From Critical Agent: {critical_result}")
messages["summarizer"].append(f"From Critical Agent: {critical_result}")

```

In the second phase, each agent refines their solution based on input from all other agents:

```
# Phase 2: Each agent refines based on input from others
research_prompt = f"{query}\n\nConsider these messages from other agents:\n" + "\n\n".join(messages["research"])
creative_prompt = f"{query}\n\nConsider these messages from other agents:\n" + "\n\n".join(messages["creative"])
critical_prompt = f"{query}\n\nConsider these messages from other agents:\n" + "\n\n".join(messages["critical"])

refined_research = research_agent(research_prompt)
refined_creative = creative_agent(creative_prompt)
refined_critical = critical_agent(critical_prompt)

# Share refined results with summarizer
messages["summarizer"].append(f"From Research Agent (Phase 2): {refined_research}")
messages["summarizer"].append(f"From Creative Agent (Phase 2): {refined_creative}")
messages["summarizer"].append(f"From Critical Agent (Phase 2): {refined_critical}")

```

Finally, the summarizer agent synthesizes all inputs into a comprehensive solution:

```
# Final phase: Summarizer creates the final solution
summarizer_prompt = f"""
Original query: {query}

Please synthesize the following inputs from all agents into a comprehensive final solution:

{"\n\n".join(messages["summarizer"])}

Create a well-structured final answer that incorporates the research findings, 
creative ideas, and addresses the critical feedback.
"""

final_solution = summarizer_agent(summarizer_prompt)

```

This mesh architecture enables direct communication between all agents, allowing each agent to share insights with every other agent. The specialized roles (research, creative, critical, and summarizer) work together to produce a comprehensive solution that benefits from multiple perspectives and iterative refinement.

### Implementing Shared Memory

While the mesh communication example effectively demonstrates agent collaboration, a shared memory system would enhance the swarm's capabilities by providing:

- A centralized knowledge repository for all agents
- Automated phase tracking and historical knowledge preservation
- Thread-safe concurrent access for improved efficiency
- Persistent storage of insights across multiple interactions

Extending our mesh swarm example with shared memory would replace the message dictionary with a SharedMemory instance, simplifying the code while enabling more sophisticated knowledge management.

## Quick Start with the Swarm Tool

The Strands Agents SDK provides a built-in swarm tool that simplifies the implementation of multi-agent systems, offering a quick start for users. This tool implements the shared memory concept discussed earlier, providing a more sophisticated version of what we described for extending the mesh swarm example.

### Using the Swarm Tool

```
from strands import Agent
from strands_tools import swarm

# Create an agent with swarm capability
agent = Agent(tools=[swarm])

# Process a complex task with multiple agents in parallel
result = agent.tool.swarm(
    task="Analyze this dataset and identify market trends",
    swarm_size=4,
    coordination_pattern="collaborative"
)

# The result contains contributions from all swarm agents
print(result["content"])

```

### SharedMemory Implementation

The swarm tool implements a SharedMemory system that serves as a central knowledge repository for all agents in the swarm. This system maintains a thread-safe store where agents can record their contributions with metadata (including agent ID, content, phase, and timestamp). It tracks processing phases, allowing agents to retrieve only current-phase knowledge or access historical information. This shared memory architecture enables concurrent collaboration, maintains contribution history, and ensures smooth information flow between agents—all essential features for effective collective intelligence in a swarm.

The full implementation of the swarm tool can be found in the [Strands Tools repository](https://github.com/strands-agents/tools/blob/main/src/strands_tools/swarm.py).

### Key Parameters

- **task**: The main task to be processed by the swarm
- **swarm_size**: Number of agents in the swarm (1-10)
- **coordination_pattern**: How agents should coordinate
  - **collaborative**: Agents build upon others' insights
  - **competitive**: Agents develop independent solutions
- **hybrid**: Balances cooperation with independent exploration

### How the Swarm Tool Works

1. **Initialization**: Creates a swarm with shared memory and specialized agents
1. **Phase Processing**: Agents work in parallel using ThreadPoolExecutor
1. **Knowledge Sharing**: Agents store and retrieve information from shared memory
1. **Result Collection**: Results from all agents are aggregated and presented

## Conclusion

Multi-agent swarms solve complex problems through collective intelligence. The Strands Agents SDK supports both custom implementations and a built-in swarm tool with shared memory. By distributing tasks across specialized agents and enabling effective communication, swarms achieve better results than single agents working alone. Whether using mesh communication patterns or the swarm tool, developers can create systems where multiple agents work together with defined roles, coordination mechanisms, and knowledge sharing.
