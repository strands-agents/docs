# Structured Output Configuration

This document provides comprehensive guidance on configuring structured output for agents using dictionary configurations. The structured output feature allows you to define Pydantic models declaratively and have agents automatically return structured data instead of plain text.

**Note**: This is an experimental feature that provides programmatic structured output configuration through dictionaries. For file-based configuration, use the main Agent constructor's `config` parameter.

## Overview

Structured output configuration enables you to:

- Define output schemas using JSON Schema syntax in dictionary configurations
- Reference existing Pydantic models from your codebase
- Load schemas from external JSON/YAML files
- Configure validation and error handling behavior
- Create reusable schema libraries across multiple agents

## Schema Validation

The ConfigLoader includes comprehensive schema validation for structured output:

- **IDE Integration**: VSCode, IntelliJ, Vim support with autocompletion
- **Error Prevention**: Catch configuration errors before runtime  
- **Type Safety**: Enforced structure and types
- **Documentation**: Schema serves as living documentation

### Global VSCode Settings
Add to your `settings.json`:
```json
{
  "yaml.schemas": {
    "https://strandsagents.com/schemas/config/v1": "*.strands.yml"
  }
}
```

## Quick Start

### Basic Configuration

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Define configuration with schema
config = {
    "schemas": [
        {
            "name": "UserProfile",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "User's full name"
                    },
                    "email": {
                        "type": "string",
                        "format": "email",
                        "description": "User's email address"
                    },
                    "age": {
                        "type": "integer",
                        "minimum": 0,
                        "description": "User's age"
                    }
                },
                "required": ["name", "email"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract user information from text.",
        "structured_output": "UserProfile"
    }
}

# Load agent with structured output
loader = AgentConfigLoader()
agent = loader.load_agent(config)

# Use structured output
result = agent.structured_output("Extract info: John Doe, 30 years old, john@example.com")
print(f"Name: {result.name}")
print(f"Email: {result.email}")
print(f"Age: {result.age}")

# Or use the convenience method
result = agent.extract_userprofile("Extract info: Jane Smith, jane@example.com")
```

## Schema Definition Methods

### 1. Inline Schema Definition

Define schemas directly in your configuration using JSON Schema syntax:

```python
config = {
    "schemas": [
        {
            "name": "ProductInfo",
            "description": "Product information schema",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Product name"
                    },
                    "price": {
                        "type": "number",
                        "minimum": 0,
                        "description": "Product price in USD"
                    },
                    "category": {
                        "type": "string",
                        "enum": ["electronics", "clothing", "books", "home"],
                        "description": "Product category"
                    },
                    "in_stock": {
                        "type": "boolean",
                        "description": "Whether product is in stock"
                    },
                    "tags": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Product tags"
                    }
                },
                "required": ["name", "price", "category"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract product information from descriptions.",
        "structured_output": "ProductInfo"
    }
}
```

### 2. External Schema Files

Load schemas from external JSON or YAML files:

```python
import tempfile
import yaml

# Create external schema file
schema_dict = {
    "type": "object",
    "properties": {
        "company": {"type": "string"},
        "revenue": {"type": "number", "minimum": 0},
        "employees": {"type": "integer", "minimum": 1}
    },
    "required": ["company", "revenue"]
}

with tempfile.NamedTemporaryFile(mode="w", suffix=".yaml", delete=False) as f:
    yaml.dump(schema_dict, f)
    schema_file_path = f.name

