#!/usr/bin/env python3
"""
# 🧠 AI Therapist Assistant

A demonstration of using Strands Agents' memory capabilities to create an AI therapy assistant
that maintains context and provides supportive responses while following ethical guidelines.

## What This Example Shows

This example demonstrates:
- Creating an AI therapy assistant with memory capabilities
- Maintaining therapeutic context across sessions
- Following ethical guidelines for AI therapy
- Providing supportive responses while respecting boundaries
- Tracking progress and patterns over time

## Usage Examples

Basic usage:
```
python therapist_agent.py
```

Import in your code:
```python
from examples.therapist_agent import therapist_agent

# Start a therapy session
response = therapist_agent("I've been feeling anxious about my upcoming presentation")
print(response["message"]["content"][0]["text"])

# Continue a previous conversation
response = therapist_agent("I tried the breathing exercise you suggested")
print(response["message"]["content"][0]["text"])
```

## Important Notes

This is a demonstration of AI capabilities and should not be used as a replacement for professional therapy.
Always seek professional help for serious mental health concerns.
"""

import os
import logging
from dotenv import load_dotenv

from strands import Agent
from strands_tools import mem0_memory, use_llm

logger = logging.getLogger(__name__)

# Load environment variables from .env file if it exists
load_dotenv()

if os.getenv("MEM0_API_KEY") is None:
    raise ValueError("Set MEM0_API_KEY in your environment variables. You can get one at https://app.mem0.ai/")

USER_ID = "therapy_user"

# System prompt for the therapy agent
THERAPY_SYSTEM_PROMPT = f"""You are an AI therapy assistant that provides supportive responses while maintaining appropriate boundaries.

Capabilities:
- Store session information using mem0_memory tool (action="store")
- Retrieve relevant context from previous sessions (action="retrieve")
- Track progress and patterns over time (action="list")
- Provide supportive responses using therapeutic techniques

Key Rules:
- Always include user_id={USER_ID} in tool calls
- Maintain professional boundaries
- Never claim to be a replacement for professional therapy
- Focus on supportive listening and basic therapeutic techniques
- Respect privacy and confidentiality
- Provide appropriate disclaimers when necessary
- Use evidence-based therapeutic approaches
- Never provide medical advice or diagnosis
- Encourage seeking professional help when appropriate
- Use empathetic and validating language
- Track progress and patterns over time
- Remember previous coping strategies discussed
- Maintain consistent therapeutic approach

Therapeutic Approaches:
- Active listening
- Cognitive behavioral techniques
- Mindfulness exercises
- Stress management strategies
- Progress tracking
- Goal setting
- Emotional validation
"""

# Create an agent with memory capabilities
therapist_agent = Agent(
    system_prompt=THERAPY_SYSTEM_PROMPT,
    tools=[mem0_memory, use_llm],
)

# Initialize some demo session data
def initialize_demo_session():
    """Initialize some demo session data to showcase functionality."""
    content = """Client has been experiencing work-related stress. They mentioned difficulty sleeping and increased anxiety before presentations. We discussed deep breathing exercises and progressive muscle relaxation as coping strategies. Client expressed interest in mindfulness meditation. They have a supportive family and enjoy outdoor activities for stress relief."""  # noqa
    therapist_agent.tool.mem0_memory(action="store", content=content, user_id=USER_ID)

# Example usage
if __name__ == "__main__":
    print("\n🧠 AI Therapist Assistant 🧠\n")
    print("This is a demonstration of an AI therapy assistant.")
    print("IMPORTANT: This is not a replacement for professional therapy.")
    print("Please seek professional help for serious mental health concerns.")
    print("\nOptions:")
    print("  'demo' - Initialize demo session data")
    print("  'exit' - Exit the program")
    print("\nOr try these examples:")
    print("  - I've been feeling overwhelmed at work lately")
    print("  - I tried the breathing exercise you suggested")
    print("  - Can you help me with my anxiety?")
    print("  - What coping strategies have we discussed?")

    # Interactive loop
    while True:
        try:
            user_input = input("\n> ")

            if user_input.lower() == "exit":
                print("\nTake care! Remember to prioritize your mental health. 👋")
                break
            elif user_input.lower() == "demo":
                initialize_demo_session()
                print("\nDemo session data initialized!")
                continue

            # Call the therapist agent
            therapist_agent(user_input)

        except KeyboardInterrupt:
            print("\n\nSession ended. Please take care of yourself.")
            break
        except Exception as e:
            print(f"\nAn error occurred: {str(e)}")
            print("Please try a different request.")
