# DeepSeek Reasoning Agent Example

This example demonstrates how to use DeepSeek models with Strands Agents, showcasing both the chat and reasoning models for different use cases including complex problem-solving, code completion (Fill-in-the-Middle), and structured output.

## What You'll Learn

- How to use DeepSeek's chat and reasoning models
- Leveraging reasoning models for complex problem-solving
- Using DeepSeek for code completion and analysis
- Combining structured output with reasoning capabilities
- Best practices for different DeepSeek model configurations

## Prerequisites

Before running this example, you'll need:

1. A DeepSeek API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Set the environment variable: `export DEEPSEEK_API_KEY="your-api-key"`
3. Install DeepSeek dependencies: `pip install 'strands-agents[deepseek]'`

## Key Features Demonstrated

### 1. Basic Chat Model Usage

The example shows how to use DeepSeek's general-purpose chat model for everyday conversations and explanations:

```python
model = DeepSeekModel(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    model_id="deepseek-chat",
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
    }
)

agent = Agent(model=model)
response = agent("Explain quantum computing in simple terms.")
```

### 2. Reasoning Model for Complex Problems

DeepSeek's reasoning model excels at step-by-step problem-solving:

```python
reasoning_model = DeepSeekModel(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    model_id="deepseek-reasoner",
    params={
        "max_tokens": 32000,  # Reasoning models need more tokens
    }
)

# Complex multi-step problem
problem = """
A company has 3 departments: Sales, Marketing, and Engineering.
- Sales has 25% more employees than Marketing
- Engineering has 40% fewer employees than Sales
- The total number of employees across all departments is 180

How many employees are in each department?
"""

response = agent(problem)
```

### 3. Code Completion (Fill-in-the-Middle)

DeepSeek models are excellent for code completion tasks:

```python
fim_prompt = """
Complete the missing function implementation:

```python
def fibonacci_sequence(n):
    '''Generate the first n numbers in the Fibonacci sequence.'''
    # TODO: Implement this function
    pass
```

Fill in the implementation for the fibonacci_sequence function.
"""

response = agent(fim_prompt)
```

### 4. Structured Reasoning Output

Combine the power of reasoning models with structured output:

```python
class MathProblem(BaseModel):
    """Structured representation of a math problem solution."""
    problem_type: str = Field(description="Type of mathematical problem")
    given_information: List[str] = Field(description="List of given facts")
    solution_steps: List[str] = Field(description="Step-by-step solution process")
    final_answer: str = Field(description="Final numerical answer with units")
    verification: Optional[str] = Field(description="Verification of the answer")

result = agent.structured_output(MathProblem, complex_problem)
```

### 5. Code Analysis

Use DeepSeek for comprehensive code analysis:

```python
class CodeAnalysis(BaseModel):
    language: str = Field(description="Programming language")
    complexity: str = Field(description="Time/space complexity analysis")
    improvements: List[str] = Field(description="Suggested improvements")
    bugs: List[str] = Field(description="Potential bugs or issues")
    explanation: str = Field(description="What the code does")

result = agent.structured_output(CodeAnalysis, code_to_analyze)
```

## Complete Example Code

