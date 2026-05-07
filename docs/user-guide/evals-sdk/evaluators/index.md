## Overview

Evaluators assess the quality and performance of conversational agents by analyzing their outputs, behaviors, and goal achievement. The Strands Evals SDK provides a comprehensive set of evaluators that can assess different aspects of agent performance, from individual response quality to multi-turn conversation success.

## Why Evaluators?

Evaluating conversational agents requires more than simple accuracy metrics. Agents must be assessed across multiple dimensions:

**Traditional Metrics:**

-   Limited to exact match or similarity scores
-   Don’t capture subjective qualities like helpfulness
-   Can’t assess multi-turn conversation flow
-   Miss goal-oriented success patterns

**Strands Evaluators:**

-   Assess subjective qualities using LLM-as-a-judge
-   Evaluate multi-turn conversations and trajectories
-   Measure goal completion and user satisfaction
-   Provide structured reasoning for evaluation decisions
-   Support both synchronous and asynchronous evaluation

## When to Use Evaluators

Use evaluators when you need to:

-   **Assess Response Quality**: Evaluate helpfulness, faithfulness, and appropriateness
-   **Measure Goal Achievement**: Determine if user objectives were met
-   **Analyze Tool Usage**: Evaluate tool selection and parameter accuracy
-   **Track Conversation Success**: Assess multi-turn interaction effectiveness
-   **Compare Agent Configurations**: Benchmark different prompts or models
-   **Monitor Production Performance**: Continuously evaluate deployed agents

## Evaluation Levels

Evaluators operate at different levels of granularity:

| Level | Scope | Use Case |
| --- | --- | --- |
| **OUTPUT\_LEVEL** | Single response | Quality of individual outputs |
| **TRACE\_LEVEL** | Single turn | Turn-by-turn conversation analysis |
| **SESSION\_LEVEL** | Full conversation | End-to-end goal achievement |

## Built-in Evaluators

### Response Quality Evaluators

**[OutputEvaluator](/docs/user-guide/evals-sdk/evaluators/output_evaluator/index.md)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: Flexible LLM-based evaluation with custom rubrics
-   **Use Case**: Assess any subjective quality (safety, relevance, tone)