# Reference external schema file
config = {
    "schemas": [
        {
            "name": "CompanyInfo",
            "schema_file": schema_file_path
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract company information from text.",
        "structured_output": "CompanyInfo"
    }
}
```

### 3. Python Class References

Reference existing Pydantic models from your codebase:

```python
# Define a Pydantic model in your code
from pydantic import BaseModel
from typing import Optional

class BusinessModel(BaseModel):
    company_name: str
    revenue: Optional[float] = None
    industry: Optional[str] = None

# Reference the Python class
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract business information from text.",
        "structured_output": "tests.strands.experimental.config_loader.agent.test_agent_config_loader_structured_output.BusinessModel"
    }
}
```

## Detailed Structured Output Configuration

### Simple Schema Reference

```python
config = {
    "schemas": [
        {
            "name": "ContactInfo",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "phone": {"type": "string"},
                    "email": {"type": "string", "format": "email"}
                },
                "required": ["name"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract contact information.",
        "structured_output": "ContactInfo"  # Simple reference
    }
}
```

### Detailed Configuration with Validation Settings

```python
config = {
    "schemas": [
        {
            "name": "CustomerData",
            "schema": {
                "type": "object",
                "properties": {
                    "customer_id": {"type": "string"},
                    "name": {"type": "string"},
                    "email": {"type": "string", "format": "email"},
                    "purchase_history": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "product": {"type": "string"},
                                "amount": {"type": "number"},
                                "date": {"type": "string", "format": "date"}
                            }
                        }
                    }
                },
                "required": ["customer_id", "name", "email"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract comprehensive customer data.",
        "structured_output": {
            "schema": "CustomerData",
            "validation": {
                "strict": True,
                "allow_extra_fields": False
            },
            "error_handling": {
                "retry_on_validation_error": True,
                "max_retries": 3
            }
        }
    }
}
```

## Global Schema Defaults

Configure default settings for all structured output operations:

```python
config = {
    "schemas": [
        {
            "name": "TaskResult",
            "schema": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["success", "failure", "pending"]},
                    "result": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1}
                },
                "required": ["status", "result"]
            }
        }
    ],
    "structured_output_defaults": {
        "validation": {
            "strict": False,
            "allow_extra_fields": True
        },
        "error_handling": {
            "retry_on_validation_error": False,
            "max_retries": 1
        }
    },
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Process tasks and return structured results.",
        "structured_output": {
            "schema": "TaskResult",
            "validation": {
                "strict": True  # Override default
            }
            # error_handling will use defaults
        }
    }
}
```

## Complex Schema Examples

### Nested Object Schema

```python
config = {
    "schemas": [
        {
            "name": "OrderDetails",
            "schema": {
                "type": "object",
                "properties": {
                    "order_id": {"type": "string"},
                    "customer": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "email": {"type": "string", "format": "email"},
                            "address": {
                                "type": "object",
                                "properties": {
                                    "street": {"type": "string"},
                                    "city": {"type": "string"},
                                    "zip_code": {"type": "string"},
                                    "country": {"type": "string"}
                                },
                                "required": ["street", "city", "country"]
                            }
                        },
                        "required": ["name", "email"]
                    },
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "product_id": {"type": "string"},
                                "name": {"type": "string"},
                                "quantity": {"type": "integer", "minimum": 1},
                                "price": {"type": "number", "minimum": 0}
                            },
                            "required": ["product_id", "name", "quantity", "price"]
                        }
                    },
                    "total_amount": {"type": "number", "minimum": 0},
                    "order_date": {"type": "string", "format": "date-time"}
                },
                "required": ["order_id", "customer", "items", "total_amount"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract complete order information from order confirmations.",
        "structured_output": "OrderDetails"
    }
}
```

### Multiple Schema Configuration

```python
config = {
    "schemas": [
        {
            "name": "PersonInfo",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer", "minimum": 0},
                    "occupation": {"type": "string"}
                },
                "required": ["name"]
            }
        },
        {
            "name": "CompanyInfo",
            "schema": {
                "type": "object",
                "properties": {
                    "company_name": {"type": "string"},
                    "industry": {"type": "string"},
                    "employee_count": {"type": "integer", "minimum": 1}
                },
                "required": ["company_name"]
            }
        },
        {
            "name": "ContactEvent",
            "schema": {
                "type": "object",
                "properties": {
                    "event_type": {"type": "string", "enum": ["meeting", "call", "email"]},
                    "participants": {
                        "type": "array",
                        "items": {"$ref": "#/schemas/PersonInfo"}
                    },
                    "companies": {
                        "type": "array",
                        "items": {"$ref": "#/schemas/CompanyInfo"}
                    },
                    "date": {"type": "string", "format": "date"},
                    "notes": {"type": "string"}
                },
                "required": ["event_type", "date"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract information about business contacts and events.",
        "structured_output": "ContactEvent"
    }
}
```

## Usage Patterns

### Method-based Access

```python
# Load agent with structured output
agent = loader.load_agent(config)

# Use the structured_output method
result = agent.structured_output("Extract user data: Alice Johnson, alice@example.com, 28 years old")

# Use auto-generated convenience methods
result = agent.extract_userprofile("Extract user data: Bob Smith, bob@example.com")
result = agent.extract_contactinfo("Contact: Carol Davis, carol@company.com, (555) 123-4567")
```

### Validation and Error Handling

```python
config = {
    "schemas": [
        {
            "name": "StrictSchema",
            "schema": {
                "type": "object",
                "properties": {
                    "required_field": {"type": "string"},
                    "optional_field": {"type": "integer"}
                },
                "required": ["required_field"],
                "additionalProperties": False
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract data with strict validation.",
        "structured_output": {
            "schema": "StrictSchema",
            "validation": {
                "strict": True,
                "allow_extra_fields": False
            },
            "error_handling": {
                "retry_on_validation_error": True,
                "max_retries": 2
            }
        }
    }
}

# The agent will retry up to 2 times if validation fails
try:
    result = agent.structured_output("Extract: some incomplete data")
except ValidationError as e:
    print(f"Validation failed after retries: {e}")
```

## Advanced Examples

### Multi-Agent Structured Output Pipeline

```python
# Schema shared across multiple agents
shared_schemas = [
    {
        "name": "DocumentMetadata",
        "schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "author": {"type": "string"},
                "date": {"type": "string", "format": "date"},
                "category": {"type": "string"},
                "keywords": {"type": "array", "items": {"type": "string"}},
                "summary": {"type": "string"}
            },
            "required": ["title", "category"]
        }
    },
    {
        "name": "ContentAnalysis",
        "schema": {
            "type": "object",
            "properties": {
                "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
                "topics": {"type": "array", "items": {"type": "string"}},
                "complexity_score": {"type": "number", "minimum": 0, "maximum": 10},
                "readability_grade": {"type": "integer", "minimum": 1, "maximum": 20}
            },
            "required": ["sentiment", "topics"]
        }
    }
]

# Document metadata extractor
metadata_extractor_config = {
    "schemas": shared_schemas,
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "Extract metadata from documents.",
        "structured_output": "DocumentMetadata"
    }
}