```python
#!/usr/bin/env python3
"""
DeepSeek Reasoning Agent Example

This example demonstrates how to use DeepSeek models with Strands Agents,
showcasing both the chat and reasoning models for different use cases.
"""

import os
from typing import List, Optional
from pydantic import BaseModel, Field
from strands import Agent
from strands.models.deepseek import DeepSeekModel


def basic_chat_example():
    """Basic example using DeepSeek chat model."""
    print("\\n--- Basic Chat Example ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 1000,
            "temperature": 0.7,
        }
    )
    
    agent = Agent(model=model)
    response = agent("Explain quantum computing in simple terms.")
    
    print("Response:", response.message["content"][0]["text"])


def reasoning_model_example():
    """Example using DeepSeek reasoning model for complex problem solving."""
    print("\\n--- Reasoning Model Example ---")
    
    reasoning_model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-reasoner",
        params={
            "max_tokens": 32000,  # Reasoning models need more tokens
        }
    )
    
    agent = Agent(model=reasoning_model)
    
    # Complex math problem that benefits from step-by-step reasoning
    problem = \"\"\"
    A company has 3 departments: Sales, Marketing, and Engineering.
    - Sales has 25% more employees than Marketing
    - Engineering has 40% fewer employees than Sales
    - The total number of employees across all departments is 180
    
    How many employees are in each department?
    \"\"\"
    
    response = agent(problem)
    print("Reasoning and Solution:")
    print(response.message["content"][0]["text"])


def code_completion_example():
    """Example using DeepSeek for Fill-in-the-Middle (FIM) code completion."""
    print("\\n--- Code Completion (FIM) Example ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 500,
            "temperature": 0.2,  # Lower temperature for more consistent code
        }
    )
    
    agent = Agent(model=model)
    
    # FIM-style prompt for code completion
    fim_prompt = \"\"\"
    Complete the missing function implementation:
    
    ```python
    def fibonacci_sequence(n):
        '''Generate the first n numbers in the Fibonacci sequence.'''
        # TODO: Implement this function
        # Should return a list of the first n Fibonacci numbers
        pass
    
    def main():
        result = fibonacci_sequence(10)
        print(f"First 10 Fibonacci numbers: {result}")
    ```
    
    Fill in the implementation for the fibonacci_sequence function.
    \"\"\"
    
    response = agent(fim_prompt)
    print("Code completion:")
    print(response.message["content"][0]["text"])


class MathProblem(BaseModel):
    """Structured representation of a math problem solution."""
    problem_type: str = Field(description="Type of mathematical problem")
    given_information: List[str] = Field(description="List of given facts")
    solution_steps: List[str] = Field(description="Step-by-step solution process")
    final_answer: str = Field(description="Final numerical answer with units")
    verification: Optional[str] = Field(description="Verification of the answer")


def structured_reasoning_example():
    """Example combining structured output with reasoning model."""
    print("\\n--- Structured Reasoning Example ---")
    
    reasoning_model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-reasoner",
        params={
            "max_tokens": 32000,
        }
    )
    
    agent = Agent(model=reasoning_model)
    
    problem = \"\"\"
    A water tank can be filled by two pipes. Pipe A can fill the tank in 6 hours,
    and Pipe B can fill it in 4 hours. If both pipes work together, how long will
    it take to fill the tank?
    \"\"\"
    
    result = agent.structured_output(MathProblem, problem)
    
    print(f"Problem Type: {result.problem_type}")
    print(f"Given Information: {result.given_information}")
    print("\\nSolution Steps:")
    for i, step in enumerate(result.solution_steps, 1):
        print(f"  {i}. {step}")
    print(f"\\nFinal Answer: {result.final_answer}")
    if result.verification:
        print(f"Verification: {result.verification}")


if __name__ == "__main__":
    print("DeepSeek Reasoning Agent Examples\\n")
    
    # Check if API key is available
    if not os.getenv("DEEPSEEK_API_KEY"):
        print("Please set DEEPSEEK_API_KEY environment variable to run these examples.")
        exit(1)
    
    try:
        basic_chat_example()
        reasoning_model_example()
        code_completion_example()
        structured_reasoning_example()
        
    except Exception as e:
        print(f"Error running examples: {e}")
        print("Make sure you have a valid DeepSeek API key and sufficient credits.")
    
    print("\\nExamples completed.")
```

## Running the Example

1. Set your DeepSeek API key:
   ```bash
   export DEEPSEEK_API_KEY="your-deepseek-api-key"
   ```

2. Install dependencies:
   ```bash
   pip install 'strands-agents[deepseek]'
   ```

3. Run the example:
   ```bash
   python deepseek_reasoning_agent.py
   ```

## Key Takeaways

- **DeepSeek Chat Model**: Great for general conversations, explanations, and code completion
- **DeepSeek Reasoning Model**: Excels at complex problem-solving with step-by-step reasoning
- **Structured Output**: Works well with both models for type-safe responses
- **Code Tasks**: DeepSeek models are particularly strong at programming-related tasks
- **Token Limits**: Reasoning models typically need higher token limits (32k recommended)
- **Temperature Settings**: Use lower temperatures (0.2-0.3) for code tasks, higher (0.7-0.8) for creative tasks

## Use Cases

This example demonstrates several practical use cases:

- **Educational**: Step-by-step problem solving for math and science
- **Development**: Code completion, analysis, and debugging assistance  
- **Business**: Complex calculations and data analysis
- **Research**: Structured information extraction and reasoning

## Learn More

- [DeepSeek Model Provider Documentation](../../user-guide/concepts/model-providers/deepseek.md)
- [Structured Output Guide](../../user-guide/concepts/agents/structured-output.md)
- [DeepSeek Platform](https://platform.deepseek.com/)