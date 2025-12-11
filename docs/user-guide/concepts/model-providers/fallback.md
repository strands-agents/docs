# Fallback Model

The `FallbackModel` provides automatic failover capabilities between any two Strands model implementations. This library-level feature enables applications to automatically switch from a primary model to a fallback model when the primary experiences failures, improving reliability and resilience.

The `FallbackModel` class in Strands enables seamless failover with:

- Automatic failover on retryable errors (throttling, connection issues)
- Circuit breaker pattern to prevent cascading failures
- Provider-agnostic implementation (works with any model combination)
- Configurable behavior and thresholds
- Comprehensive statistics and observability
- Full support for streaming and structured output

## Getting Started

### Basic Usage

=== "Python"

    The simplest way to use `FallbackModel` is to wrap two model instances:

    ```python
    from strands import Agent
    from strands.models import FallbackModel, BedrockModel

    # Create a fallback model with two Bedrock models
    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    # Use with an agent
    agent = Agent(model=model)
    response = agent("Hello!")
    ```

{{ ts_not_supported_code() }}

### Cross-Provider Fallback

One of the key features of `FallbackModel` is its ability to work with any combination of model providers:

=== "Python"

    ```python
    from strands.models import FallbackModel, OpenAIModel, BedrockModel

    # OpenAI as primary, Bedrock as fallback
    model = FallbackModel(
        primary=OpenAIModel(model_id="gpt-4o"),
        fallback=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0")
    )

    agent = Agent(model=model)
    response = agent("Tell me about AI.")
    ```

{{ ts_not_supported_code() }}

## How It Works

### Automatic Failover

The `FallbackModel` automatically detects retryable errors and switches to the fallback model:

**Errors that trigger fallback:**
- `ModelThrottledException` (rate limiting)
- Connection errors (network, timeout, refused, unavailable, etc.)
- Custom errors via the `should_fallback` configuration function

**Errors that do NOT trigger fallback:**
- `ContextWindowOverflowException` (non-retryable)
- Other non-retryable errors

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    # If primary is throttled or has connection issues, 
    # fallback model is automatically used
    agent = Agent(model=model)
    response = agent("Hello!")
    ```

{{ ts_not_supported_code() }}

### Circuit Breaker Pattern

The circuit breaker monitors primary model failures within a sliding time window. When the failure threshold is exceeded, it "opens" and routes all requests directly to the fallback model for a cooldown period.

**Circuit States:**
- **Closed** (default): Attempt primary model for each request
- **Open**: Skip primary model, use fallback model directly
- **Half-Open**: After cooldown, next request tests if primary has recovered

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0"),
        circuit_failure_threshold=3,  # Open circuit after 3 failures
        circuit_time_window=60.0,      # Within 60 seconds
        circuit_cooldown_seconds=30    # Wait 30 seconds before retrying primary
    )

    agent = Agent(model=model)
    
    # After 3 failures within 60 seconds, circuit opens
    # All requests go directly to fallback for 30 seconds
    # After 30 seconds, circuit closes and primary is retried
    ```

{{ ts_not_supported_code() }}

## Configuration Options

