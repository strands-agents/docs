#!/usr/bin/env python3
"""
Structured Output Example

This example demonstrates how to use structured output with Strands Agents to
get type-safe, validated responses using Pydantic models.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from strands import Agent

def basic_example():
    """Basic example extracting structured information from text."""
    print("\n--- Basic Example ---")
    
    class PersonInfo(BaseModel):
        name: str
        age: int
        occupation: str

    agent = Agent()
    result = agent.structured_output(
        PersonInfo, 
        "John Smith is a 30-year-old software engineer"
    )

    print(f"Name: {result.name}")      # "John Smith"
    print(f"Age: {result.age}")        # 30 
    print(f"Job: {result.occupation}") # "software engineer"


def conversation_history_example():
    """Example using conversation history with structured output."""
    print("\n--- Conversation History Example ---")
    
    agent = Agent()

    # Build up conversation context
    print("Building conversation context...")
    agent("What do you know about Paris, France?")
    agent("Tell me about the weather there in spring.")

    # Extract structured information without additional prompt
    class CityInfo(BaseModel):
        city: str
        country: str
        population: Optional[int] = None
        climate: str

    # Uses existing conversation context with a prompt
    print("Extracting structured information from conversation context...")
    result = agent.structured_output(CityInfo, "Extract structured information about Paris")
    
    print(f"City: {result.city}")
    print(f"Country: {result.country}")
    print(f"Population: {result.population}")
    print(f"Climate: {result.climate}")


def complex_nested_model_example():
    """Example handling complex nested data structures."""
    print("\n--- Complex Nested Model Example ---")
    
    class Address(BaseModel):
        street: str
        city: str
        country: str
        postal_code: Optional[str] = None

    class Contact(BaseModel):
        email: Optional[str] = None
        phone: Optional[str] = None

    class Person(BaseModel):
        """Complete person information."""
        name: str = Field(description="Full name of the person")
        age: int = Field(description="Age in years")
        address: Address = Field(description="Home address")
        contacts: List[Contact] = Field(default_factory=list, description="Contact methods")
        skills: List[str] = Field(default_factory=list, description="Professional skills")

    agent = Agent()
    result = agent.structured_output(
        Person,
        "Extract info: Jane Doe, a systems admin, 28, lives at 123 Main St, New York, USA. Email: jane@example.com"
    )

    print(f"Name: {result.name}")                    # "Jane Doe"
    print(f"Age: {result.age}")                      # 28
    print(f"Street: {result.address.street}")        # "123 Main St" 
    print(f"City: {result.address.city}")            # "New York"
    print(f"Country: {result.address.country}")      # "USA"
    print(f"Email: {result.contacts[0].email}")      # "jane@example.com"
    print(f"Skills: {result.skills}")                # ["systems admin"]


if __name__ == "__main__":
    print("Structured Output Examples\n")
    
    basic_example()
    conversation_history_example()
    complex_nested_model_example()
    
    print("\nExamples completed.")