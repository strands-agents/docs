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
    print("\n--- Basic Chat Example ---")
    
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
    print("\n--- Reasoning Model Example ---")
    
    reasoning_model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-reasoner",
        params={
            "max_tokens": 32000,  # Reasoning models need more tokens
        }
    )
    
    agent = Agent(model=reasoning_model)
    
    # Complex math problem that benefits from step-by-step reasoning
    problem = """
    A company has 3 departments: Sales, Marketing, and Engineering.
    - Sales has 25% more employees than Marketing
    - Engineering has 40% fewer employees than Sales
    - The total number of employees across all departments is 180
    
    How many employees are in each department?
    """
    
    response = agent(problem)
    print("Reasoning and Solution:")
    print(response.message["content"][0]["text"])


def code_completion_example():
    """Example using DeepSeek for Fill-in-the-Middle (FIM) code completion."""
    print("\n--- Code Completion (FIM) Example ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 500,
            "temperature": 0.2,  # Lower temperature for more consistent code
        },
        use_beta=True
    )
    
    agent = Agent(model=model)
    
    # FIM-style prompt for code completion
    fim_prompt = """
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
    """
    
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
    print("\n--- Structured Reasoning Example ---")
    
    reasoning_model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-reasoner",
        params={
            "max_tokens": 32000,
        }
    )
    
    agent = Agent(model=reasoning_model)
    
    problem = """
    A water tank can be filled by two pipes. Pipe A can fill the tank in 6 hours,
    and Pipe B can fill it in 4 hours. If both pipes work together, how long will
    it take to fill the tank?
    """
    
    result = agent.structured_output(MathProblem, problem)
    
    print(f"Problem Type: {result.problem_type}")
    print(f"Given Information: {result.given_information}")
    print("\nSolution Steps:")
    for i, step in enumerate(result.solution_steps, 1):
        print(f"  {i}. {step}")
    print(f"\nFinal Answer: {result.final_answer}")
    if result.verification:
        print(f"Verification: {result.verification}")


class CodeAnalysis(BaseModel):
    """Structured analysis of code."""
    language: str = Field(description="Programming language")
    complexity: str = Field(description="Time/space complexity analysis")
    improvements: List[str] = Field(description="Suggested improvements")
    bugs: List[str] = Field(description="Potential bugs or issues")
    explanation: str = Field(description="What the code does")


def code_analysis_example():
    """Example using DeepSeek for structured code analysis."""
    print("\n--- Code Analysis Example ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 2000,
            "temperature": 0.3,
        }
    )
    
    agent = Agent(model=model)
    
    code_to_analyze = '''
    def bubble_sort(arr):
        n = len(arr)
        for i in range(n):
            for j in range(0, n-i-1):
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]
        return arr
    
    numbers = [64, 34, 25, 12, 22, 11, 90]
    sorted_numbers = bubble_sort(numbers)
    print(sorted_numbers)
    '''
    
    prompt = f"Analyze this code:\n\n{code_to_analyze}"
    
    result = agent.structured_output(CodeAnalysis, prompt)
    
    print(f"Language: {result.language}")
    print(f"Explanation: {result.explanation}")
    print(f"Complexity: {result.complexity}")
    print("\nSuggested Improvements:")
    for improvement in result.improvements:
        print(f"  • {improvement}")
    print("\nPotential Issues:")
    for bug in result.bugs:
        print(f"  • {bug}")


async def streaming_example():
    """Example of streaming responses from DeepSeek."""
    print("\n--- Streaming Example ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 1000,
            "temperature": 0.8,
        }
    )
    
    agent = Agent(model=model)
    
    print("Streaming response for creative writing:")
    print("Prompt: Write a short story about a robot learning to paint")
    print("\nResponse:")
    
    async for event in agent.stream_async("Write a short story about a robot learning to paint"):
        if "result" in event:
            # Final result
            break
        # Print streaming content as it arrives
        # Note: Actual streaming implementation may vary


if __name__ == "__main__":
    print("DeepSeek Reasoning Agent Examples\n")
    
    # Check if API key is available
    if not os.getenv("DEEPSEEK_API_KEY"):
        print("Please set DEEPSEEK_API_KEY environment variable to run these examples.")
        exit(1)
    
    try:
        basic_chat_example()
        reasoning_model_example()
        code_completion_example()
        structured_reasoning_example()
        code_analysis_example()
        
        # Note: Async example would need to be run in an async context
        # import asyncio
        # asyncio.run(streaming_example())
        
    except Exception as e:
        print(f"Error running examples: {e}")
        print("Make sure you have a valid DeepSeek API key and sufficient credits.")
    
    print("\nExamples completed.")