=== "Python"

    The `FallbackModel` supports various configuration parameters. For a complete list of available options, see the [FallbackModel API reference](../../../api-reference/models.md#strands.models.fallback).

    Common configuration parameters include:

    - `primary` - The primary Model instance to use for requests (required)
    - `fallback` - The fallback Model instance to use when primary fails (required)
    - `circuit_failure_threshold` - Number of failures before circuit opens (default: 3)
    - `circuit_time_window` - Time window in seconds for counting failures (default: 60.0)
    - `circuit_cooldown_seconds` - Cooldown period in seconds before retrying primary (default: 30)
    - `should_fallback` - Optional custom function for error classification (default: None)
    - `track_stats` - Whether to track usage statistics (default: True)

{{ ts_not_supported_code() }}

### Example with Configuration

=== "Python"

    ```python
    from strands import Agent
    from strands.models import FallbackModel, BedrockModel

    # Create a configured fallback model
    model = FallbackModel(
        primary=BedrockModel(
            model_id="anthropic.claude-sonnet-4-20250514-v1:0",
            temperature=0.7
        ),
        fallback=BedrockModel(
            model_id="us.anthropic.claude-3-haiku-20240307-v1:0",
            temperature=0.5
        ),
        circuit_failure_threshold=5,    # More tolerant of failures
        circuit_time_window=120.0,      # Longer time window
        circuit_cooldown_seconds=60,    # Longer cooldown
        track_stats=True                # Enable statistics tracking
    )

    agent = Agent(model=model)
    response = agent("Tell me about AI.")
    ```

{{ ts_not_supported_code() }}

## Advanced Features

### Custom Error Classification

You can provide a custom function to determine which errors should trigger fallback:

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    def custom_should_fallback(error: Exception) -> bool:
        """Custom logic to determine if error should trigger fallback."""
        error_str = str(error).lower()
        
        # Fallback on specific error messages
        if "service unavailable" in error_str:
            return True
        if "internal error" in error_str:
            return True
            
        # Don't fallback on validation errors
        if "validation" in error_str:
            return False
            
        return False

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0"),
        should_fallback=custom_should_fallback
    )
    ```

{{ ts_not_supported_code() }}

### Statistics and Monitoring

Track fallback usage and circuit breaker state for monitoring and debugging:

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0"),
        track_stats=True  # Enable statistics tracking (default)
    )

    agent = Agent(model=model)
    
    # Use the agent
    response = agent("Hello!")
    
    # Get statistics
    stats = model.get_stats()
    print(f"Fallback count: {stats['fallback_count']}")
    print(f"Primary failures: {stats['primary_failures']}")
    print(f"Circuit skips: {stats['circuit_skips']}")
    print(f"Using fallback: {stats['using_fallback']}")
    print(f"Circuit open: {stats['circuit_open']}")
    print(f"Recent failures: {stats['recent_failures']}")
    print(f"Primary model: {stats['primary_model_name']}")
    print(f"Fallback model: {stats['fallback_model_name']}")
    ```

{{ ts_not_supported_code() }}

### Resetting Statistics

You can reset statistics and circuit breaker state:

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    # After some usage and failures
    model.reset_stats()

    # Statistics are now cleared
    stats = model.get_stats()
    assert stats['fallback_count'] == 0
    assert stats['circuit_open'] == False
    ```

{{ ts_not_supported_code() }}

### Streaming Support

`FallbackModel` fully supports streaming responses:

=== "Python"

    ```python
    from strands import Agent
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    agent = Agent(model=model)

    # Stream responses with automatic fallback
    for chunk in agent.stream("Tell me a story"):
        if chunk.get("chunk_type") == "text":
            print(chunk["data"], end="", flush=True)
    ```

{{ ts_not_supported_code() }}

### Structured Output Support

`FallbackModel` supports structured output with automatic fallback:

=== "Python"

    ```python
    from pydantic import BaseModel, Field
    from strands import Agent
    from strands.models import FallbackModel, BedrockModel

    class WeatherReport(BaseModel):
        """Weather report structure."""
        location: str = Field(description="Location name")
        temperature: float = Field(description="Temperature in Celsius")
        conditions: str = Field(description="Weather conditions")

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    agent = Agent(model=model)

    # Get structured output with automatic fallback
    result = agent.structured_output(
        WeatherReport,
        "The weather in Seattle is 18 degrees and partly cloudy."
    )

    print(f"Location: {result.location}")
    print(f"Temperature: {result.temperature}°C")
    print(f"Conditions: {result.conditions}")
    ```

{{ ts_not_supported_code() }}

### Updating Configuration at Runtime

You can update the fallback model configuration during runtime:

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0"),
        circuit_failure_threshold=3
    )

    # Update configuration later
    model.update_config(
        circuit_failure_threshold=5,
        circuit_time_window=120.0,
        circuit_cooldown_seconds=60
    )
    ```