# Content analyzer
content_analyzer_config = {
    "schemas": shared_schemas,
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Analyze document content for sentiment and topics.",
        "structured_output": "ContentAnalysis"
    }
}

# Load both agents
metadata_agent = loader.load_agent(metadata_extractor_config)
analysis_agent = loader.load_agent(content_analyzer_config)

# Use in pipeline
document_text = "Sample document content..."
metadata = metadata_agent.structured_output(document_text)
analysis = analysis_agent.structured_output(document_text)

print(f"Document: {metadata.title}")
print(f"Sentiment: {analysis.sentiment}")
print(f"Topics: {', '.join(analysis.topics)}")
```

### Dynamic Schema Generation

```python
def create_extraction_config(fields):
    """Create a structured output config for dynamic field extraction"""
    properties = {}
    required = []
    
    for field_name, field_config in fields.items():
        properties[field_name] = {
            "type": field_config.get("type", "string"),
            "description": field_config.get("description", f"The {field_name} field")
        }
        
        if field_config.get("required", False):
            required.append(field_name)
        
        # Add additional constraints
        if "enum" in field_config:
            properties[field_name]["enum"] = field_config["enum"]
        if "minimum" in field_config:
            properties[field_name]["minimum"] = field_config["minimum"]
        if "maximum" in field_config:
            properties[field_name]["maximum"] = field_config["maximum"]
    
    schema_name = "DynamicExtraction"
    
    return {
        "schemas": [
            {
                "name": schema_name,
                "schema": {
                    "type": "object",
                    "properties": properties,
                    "required": required
                }
            }
        ],
        "agent": {
            "model": "us.amazon.nova-pro-v1:0",
            "system_prompt": f"Extract the following fields: {', '.join(fields.keys())}",
            "structured_output": schema_name
        }
    }

# Define fields dynamically
product_fields = {
    "name": {"type": "string", "required": True},
    "price": {"type": "number", "minimum": 0, "required": True},
    "rating": {"type": "number", "minimum": 1, "maximum": 5},
    "category": {"type": "string", "enum": ["electronics", "books", "clothing"], "required": True}
}

# Create and use dynamic config
product_config = create_extraction_config(product_fields)
product_agent = loader.load_agent(product_config)

