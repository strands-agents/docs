# DeepSeek Code Completion Example

This example demonstrates how to use DeepSeek models for Fill-in-the-Middle (FIM) code completion tasks with Strands Agents. DeepSeek models excel at understanding code context and generating high-quality completions for functions, classes, and algorithms.

## What You'll Learn

- How to use DeepSeek for code completion tasks
- Best practices for FIM (Fill-in-the-Middle) prompting
- Configuring DeepSeek models for consistent code generation
- Various code completion scenarios from simple functions to complex algorithms

## Prerequisites

Before running this example, you'll need:

1. A DeepSeek API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Set the environment variable: `export DEEPSEEK_API_KEY="your-api-key"`
3. Install DeepSeek dependencies: `pip install 'strands-agents[deepseek]'`

## Key Features Demonstrated

### 1. Function Completion

Complete missing function implementations with proper logic:

```python
model = DeepSeekModel(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    model_id="deepseek-chat",
    params={
        "max_tokens": 500,
        "temperature": 0.2,  # Lower temperature for consistent code
    }
)

prompt = """
Complete this Python function:

```python
def calculate_compound_interest(principal, rate, time, compound_frequency):
    '''Calculate compound interest.'''
    # TODO: Implement the compound interest formula
    pass
```
"""
```

### 2. Class Method Implementation

Fill in missing methods in object-oriented code:

```python
prompt = """
Complete the missing methods in this Python class:

```python
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self.balance = initial_balance
    
    def deposit(self, amount):
        # TODO: Implement deposit method
        pass
    
    def withdraw(self, amount):
        # TODO: Implement withdraw method with overdraft protection
        pass
```
"""
```

### 3. Algorithm Implementation

Complete complex data structures and algorithms:

```python
prompt = """
Complete this binary search tree implementation:

```python
class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        # TODO: Insert a value into the BST
        pass
    
    def search(self, val):
        # TODO: Search for a value in the BST
        pass
```
"""
```

### 4. Code Refactoring

Improve existing code for better performance and readability:

```python
prompt = """
Refactor this code to make it more efficient and readable:

```python
def process_data(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            # ... inefficient code
```

Improve by making it more Pythonic and performant.
"""
```

### 5. API Integration

Complete REST API client implementations:

```python
prompt = """
Complete this REST API client class:

```python
class WeatherAPIClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def get_current_weather(self, city: str) -> Dict:
        # TODO: Implement method to get current weather
        pass
```
"""
```

## Complete Example Code

```python
#!/usr/bin/env python3
"""
DeepSeek Code Completion Example

This example demonstrates how to use DeepSeek models for Fill-in-the-Middle (FIM)
code completion tasks with Strands Agents.
"""

import os
from strands import Agent
from strands.models.deepseek import DeepSeekModel


def basic_function_completion():
    """Complete a basic function implementation."""
    print("\\n--- Basic Function Completion ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 500,
            "temperature": 0.2,  # Lower temperature for consistent code
        }
    )
    
    agent = Agent(model=model)
    
    prompt = \"\"\"
    Complete this Python function:
    
    ```python
    def calculate_compound_interest(principal, rate, time, compound_frequency):
        '''
        Calculate compound interest.
        
        Args:
            principal: Initial amount
            rate: Annual interest rate (as decimal, e.g., 0.05 for 5%)
            time: Time in years
            compound_frequency: Number of times interest compounds per year
            
        Returns:
            Final amount after compound interest
        '''
        # TODO: Implement the compound interest formula
        pass
    ```
    
    Provide the complete implementation.
    \"\"\"
    
    response = agent(prompt)
    print("Completed function:")
    print(response.message["content"][0]["text"])


def algorithm_completion():
    """Complete a complex algorithm implementation."""
    print("\\n--- Algorithm Completion ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 1000,
            "temperature": 0.15,
        }
    )
    
    agent = Agent(model=model)
    
    prompt = \"\"\"
    Complete this binary search tree implementation:
    
    ```python
    class TreeNode:
        def __init__(self, val=0, left=None, right=None):
            self.val = val
            self.left = left
            self.right = right
    
    class BinarySearchTree:
        def __init__(self):
            self.root = None
        
        def insert(self, val):
            # TODO: Insert a value into the BST
            pass
        
        def search(self, val):
            # TODO: Search for a value in the BST
            pass
        
        def inorder_traversal(self):
            # TODO: Return inorder traversal as a list
            pass
    ```
    
    Implement all methods with proper BST logic.
    \"\"\"
    
    response = agent(prompt)
    print("Completed BST implementation:")
    print(response.message["content"][0]["text"])


if __name__ == "__main__":
    print("DeepSeek Code Completion Examples\\n")
    
    # Check if API key is available
    if not os.getenv("DEEPSEEK_API_KEY"):
        print("Please set DEEPSEEK_API_KEY environment variable to run these examples.")
        exit(1)
    
    try:
        basic_function_completion()
        algorithm_completion()
        
    except Exception as e:
        print(f"Error running examples: {e}")
        print("Make sure you have a valid DeepSeek API key and sufficient credits.")
    
    print("\\nCode completion examples completed.")
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
   python deepseek_code_completion.py
   ```

## Best Practices for Code Completion

### Temperature Settings
- **Low temperature (0.1-0.2)**: For consistent, predictable code completion
- **Medium temperature (0.3-0.5)**: For creative solutions while maintaining correctness
- **Higher temperature (0.6+)**: Generally not recommended for code completion

### Prompt Structure
1. **Clear Context**: Provide sufficient context about what the code should do
2. **Specific TODOs**: Use clear TODO comments to indicate what needs completion
3. **Type Hints**: Include type hints when possible for better completions
4. **Documentation**: Include docstrings to guide the completion

### Token Limits
- **Simple functions**: 300-500 tokens usually sufficient
- **Complex algorithms**: 800-1200 tokens for comprehensive implementations
- **Large classes**: May need 1500+ tokens for complete implementations

## Use Cases

This example demonstrates several practical use cases:

- **Development Assistance**: Complete partially written functions and classes
- **Learning Tool**: Generate implementations to understand algorithms
- **Code Review**: Get alternative implementations for comparison
- **Rapid Prototyping**: Quickly scaffold code structures
- **Legacy Code**: Complete or modernize existing codebases

## Key Takeaways

- DeepSeek models excel at understanding code context and generating syntactically correct completions
- Lower temperature settings produce more consistent and reliable code
- Clear, specific prompts with good context lead to better completions
- The models can handle various programming paradigms from functional to object-oriented code
- Proper error handling and edge cases are often included in generated completions

## Learn More

- [DeepSeek Model Provider Documentation](../../user-guide/concepts/model-providers/deepseek.md)
- [DeepSeek Reasoning Agent Example](deepseek_reasoning_agent.md)
- [DeepSeek Platform](https://platform.deepseek.com/)