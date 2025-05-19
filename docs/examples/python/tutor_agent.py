#!/usr/bin/env python3
"""
# 🎓 Personalized Learning Tutor

A demonstration of using Strands Agents' memory capabilities to create an AI tutor
that adapts to individual learning styles and tracks educational progress.

## What This Example Shows

This example demonstrates:
- Creating an AI tutor with adaptive learning capabilities
- Tracking student progress and learning patterns
- Providing personalized explanations and examples
- Identifying knowledge gaps and learning preferences
- Maintaining learning context across sessions

## Usage Examples

Basic usage:
```
python tutor_agent.py
```

Import in your code:
```python
from examples.tutor_agent import tutor_agent

# Start a learning session
response = tutor_agent("I'm having trouble understanding recursion in Python")
print(response["message"]["content"][0]["text"])

# Continue learning
response = tutor_agent("Can you give me a simpler example?")
print(response["message"]["content"][0]["text"])
```

## Learning Features

1. **Adaptive Learning**:
   - Adjusts explanations based on student's level
   - Provides relevant examples
   - Identifies learning gaps

2. **Progress Tracking**:
   - Monitors understanding of concepts
   - Tracks completed exercises
   - Records learning preferences

3. **Personalized Support**:
   - Customized explanations
   - Targeted practice problems
   - Learning style adaptation
"""

import os
import logging
from dotenv import load_dotenv

from strands import Agent
from strands_tools import mem0_memory, use_llm

logger = logging.getLogger(__name__)

# Load environment variables from .env file if it exists
load_dotenv()

USER_ID = "student_user"

# System prompt for the tutor agent
TUTOR_SYSTEM_PROMPT = f"""You are an AI tutor that provides personalized learning support while adapting to individual learning styles.

Capabilities:
- Store learning progress using mem0_memory tool (action="store")
- Retrieve learning history and preferences (action="retrieve")
- Track concept mastery and gaps (action="list")
- Provide personalized explanations and examples

Key Rules:
- Always include user_id={USER_ID} in tool calls
- Adapt explanations to student's level
- Use clear, step-by-step explanations
- Provide relevant examples
- Identify and address knowledge gaps
- Track learning progress
- Maintain consistent teaching approach
- Encourage active learning
- Provide constructive feedback
- Use appropriate technical terminology
- Break down complex concepts
- Validate understanding
- Suggest practice exercises

Teaching Approaches:
- Concept explanation
- Step-by-step problem solving
- Interactive examples
- Practice problems
- Progress assessment
- Learning style adaptation
- Knowledge gap identification
- Concept reinforcement
"""

# Create an agent with memory capabilities
tutor_agent = Agent(
    system_prompt=TUTOR_SYSTEM_PROMPT,
    tools=[mem0_memory, use_llm],
)

# Initialize some demo learning data
def initialize_demo_learning():
    """Initialize some demo learning data to showcase functionality."""
    content = """Student is learning Python programming. They have completed basic syntax and data structures. Currently working on recursion and algorithms. They prefer visual explanations and practical examples. They have shown good understanding of loops and functions but struggle with recursive thinking. They learn best through step-by-step explanations and hands-on practice."""  # noqa
    tutor_agent.tool.mem0_memory(action="store", content=content, user_id=USER_ID)

# Example usage
if __name__ == "__main__":
    print("\n🎓 Personalized Learning Tutor 🎓\n")
    print("This is a demonstration of an AI tutor with adaptive learning capabilities.")
    print("The tutor will adapt to your learning style and track your progress.")
    print("\nOptions:")
    print("  'demo' - Initialize demo learning data")
    print("  'exit' - Exit the program")
    print("\nOr try these examples:")
    print("  - I'm having trouble understanding recursion")
    print("  - Can you explain this concept differently?")
    print("  - I want to practice what we learned")
    print("  - What topics should I focus on?")

    # Interactive loop
    while True:
        try:
            user_input = input("\n> ")

            if user_input.lower() == "exit":
                print("\nKeep learning! Remember, practice makes perfect. 👋")
                break
            elif user_input.lower() == "demo":
                initialize_demo_learning()
                print("\nDemo learning data initialized!")
                continue

            # Call the tutor agent
            tutor_agent(user_input)

        except KeyboardInterrupt:
            print("\n\nSession ended. Keep up the good work!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {str(e)}")
            print("Please try a different request.")