result = product_agent.structured_output("iPhone 15 Pro - $999, rated 4.5 stars, electronics category")
print(f"Product: {result.name}, Price: ${result.price}, Rating: {result.rating}")
```

### Conditional Structured Output

```python
def create_adaptive_agent(output_format="simple"):
    """Create agent with different structured output based on format"""
    
    if output_format == "simple":
        schema = {
            "name": "SimpleResult",
            "schema": {
                "type": "object",
                "properties": {
                    "answer": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1}
                },
                "required": ["answer"]
            }
        }
    elif output_format == "detailed":
        schema = {
            "name": "DetailedResult",
            "schema": {
                "type": "object",
                "properties": {
                    "answer": {"type": "string"},
                    "reasoning": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "sources": {"type": "array", "items": {"type": "string"}},
                    "alternatives": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["answer", "reasoning", "confidence"]
            }
        }
    else:  # comprehensive
        schema = {
            "name": "ComprehensiveResult",
            "schema": {
                "type": "object",
                "properties": {
                    "answer": {"type": "string"},
                    "reasoning": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "sources": {"type": "array", "items": {"type": "string"}},
                    "alternatives": {"type": "array", "items": {"type": "string"}},
                    "methodology": {"type": "string"},
                    "limitations": {"type": "array", "items": {"type": "string"}},
                    "follow_up_questions": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["answer", "reasoning", "confidence", "methodology"]
            }
        }
    
    return {
        "schemas": [schema],
        "agent": {
            "model": "us.amazon.nova-pro-v1:0",
            "system_prompt": f"Provide {output_format} analysis with structured output.",
            "structured_output": schema["name"]
        }
    }

# Create different agents based on output needs
simple_agent = loader.load_agent(create_adaptive_agent("simple"))
detailed_agent = loader.load_agent(create_adaptive_agent("detailed"))
comprehensive_agent = loader.load_agent(create_adaptive_agent("comprehensive"))
```

## Best Practices

1. **Use Schema Validation**: Enable IDE integration for better development experience
2. **Design Clear Schemas**: Define specific, well-documented properties with appropriate types
3. **Leverage Schema Reuse**: Create shared schema libraries for consistent data structures
4. **Test Schema Validation**: Validate that schemas work correctly with expected data
5. **Handle Validation Errors**: Configure appropriate retry and error handling strategies
6. **Document Schema Purpose**: Provide clear descriptions for schemas and their use cases

## Error Handling and Troubleshooting

### Common Issues

1. **Schema Not Found**: Ensure schema names match exactly between definition and reference
2. **Validation Failures**: Check that the model output matches the schema requirements
3. **Import Errors**: Verify Python class paths are correct and modules are importable
4. **Schema File Issues**: Ensure external schema files exist and are properly formatted

### Debugging Tips

```python
# Enable detailed logging for structured output
import logging
logging.getLogger("strands.experimental.config_loader.agent").setLevel(logging.DEBUG)

# Test schema validation separately
from jsonschema import validate
import json

schema_def = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"}
    },
    "required": ["name"]
}

test_data = {"name": "John", "age": 30}
validate(test_data, schema_def)  # Should pass without error
```

## Next Steps

- [Agent Configuration](agent-config.md) - Using structured output in agent configurations
- [Tool Configuration](tool-config.md) - Structured output for agent-as-tool configurations
- [Swarm Configuration](swarm-config.md) - Structured output for swarm agents
- [Graph Configuration](graph-config.md) - Structured output for graph node agents
      required: ["name", "price", "category"]
```

### 2. External Schema Files

Reference schemas stored in separate JSON or YAML files:

```yaml
schemas:
  - name: "CustomerData"
    description: "Customer data from external file"
    schema_file: "./schemas/customer.json"
  
  - name: "OrderInfo"
    description: "Order information from YAML file"
    schema_file: "./schemas/order.yaml"
```

**Example external schema file (`schemas/customer.json`):**

```json
{
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string",
      "description": "Unique customer identifier"
    },
    "name": {
      "type": "string",
      "description": "Customer full name"
    },
    "contact_info": {
      "type": "object",
      "properties": {
        "email": {"type": "string", "format": "email"},
        "phone": {"type": "string"}
      },
      "required": ["email"]
    }
  },
  "required": ["customer_id", "name", "contact_info"]
}
```

### 3. Python Class References

