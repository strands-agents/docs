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
    print("\n--- Basic Function Completion ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 500,
            "temperature": 0.2,  # Lower temperature for consistent code
        }
    )
    
    agent = Agent(model=model)
    
    prompt = """
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
    """
    
    response = agent(prompt)
    print("Completed function:")
    print(response.message["content"][0]["text"])


def class_method_completion():
    """Complete missing methods in a class."""
    print("\n--- Class Method Completion ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 800,
            "temperature": 0.1,
        }
    )
    
    agent = Agent(model=model)
    
    prompt = """
    Complete the missing methods in this Python class:
    
    ```python
    class BankAccount:
        def __init__(self, account_number, initial_balance=0):
            self.account_number = account_number
            self.balance = initial_balance
            self.transaction_history = []
        
        def deposit(self, amount):
            # TODO: Implement deposit method
            pass
        
        def withdraw(self, amount):
            # TODO: Implement withdraw method with overdraft protection
            pass
        
        def get_balance(self):
            # TODO: Return current balance
            pass
        
        def get_transaction_history(self):
            # TODO: Return transaction history
            pass
    ```
    
    Implement all the missing methods with proper error handling.
    """
    
    response = agent(prompt)
    print("Completed class:")
    print(response.message["content"][0]["text"])


def algorithm_completion():
    """Complete a complex algorithm implementation."""
    print("\n--- Algorithm Completion ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 1000,
            "temperature": 0.15,
        }
    )
    
    agent = Agent(model=model)
    
    prompt = """
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
        
        def _insert_recursive(self, node, val):
            # TODO: Helper method for recursive insertion
            pass
        
        def _search_recursive(self, node, val):
            # TODO: Helper method for recursive search
            pass
        
        def _inorder_recursive(self, node, result):
            # TODO: Helper method for recursive inorder traversal
            pass
    ```
    
    Implement all methods with proper BST logic.
    """
    
    response = agent(prompt)
    print("Completed BST implementation:")
    print(response.message["content"][0]["text"])


def code_refactoring_example():
    """Use DeepSeek to refactor and improve existing code."""
    print("\n--- Code Refactoring Example ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 1200,
            "temperature": 0.3,
        }
    )
    
    agent = Agent(model=model)
    
    prompt = """
    Refactor this code to make it more efficient and readable:
    
    ```python
    def process_data(data):
        result = []
        for i in range(len(data)):
            if data[i] > 0:
                temp = data[i] * 2
                if temp < 100:
                    result.append(temp)
                else:
                    result.append(100)
            else:
                result.append(0)
        
        final_result = []
        for item in result:
            if item not in final_result:
                final_result.append(item)
        
        return final_result
    ```
    
    Improve this code by:
    1. Making it more Pythonic
    2. Improving performance
    3. Adding proper documentation
    4. Using appropriate data structures
    """
    
    response = agent(prompt)
    print("Refactored code:")
    print(response.message["content"][0]["text"])


def api_integration_completion():
    """Complete an API integration example."""
    print("\n--- API Integration Completion ---")
    
    model = DeepSeekModel(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        model_id="deepseek-chat",
        params={
            "max_tokens": 800,
            "temperature": 0.2,
        }
    )
    
    agent = Agent(model=model)
    
    prompt = """
    Complete this REST API client class:
    
    ```python
    import requests
    import json
    from typing import Dict, List, Optional
    
    class WeatherAPIClient:
        def __init__(self, api_key: str, base_url: str = "https://api.weather.com"):
            self.api_key = api_key
            self.base_url = base_url
            self.session = requests.Session()
        
        def get_current_weather(self, city: str) -> Dict:
            # TODO: Implement method to get current weather for a city
            pass
        
        def get_forecast(self, city: str, days: int = 5) -> List[Dict]:
            # TODO: Implement method to get weather forecast
            pass
        
        def _make_request(self, endpoint: str, params: Dict) -> Dict:
            # TODO: Helper method to make API requests with error handling
            pass
        
        def _handle_api_error(self, response: requests.Response):
            # TODO: Handle different types of API errors
            pass
    ```
    
    Implement all methods with proper error handling and documentation.
    """
    
    response = agent(prompt)
    print("Completed API client:")
    print(response.message["content"][0]["text"])


if __name__ == "__main__":
    print("DeepSeek Code Completion Examples\n")
    
    # Check if API key is available
    if not os.getenv("DEEPSEEK_API_KEY"):
        print("Please set DEEPSEEK_API_KEY environment variable to run these examples.")
        exit(1)
    
    try:
        basic_function_completion()
        class_method_completion()
        algorithm_completion()
        code_refactoring_example()
        api_integration_completion()
        
    except Exception as e:
        print(f"Error running examples: {e}")
        print("Make sure you have a valid DeepSeek API key and sufficient credits.")
    
    print("\nCode completion examples completed.")