{{ ts_not_supported_code() }}

### Getting Complete Configuration

You can retrieve the complete configuration including both models:

=== "Python"

    ```python
    from strands.models import FallbackModel, BedrockModel

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    config = model.get_config()
    
    # Access fallback configuration
    print(f"Circuit threshold: {config['fallback_config']['circuit_failure_threshold']}")
    
    # Access primary model configuration
    print(f"Primary model: {config['primary_config']}")
    
    # Access fallback model configuration
    print(f"Fallback model: {config['fallback_model_config']}")
    
    # Access current statistics
    if config['stats']:
        print(f"Fallback count: {config['stats']['fallback_count']}")
    ```

{{ ts_not_supported_code() }}

## Use Cases

### High Availability Applications

Use `FallbackModel` to ensure your application continues functioning even when the primary model provider experiences issues:

=== "Python"

    ```python
    from strands import Agent
    from strands.models import FallbackModel, OpenAIModel, BedrockModel

    # OpenAI as primary for best quality, Bedrock as reliable fallback
    model = FallbackModel(
        primary=OpenAIModel(model_id="gpt-4o"),
        fallback=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        circuit_failure_threshold=2,  # Quick failover
        circuit_cooldown_seconds=60   # Give primary time to recover
    )

    agent = Agent(model=model)
    ```

{{ ts_not_supported_code() }}

## Best Practices

### Choose Appropriate Thresholds

Configure circuit breaker thresholds based on your application's needs:

- **Low threshold (2-3)**: Quick failover for latency-sensitive applications
- **Medium threshold (5-7)**: Balanced approach for most applications
- **High threshold (10+)**: Tolerant of transient issues, prefer primary model

### Monitor Statistics

Regularly check fallback statistics to identify issues:

=== "Python"

    ```python
    import logging
    from strands.models import FallbackModel, BedrockModel

    logger = logging.getLogger(__name__)

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    # Periodically check statistics
    stats = model.get_stats()
    if stats['fallback_count'] > 10:
        logger.warning(f"High fallback usage: {stats['fallback_count']} times")
    if stats['circuit_open']:
        logger.error("Circuit breaker is open - primary model failing")
    ```

{{ ts_not_supported_code() }}

### Test Both Models

Ensure both primary and fallback models work correctly for your use case:

=== "Python"

    ```python
    from strands import Agent
    from strands.models import BedrockModel

    # Test primary model
    primary = BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0")
    agent_primary = Agent(model=primary)
    response_primary = agent_primary("Test message")
    
    # Test fallback model
    fallback = BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    agent_fallback = Agent(model=fallback)
    response_fallback = agent_fallback("Test message")
    
    # Both should work before using FallbackModel
    ```

{{ ts_not_supported_code() }}

### Consider Model Compatibility

Ensure both models support the features you need:

- Tool calling support
- Streaming support
- Structured output support
- Multimodal inputs (if needed)

## Logging and Debugging

`FallbackModel` provides comprehensive logging for debugging:

=== "Python"

    ```python
    import logging
    from strands import Agent
    from strands.models import FallbackModel, BedrockModel

    # Enable debug logging
    logging.basicConfig(level=logging.DEBUG)

    model = FallbackModel(
        primary=BedrockModel(model_id="anthropic.claude-sonnet-4-20250514-v1:0"),
        fallback=BedrockModel(model_id="us.anthropic.claude-3-haiku-20240307-v1:0")
    )

    agent = Agent(model=model)
    response = agent("Hello!")

    # Logs will show:
    # - FallbackModel initialization
    # - Primary model attempts
    # - Fallback triggers
    # - Circuit breaker state changes
    # - Error details
    ```

{{ ts_not_supported_code() }}

## API Reference

For complete API documentation, see the [FallbackModel API Reference](../../../api-reference/models.md#strands.models.fallback).