Reference existing Pydantic models from your codebase:

```yaml
schemas:
  - name: "BusinessMetrics"
    description: "Business metrics from existing model"
    python_class: "myapp.models.BusinessMetrics"
```

**Corresponding Python model:**

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BusinessMetrics(BaseModel):
    revenue: float = Field(ge=0, description="Revenue in USD")
    growth_rate: float = Field(description="Growth rate percentage")
    customer_count: int = Field(ge=0, description="Number of customers")
    key_metrics: List[dict] = Field(description="Additional key metrics")
    report_date: datetime = Field(description="Report generation date")
```

## Agent Configuration Options

### Simple Reference

Use a simple string to reference a schema:

```yaml
agent:
  name: "data_extractor"
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  system_prompt: "Extract structured data from text."
  structured_output: "ProductInfo"  # Simple schema reference
```

### Direct Python Class Reference

Reference a Python class directly without registering it in the schema registry:

```yaml
agent:
  name: "metrics_analyzer"
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  system_prompt: "Analyze business metrics."
  structured_output: "myapp.models.BusinessMetrics"  # Direct class reference
```

### Advanced Configuration

Configure validation and error handling options:

```yaml
agent:
  name: "advanced_extractor"
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  system_prompt: "Extract data with advanced validation."
  structured_output:
    schema: "ProductInfo"
    validation:
      strict: true                    # Strict validation of output
      allow_extra_fields: false       # Reject extra fields not in schema
      coerce_types: true              # Attempt type coercion
    error_handling:
      retry_on_validation_error: true # Retry if validation fails
      max_retries: 3                  # Maximum retry attempts
      fallback_to_text: false         # Don't fall back to text output
      timeout_seconds: 30             # Timeout for generation
```

## Global Configuration

### Schema Registry

Define schemas globally to be shared across multiple agents:

```yaml
# Global schema registry
schemas:
  - name: "ContactInfo"
    schema:
      type: "object"
      properties:
        name: {"type": "string"}
        email: {"type": "string", "format": "email"}
        phone: {"type": "string"}
      required: ["name", "email"]

  - name: "CompanyInfo"
    schema:
      type: "object"
      properties:
        name: {"type": "string"}
        industry: {"type": "string"}
        size: {"type": "string", "enum": ["startup", "small", "medium", "large"]}
      required: ["name"]

# Multiple agents using shared schemas
agents:
  - name: "contact_extractor"
    model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    system_prompt: "Extract contact information."
    structured_output: "ContactInfo"
    
  - name: "company_analyzer"
    model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    system_prompt: "Analyze company information."
    structured_output: "CompanyInfo"
```

### Default Configuration

Set default validation and error handling options:

```yaml
# Global defaults for all structured output
structured_output_defaults:
  validation:
    strict: false
    allow_extra_fields: true
    coerce_types: true
  error_handling:
    retry_on_validation_error: false
    max_retries: 1
    fallback_to_text: true
    timeout_seconds: 60

# Agents inherit defaults but can override
agents:
  - name: "lenient_extractor"
    model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    structured_output: "ContactInfo"
    # Uses all defaults
    
  - name: "strict_extractor"
    model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    structured_output:
      schema: "ContactInfo"
      validation:
        strict: true  # Overrides default
      # Other settings inherited from defaults
```

## Complex Schema Examples

### Nested Objects

```yaml
schemas:
  - name: "CustomerOrder"
    schema:
      type: "object"
      properties:
        order_id:
          type: "string"
          description: "Unique order identifier"
        customer:
          type: "object"
          properties:
            name: {"type": "string"}
            email: {"type": "string", "format": "email"}
            address:
              type: "object"
              properties:
                street: {"type": "string"}
                city: {"type": "string"}
                zipcode: {"type": "string", "pattern": "^\\d{5}(-\\d{4})?$"}
              required: ["street", "city", "zipcode"]
          required: ["name", "email", "address"]
        items:
          type: "array"
          items:
            type: "object"
            properties:
              product_name: {"type": "string"}
              quantity: {"type": "integer", "minimum": 1}
              unit_price: {"type": "number", "minimum": 0}
            required: ["product_name", "quantity", "unit_price"]
          minItems: 1
        total_amount:
          type: "number"
          minimum: 0
          description: "Total order amount"
      required: ["order_id", "customer", "items", "total_amount"]
