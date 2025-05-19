# 🎓 Personalized Tutor Agent - Adaptive AI-Powered Education

This [example](https://github.com/strands-agents/docs/blob/main/docs/examples/python/tutor_agent.py) demonstrates how to create a Strands agent that leverages [mem0.ai](https://mem0.ai) to provide personalized learning experiences. It showcases how to create a Personalized Tutor Agent that adapts to individual learning styles, tracks progress, and provides targeted educational support.

## Overview

| Feature            | Description                                |
| ------------------ | ------------------------------------------ |
| **Tools Used**     | mem0_memory, use_llm                       |
| **Complexity**     | Advanced                                   |
| **Agent Type**     | Single Agent with Learning Memory          |
| **Interaction**    | Command Line Interface                     |
| **Key Focus**      | Adaptive Learning & Progress Tracking      |

## Tool Overview

The Personalized Tutor Agent utilizes two primary tools:

1. **memory**: Enables storing and retrieving learning information with capabilities for:

    - Storing learning progress and preferences
    - Retrieving relevant learning history
    - Tracking concept mastery
    - Maintaining learning context

2. **use_llm**: Provides educational response generation capabilities for:

    - Generating personalized explanations
    - Creating relevant examples
    - Adapting to learning styles
    - Providing constructive feedback

## Learning Response Generation Workflow

This example demonstrates a workflow where learning context is used to generate personalized educational responses:

```
┌─────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│                 │     │                         │     │                         │
│   Student Input │────▶│  Learning Context       │────▶│  Response Generation    │
│                 │     │  Analysis & Retrieval   │     │  with Adaptation        │
│                 │     │                         │     │                         │
└─────────────────┘     └─────────────────────────┘     └───────────┬─────────────┘
                                                                    │
                                                                    │
                                                                    ▼
                           ┌───────────────────────────────────────────────────────┐
                           │                                                       │
                           │  Store Progress    List Topics     Retrieve Context   │
                           │  ┌───────────┐    ┌───────────┐    ┌───────────────┐ │
                           │  │           │    │           │    │               │ │
                           │  │ mem0()    │    │ mem0()    │    │ mem0()        │ │
                           │  │ (store)   │    │ (list)    │    │ (retrieve)    │ │
                           │  │           │    │           │    │               │ │
                           │  └───────────┘    └───────────┘    └───────┬───────┘ │
                           │                                            │         │
                           │                                            ▼         │
                           │                                      ┌───────────┐   │
                           │                                      │           │   │
                           │                                      │ use_llm() │   │
                           │                                      │           │   │
                           │                                      └───────────┘   │
                           │                                                      │
                           └──────────────────────────────────────────────────────┘
```

### Key Workflow Components

1. **Learning Context Management**

   The workflow begins by analyzing the student's input and retrieving relevant learning context:

   ```python
   def process_learning_input(self, user_input: str) -> str:
       # Retrieve relevant learning context
       context = self.retrieve_learning_context(user_input)
       
       # Check for knowledge gaps
       if self.detect_knowledge_gap(user_input, context):
           return self.address_knowledge_gap(user_input, context)
           
       # Generate educational response
       return self.generate_learning_response(user_input, context)
   ```

2. **Learning Response Generation**

   The workflow's core feature is its ability to generate personalized educational responses:

   ```python
   def generate_learning_response(self, query: str, context: List[Dict[str, Any]]) -> str:
       # Format learning context
       context_str = self.format_learning_context(context)
       
       # Create an educational prompt
       prompt = f"""
   Student ID: {self.user_id}
   Current question: "{query}"
   
   Learning context:
   {context_str}
   
   Please provide a response that:
   1. Matches the student's learning level
   2. Uses appropriate examples
   3. Addresses specific learning gaps
   4. Encourages active learning
   """
       
       # Generate response using LLM
       response = self.agent.tool.use_llm(
           prompt=prompt,
           system_prompt=TUTOR_SYSTEM_PROMPT
       )
       
       return str(response['content'][0]['text'])
   ```

## Implementation Benefits

### 1. Adaptive Learning Framework

The Personalized Tutor Agent implements a robust adaptive learning framework:

```python
TUTOR_SYSTEM_PROMPT = """You are an AI tutor that provides personalized learning support while adapting to individual learning styles.

Key Rules:
- Adapt explanations to student's level
- Use clear, step-by-step explanations
- Provide relevant examples
- Identify and address knowledge gaps
- Track learning progress
- Maintain consistent teaching approach
- Encourage active learning
- Provide constructive feedback
"""
```

This framework ensures:
- Personalized learning experiences
- Appropriate difficulty levels
- Clear explanations
- Progress tracking
- Active learning encouragement

### 2. Learning Approaches

The agent implements various educational approaches:

- Concept explanation
- Step-by-step problem solving
- Interactive examples
- Practice problems
- Progress assessment
- Learning style adaptation
- Knowledge gap identification
- Concept reinforcement

### 3. Progress Tracking

The agent maintains learning continuity through progress tracking:

```python
def initialize_demo_learning():
    content = """Student is learning Python programming. They have completed basic syntax and data structures. Currently working on recursion and algorithms. They prefer visual explanations and practical examples. They have shown good understanding of loops and functions but struggle with recursive thinking. They learn best through step-by-step explanations and hands-on practice."""
    tutor_agent.tool.mem0_memory(action="store", content=content, user_id=USER_ID)
```

This provides:
- Learning progress tracking
- Concept mastery monitoring
- Learning style adaptation
- Personalized support

## Important Requirements

The Personalized Tutor Agent requires careful consideration of several factors:

1. **Educational Guidelines**:
   - Clear learning objectives
   - Appropriate difficulty levels
   - Constructive feedback
   - Progress monitoring

2. **Learning Boundaries**:
   - No direct answers to assignments
   - Focus on understanding
   - Encouragement of critical thinking
   - Appropriate challenge levels

3. **Technical Requirements**:
   - Secure progress tracking
   - Learning style adaptation
   - Concept mastery tracking
   - Context maintenance

## Example Interactions

**Interaction 1**: Initial Learning Session

```
> I'm having trouble understanding recursion

I understand that recursion can be challenging. I notice you've been working with loops and functions, which is a great foundation. Let's break down recursion step by step. Would you like to start with a simple example, like calculating factorial, or would you prefer to see how recursion relates to the loops you already understand?
```

**Interaction 2**: Concept Clarification

```
> Can you explain this concept differently?

I'll try a different approach. Think of recursion like a set of Russian dolls - each doll contains a smaller version of itself. In programming, a recursive function calls itself with a smaller problem until it reaches a base case. Would you like to see a visual representation of this concept?
```

**Interaction 3**: Progress Check

```
> I want to practice what we learned

Based on your progress, I suggest we practice with some recursion exercises. I'll start with a simple problem that builds on your understanding of loops. Would you like to try implementing a recursive function to calculate the sum of numbers from 1 to n?
```

## Extending the Example

Here are some ways to extend this Personalized Tutor Agent:

1. **Learning Analytics**: Implement detailed progress tracking and analytics
2. **Multi-Modal Learning**: Add support for different learning materials (videos, diagrams, etc.)
3. **Assessment Tools**: Create automated assessment and feedback systems
4. **Curriculum Integration**: Add support for structured learning paths
5. **Collaborative Learning**: Enable peer learning and discussion features
6. **Resource Library**: Build a library of learning resources and exercises

## Important Note

This Personalized Tutor Agent is designed to supplement traditional education and provide personalized learning support. It should be used as a complementary tool alongside formal education and professional teaching.

For more information about AI in education and detailed documentation, visit [Mem0 documentation](https://docs.mem0.ai). 