**[HelpfulnessEvaluator](/docs/user-guide/evals-sdk/evaluators/helpfulness_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate response helpfulness from user perspective
-   **Use Case**: Measure user satisfaction and response utility

**[FaithfulnessEvaluator](/docs/user-guide/evals-sdk/evaluators/faithfulness_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Assess factual accuracy and groundedness
-   **Use Case**: Verify responses are truthful and well-supported

**[CorrectnessEvaluator](/docs/user-guide/evals-sdk/evaluators/correctness_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate factual correctness with optional reference comparison
-   **Use Case**: Verify agent answers are correct, with or without ground truth

**[CoherenceEvaluator](/docs/user-guide/evals-sdk/evaluators/coherence_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Assess logical consistency and reasoning quality
-   **Use Case**: Detect contradictions, logical gaps, and disorganized responses

**[ConcisenessEvaluator](/docs/user-guide/evals-sdk/evaluators/conciseness_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate response brevity and efficiency
-   **Use Case**: Ensure agents communicate without unnecessary verbosity

**[ResponseRelevanceEvaluator](/docs/user-guide/evals-sdk/evaluators/response_relevance_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate relevance of responses to user questions
-   **Use Case**: Detect off-topic or tangential responses

**[HarmfulnessEvaluator](/docs/user-guide/evals-sdk/evaluators/harmfulness_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for harmful content detection
-   **Use Case**: Screen responses for dangerous or offensive content

**[RefusalEvaluator](/docs/user-guide/evals-sdk/evaluators/refusal_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for refusal detection
-   **Use Case**: Detect when agents inappropriately refuse to address valid requests

**[StereotypingEvaluator](/docs/user-guide/evals-sdk/evaluators/stereotyping_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for bias and stereotyping detection
-   **Use Case**: Screen responses for biased or stereotypical content against groups

**[InstructionFollowingEvaluator](/docs/user-guide/evals-sdk/evaluators/instruction_following_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for instruction compliance
-   **Use Case**: Verify that agents follow explicit format, length, style, and content constraints

### Tool Usage Evaluators

**[ToolSelectionEvaluator](/docs/user-guide/evals-sdk/evaluators/tool_selection_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate whether correct tools were selected
-   **Use Case**: Assess tool choice accuracy in multi-tool scenarios

**[ToolParameterEvaluator](/docs/user-guide/evals-sdk/evaluators/tool_parameter_evaluator/index.md)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate accuracy of tool parameters
-   **Use Case**: Verify correct parameter values for tool calls

### Conversation Flow Evaluators

**[TrajectoryEvaluator](/docs/user-guide/evals-sdk/evaluators/trajectory_evaluator/index.md)**

-   **Level**: SESSION\_LEVEL
-   **Purpose**: Assess sequence of actions and tool usage patterns
-   **Use Case**: Evaluate multi-step reasoning and workflow adherence

**[InteractionsEvaluator](/docs/user-guide/evals-sdk/evaluators/interactions_evaluator/index.md)**

-   **Level**: SESSION\_LEVEL
-   **Purpose**: Analyze conversation patterns and interaction quality
-   **Use Case**: Assess conversation flow and engagement patterns

### Goal Achievement Evaluators

**[GoalSuccessRateEvaluator](/docs/user-guide/evals-sdk/evaluators/goal_success_rate_evaluator/index.md)**

-   **Level**: SESSION\_LEVEL
-   **Purpose**: Determine if user goals were successfully achieved
-   **Use Case**: Measure end-to-end task completion success

### Deterministic Evaluators

**[Deterministic Evaluators](/docs/user-guide/evals-sdk/evaluators/deterministic_evaluators/index.md)**

-   **Level**: OUTPUT\_LEVEL / SESSION\_LEVEL
-   **Purpose**: Fast, code-based evaluation without LLM judges
-   **Use Case**: Regression testing, CI/CD pipelines, exact match checks
-   **Includes**: `Equals`, `Contains`, `StartsWith`, `ToolCalled`, `StateEquals`

## Custom Evaluators

Create domain-specific evaluators by extending the base `Evaluator` class:

**[CustomEvaluator](/docs/user-guide/evals-sdk/evaluators/custom_evaluator/index.md)**

-   **Purpose**: Implement specialized evaluation logic
-   **Use Case**: Domain-specific requirements not covered by built-in evaluators

## Evaluators vs Simulators

Understanding when to use evaluators versus simulators:

| Aspect | Evaluators | Simulators |
| --- | --- | --- |
| **Role** | Assess quality | Generate interactions |
| **Timing** | Post-conversation | During conversation |
| **Purpose** | Score/judge | Drive/participate |
| **Output** | Evaluation scores | Conversation turns |
| **Use Case** | Quality assessment | Interaction generation |

**Use Together:** Evaluators and simulators complement each other. Use simulators to generate realistic multi-turn conversations, then use evaluators to assess the quality of those interactions.

## Integration with Simulators

Evaluators work seamlessly with simulator-generated conversations:

Required: Session ID Trace Attributes

When using `StrandsInMemorySessionMapper`, you **must** include session ID trace attributes in your agent configuration. This prevents spans from different test cases from being mixed together in the memory exporter.

```python
from strands import Agent
from strands_evals import Case, Experiment, ActorSimulator
from strands_evals.evaluators import HelpfulnessEvaluator, GoalSuccessRateEvaluator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.telemetry import StrandsEvalsTelemetry

def task_function(case: Case) -> dict:
    # Generate multi-turn conversation with simulator
    simulator = ActorSimulator.from_case_for_user_simulator(case=case, max_turns=10)
    agent = Agent(trace_attributes={"session.id": case.session_id})

    # Collect conversation data
    all_spans = []
    user_message = case.input

    while simulator.has_next():
        agent_response = agent(user_message)
        turn_spans = list(memory_exporter.get_finished_spans())
        all_spans.extend(turn_spans)

        user_result = simulator.act(str(agent_response))
        user_message = str(user_result.structured_output.message)

    # Map to session for evaluation
    mapper = StrandsInMemorySessionMapper()
    session = mapper.map_to_session(all_spans, session_id=case.session_id)

    return {"output": str(agent_response), "trajectory": session}

# Use multiple evaluators to assess different aspects
evaluators = [
    HelpfulnessEvaluator(),           # Response quality
    GoalSuccessRateEvaluator(),       # Goal achievement
    ToolSelectionEvaluator(),         # Tool usage
    TrajectoryEvaluator(rubric="...") # Action sequences
]

experiment = Experiment(cases=test_cases, evaluators=evaluators)
reports = experiment.run_evaluations(task_function)
```

## Best Practices

### 1\. Choose Appropriate Evaluation Levels

Match evaluator level to your assessment needs:

```python
# For individual response quality
evaluators = [OutputEvaluator(rubric="Assess response clarity")]

# For turn-by-turn analysis
evaluators = [HelpfulnessEvaluator(), FaithfulnessEvaluator()]

# For end-to-end success
evaluators = [GoalSuccessRateEvaluator(), TrajectoryEvaluator(rubric="...")]
```

### 2\. Combine Multiple Evaluators

Assess different aspects comprehensively:

```python
evaluators = [
    HelpfulnessEvaluator(),      # User experience
    FaithfulnessEvaluator(),     # Accuracy
    ToolSelectionEvaluator(),    # Tool usage
    GoalSuccessRateEvaluator()   # Success rate
]
```

### 3\. Use Clear Rubrics

For custom evaluators, define specific criteria:

```python
rubric = """
Score 1.0 if the response:
- Directly answers the user's question
- Provides accurate information
- Uses appropriate tone

Score 0.5 if the response partially meets criteria
Score 0.0 if the response fails to meet criteria
"""

evaluator = OutputEvaluator(rubric=rubric)
```

### 4\. Leverage Async Evaluation

For better performance with multiple evaluators:

```python
import asyncio

async def run_evaluations():
    evaluators = [HelpfulnessEvaluator(), FaithfulnessEvaluator()]
    tasks = [evaluator.aevaluate(data) for evaluator in evaluators]
    results = await asyncio.gather(*tasks)
    return results
```

## Common Patterns

### Pattern 1: Quality Assessment Pipeline

```python
def assess_response_quality(case: Case, agent_output: str) -> dict:
    evaluators = [
        HelpfulnessEvaluator(),
        FaithfulnessEvaluator(),
        OutputEvaluator(rubric="Assess professional tone")
    ]

    results = {}
    for evaluator in evaluators:
        result = evaluator.evaluate(EvaluationData(
            input=case.input,
            output=agent_output
        ))
        results[evaluator.__class__.__name__] = result.score

    return results
```

### Pattern 2: Tool Usage Analysis

```python
def analyze_tool_usage(session: Session) -> dict:
    evaluators = [
        ToolSelectionEvaluator(),
        ToolParameterEvaluator(),
        TrajectoryEvaluator(rubric="Assess tool usage efficiency")
    ]

    results = {}
    for evaluator in evaluators:
        result = evaluator.evaluate(EvaluationData(trajectory=session))
        results[evaluator.__class__.__name__] = {
            "score": result.score,
            "reasoning": result.reasoning
        }

    return results
```

### Pattern 3: Comparative Evaluation

```python
def compare_agent_versions(cases: list, agents: dict) -> dict:
    evaluators = [HelpfulnessEvaluator(), GoalSuccessRateEvaluator()]
    results = {}

    for agent_name, agent in agents.items():
        agent_scores = []
        for case in cases:
            output = agent(case.input)
            for evaluator in evaluators:
                result = evaluator.evaluate(EvaluationData(
                    input=case.input,
                    output=output
                ))
                agent_scores.append(result.score)

        results[agent_name] = {
            "average_score": sum(agent_scores) / len(agent_scores),
            "scores": agent_scores
        }

    return results
```

## Next Steps

-   [OutputEvaluator](/docs/user-guide/evals-sdk/evaluators/output_evaluator/index.md): Start with flexible custom evaluation
-   [HelpfulnessEvaluator](/docs/user-guide/evals-sdk/evaluators/helpfulness_evaluator/index.md): Assess response helpfulness
-   [CustomEvaluator](/docs/user-guide/evals-sdk/evaluators/custom_evaluator/index.md): Create domain-specific evaluators
-   [Detectors](/docs/user-guide/evals-sdk/detectors/index.md): Understand *why* cases fail with automatic failure detection and root cause analysis

## Related Documentation

-   [Quickstart Guide](/docs/user-guide/evals-sdk/quickstart/index.md): Get started with Strands Evals
-   [Simulators Overview](/docs/user-guide/evals-sdk/simulators/index.md): Learn about simulators
-   [Detectors Overview](/docs/user-guide/evals-sdk/detectors/index.md): Automatic failure diagnosis for agent traces
-   [Experiment Generator](/docs/user-guide/evals-sdk/experiment_generator/index.md): Generate test cases automatically