```

### Enums and Constraints

```yaml
schemas:
  - name: "TaskManagement"
    schema:
      type: "object"
      properties:
        task_id:
          type: "string"
          pattern: "^TASK-\\d{4}$"
          description: "Task ID in format TASK-XXXX"
        title:
          type: "string"
          minLength: 5
          maxLength: 100
          description: "Task title"
        priority:
          type: "string"
          enum: ["low", "medium", "high", "critical"]
          description: "Task priority level"
        status:
          type: "string"
          enum: ["todo", "in_progress", "review", "done"]
          description: "Current task status"
        assignee:
          type: "object"
          properties:
            user_id: {"type": "string"}
            name: {"type": "string"}
            department: 
              type: "string"
              enum: ["engineering", "design", "product", "marketing"]
          required: ["user_id", "name"]
        due_date:
          type: "string"
          format: "date"
          description: "Task due date"
        estimated_hours:
          type: "number"
          minimum: 0.5
          maximum: 40
          description: "Estimated hours to complete"
        tags:
          type: "array"
          items:
            type: "string"
          uniqueItems: true
          maxItems: 10
          description: "Task tags"
      required: ["task_id", "title", "priority", "status"]
```

## Usage Patterns

### Single Agent File

```yaml
# single_agent.yaml
schemas:
  - name: "EmailAnalysis"
    schema:
      type: "object"
      properties:
        sender: {"type": "string"}
        subject: {"type": "string"}
        sentiment: {"type": "string", "enum": ["positive", "negative", "neutral"]}
        urgency: {"type": "string", "enum": ["low", "medium", "high"]}
        action_required: {"type": "boolean"}
        summary: {"type": "string", "maxLength": 200}
      required: ["sender", "subject", "sentiment", "urgency", "action_required"]

agent:
  name: "email_analyzer"
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  system_prompt: "Analyze email content and extract key information."
  structured_output: "EmailAnalysis"
```

### Multi-Agent Configuration

```yaml
# multi_agent_system.yaml
schemas:
  - name: "CustomerFeedback"
    schema:
      type: "object"
      properties:
        customer_id: {"type": "string"}
        sentiment: {"type": "string", "enum": ["very_positive", "positive", "neutral", "negative", "very_negative"]}
        key_issues: {"type": "array", "items": {"type": "string"}}
        satisfaction_score: {"type": "integer", "minimum": 1, "maximum": 10}
      required: ["customer_id", "sentiment", "satisfaction_score"]

  - name: "ActionPlan"
    schema:
      type: "object"
      properties:
        priority: {"type": "string", "enum": ["low", "medium", "high", "critical"]}
        actions: 
          type: "array"
          items:
            type: "object"
            properties:
              action: {"type": "string"}
              owner: {"type": "string"}
              deadline: {"type": "string", "format": "date"}
            required: ["action", "owner"]
        estimated_impact: {"type": "string", "enum": ["low", "medium", "high"]}
      required: ["priority", "actions"]

agents:
  - name: "feedback_analyzer"
    model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    system_prompt: "Analyze customer feedback and extract insights."
    structured_output: "CustomerFeedback"
    
  - name: "action_planner"
    model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    system_prompt: "Create action plans based on feedback analysis."
    structured_output: "ActionPlan"
```

## Error Handling

### Validation Errors

When structured output validation fails, you can configure different behaviors:

```yaml
agent:
  name: "robust_extractor"
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  structured_output:
    schema: "StrictSchema"
    validation:
      strict: true
    error_handling:
      retry_on_validation_error: true
      max_retries: 3
      fallback_to_text: true  # Fall back to text if all retries fail
      timeout_seconds: 45
```

### Error Types

The system handles several types of errors:

- **Schema Validation Errors**: Invalid schema definitions
- **Model Creation Errors**: Failures in creating Pydantic models
- **Output Validation Errors**: Generated output doesn't match schema
- **Import Errors**: Cannot import specified Python classes
- **File Errors**: External schema files not found or malformed

### Logging

Enable detailed logging to debug structured output issues:

```python
import logging

# Enable debug logging for structured output
logging.getLogger('strands.experimental.config_loader.agent').setLevel(logging.DEBUG)

# Load and use agent
loader = AgentConfigLoader()
agent = loader.load_agent(config)
```

## Best Practices

### Schema Design

1. **Keep schemas focused**: Each schema should represent a single, well-defined data structure
2. **Use descriptive names**: Schema and field names should be clear and self-documenting
3. **Add descriptions**: Include descriptions for all fields to help the AI understand the expected output
4. **Set appropriate constraints**: Use minimum/maximum values, string lengths, and patterns to ensure data quality
5. **Make required fields explicit**: Clearly specify which fields are required vs optional

### Configuration Organization

1. **Separate concerns**: Use external schema files for complex or reusable schemas
2. **Group related schemas**: Organize schemas by domain or use case
3. **Use consistent naming**: Follow consistent naming conventions across schemas
4. **Document your schemas**: Include comments and descriptions in your configuration files

### Performance Optimization

1. **Cache agents**: Use cache keys when loading agents to avoid repeated configuration parsing
2. **Reuse schemas**: Define schemas once and reference them across multiple agents
3. **Optimize schema complexity**: Simpler schemas generally perform better
4. **Set appropriate timeouts**: Configure timeouts based on your schema complexity and model performance

### Error Handling Strategy

1. **Start permissive**: Begin with lenient validation and tighten as needed
2. **Use fallbacks**: Configure fallback to text output for non-critical applications
3. **Monitor failures**: Log and monitor validation failures to improve schemas
4. **Test thoroughly**: Test your schemas with various input types and edge cases

## Migration from Programmatic Usage

### Before (Programmatic)

```python
from pydantic import BaseModel
from strands import Agent

class UserProfile(BaseModel):
    name: str
    email: str
    age: int

agent = Agent(model="us.anthropic.claude-3-7-sonnet-20250219-v1:0")
result = agent.structured_output(UserProfile, "Extract user info")
```

### After (Configuration-Driven)

```yaml
# config.yaml
schemas:
  - name: "UserProfile"
    python_class: "myapp.models.UserProfile"

agent:
  name: "user_extractor"
  model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  structured_output: "UserProfile"
```

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

loader = AgentConfigLoader()
agent = loader.load_agent_from_file("config.yaml")
result = agent.structured_output("Extract user info")
```

## Troubleshooting

### Common Issues

1. **Schema not found**: Ensure schema names match exactly between definition and reference
2. **Import errors**: Verify Python class paths are correct and modules are importable
3. **Validation failures**: Check that your schema constraints match expected output format
4. **File not found**: Verify external schema file paths are correct and accessible

### Debug Steps

1. **Enable debug logging**: Set log level to DEBUG for detailed information
2. **Test schemas independently**: Use the PydanticModelFactory to test schema creation
3. **Validate with sample data**: Test your schemas with known good data
4. **Check agent configuration**: Verify all required configuration fields are present

### Getting Help

- Check the logs for detailed error messages
- Validate your JSON Schema syntax using online validators
- Test Pydantic models independently before using in configuration
- Review the comprehensive test suite for usage examples

## API Reference

### AgentConfigLoader

```python
class AgentConfigLoader:
    def load_agent(self, config: Dict[str, Any], cache_key: Optional[str] = None) -> Agent
    def get_schema_registry(self) -> SchemaRegistry
    def list_schemas(self) -> Dict[str, str]
```

### SchemaRegistry

```python
class SchemaRegistry:
    def register_schema(self, name: str, schema: Union[Dict[str, Any], Type[BaseModel], str]) -> None
    def register_from_config(self, schema_config: Dict[str, Any]) -> None
    def get_schema(self, name: str) -> Type[BaseModel]
    def resolve_schema_reference(self, reference: str) -> Type[BaseModel]
    def list_schemas(self) -> Dict[str, str]
```

### PydanticModelFactory

```python
class PydanticModelFactory:
    @staticmethod
    def create_model_from_schema(model_name: str, schema: Dict[str, Any]) -> Type[BaseModel]
    
    @staticmethod
    def validate_schema(schema: Dict[str, Any]) -> bool
    
    @staticmethod
    def get_schema_info(schema: Dict[str, Any]) -> Dict[str, Any]
```

## Examples Repository

For complete working examples, see the samples repository:

- `samples/01-tutorials/01-fundamentals/10-structured-output-config/`
- Business intelligence pipeline example
- Multi-agent structured output workflows
- Error handling and validation examples
- Performance optimization patterns
