# Deploying Strands Agents SDK Agents to AWS Lambda

AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. This makes it an excellent choice for deploying Strands Agents SDK agents because you only pay for the compute time you consume and don't need to manage hosts or servers.

If you're not familiar with the AWS CDK, check out the [official documentation](https://docs.aws.amazon.com/cdk/v2/guide/home.html).

This guide discusses Lambda integration at a high level - for a complete example project deploying to Lambda, check out the [`deploy_to_lambda` sample project on GitHub][project_code].

!!! note

    This Lambda deployment example does not implement response streaming as described in the [Async Iterators for Streaming](../concepts/streaming/async-iterators.md) documentation. If you need streaming capabilities, consider using the [AWS Fargate deployment](deploy_to_aws_fargate.md) approach which does implement streaming responses.

## Using the Strands Agents Lambda Layer

The fastest way to get started with Strands Agents on Lambda is to use the official Lambda layer. This eliminates the need to package dependencies yourself - simply add the layer to your function and start writing agent code.

### Layer ARN Format

```
arn:aws:lambda:{region}:856699698935:layer:strands-agents-py{python_version}-{architecture}:{layer_version}
```

**Example:**

```
arn:aws:lambda:us-east-1:856699698935:layer:strands-agents-py3_12-x86_64:1
```

### Available Variants

| Component | Options |
|-----------|---------|
| **Python Versions** | `py3_10`, `py3_11`, `py3_12`, `py3_13` |
| **Architectures** | `x86_64`, `aarch64` |
| **Regions** | `us-east-1`, `us-east-2`, `us-west-1`, `us-west-2`, `eu-west-1`, `eu-west-2`, `eu-west-3`, `eu-central-1`, `eu-north-1`, `ap-southeast-1`, `ap-southeast-2`, `ap-northeast-1`, `ap-northeast-2`, `ap-northeast-3`, `ap-south-1`, `sa-east-1`, `ca-central-1` |

!!! tip "Layer Contents"
    The Lambda layer includes the base `strands-agents` package. If you need additional tools from `strands-agents-tools` or other dependencies, you can either package them in a separate layer or include them with your function code.

### Using the Layer with CDK

```typescript
const weatherFunction = new lambda.Function(this, "AgentLambda", {
  runtime: lambda.Runtime.PYTHON_3_12,
  functionName: "AgentFunction",
  handler: "agent_handler.handler",
  code: lambda.Code.fromAsset("./lambda"),
  timeout: Duration.seconds(30),
  memorySize: 128,
  architecture: lambda.Architecture.X86_64,
  layers: [
    lambda.LayerVersion.fromLayerVersionArn(
      this,
      "StrandsAgentsLayer",
      "arn:aws:lambda:us-east-1:856699698935:layer:strands-agents-py3_12-x86_64:1"
    ),
  ],
});
```

### Using the Layer via AWS Console or CLI

Add the layer ARN directly when creating or updating your Lambda function:

```bash
aws lambda update-function-configuration \
  --function-name MyAgentFunction \
  --layers arn:aws:lambda:us-east-1:856699698935:layer:strands-agents-py3_12-x86_64:1
```

## Creating Your Agent in Python

The core of your Lambda deployment is the agent handler code. This Python script initializes your Strands Agents SDK agent and processes incoming requests. 

The Lambda handler follows these steps:

1. Receive an event object containing the input prompt
2. Create a Strands Agents SDK agent with the specified system prompt and tools
3. Process the prompt through the agent
4. Extract the text from the agent's response
5. Format and return the response back to the client

Here's an example of a weather forecasting agent handler ([`agent_handler.py`][agent_handler]):

```python
from strands import Agent
from strands_tools import http_request
from typing import Dict, Any

# Define a weather-focused system prompt
WEATHER_SYSTEM_PROMPT = """You are a weather assistant with HTTP capabilities. You can:

1. Make HTTP requests to the National Weather Service API
2. Process and display weather forecast data
3. Provide weather information for locations in the United States

When retrieving weather information:
1. First get the coordinates or grid information using https://api.weather.gov/points/{latitude},{longitude} or https://api.weather.gov/points/{zipcode}
2. Then use the returned forecast URL to get the actual forecast

When displaying responses:
- Format weather data in a human-readable way
- Highlight important information like temperature, precipitation, and alerts
- Handle errors appropriately
- Convert technical terms to user-friendly language

Always explain the weather conditions clearly and provide context for the forecast.
"""

# The handler function signature `def handler(event, context)` is what Lambda
# looks for when invoking your function.
def handler(event: Dict[str, Any], _context) -> str:
    weather_agent = Agent(
        system_prompt=WEATHER_SYSTEM_PROMPT,
        tools=[http_request],
    )

    response = weather_agent(event.get('prompt'))
    return str(response)
```

## Infrastructure

To deploy the above agent to Lambda using the TypeScript CDK, prepare your code for deployment by creating the Lambda definition. You can either use the [official Strands Agents Lambda layer](#using-the-strands-agents-lambda-layer) or create a custom layer with additional dependencies.

### Using a Custom Dependencies Layer

If you need packages beyond the base `strands-agents` SDK (such as `strands-agents-tools`), you can create a custom layer ([`AgentLambdaStack.ts`][AgentLambdaStack]):

```typescript
const packagingDirectory = path.join(__dirname, "../packaging");
const zipDependencies = path.join(packagingDirectory, "dependencies.zip");
const zipApp = path.join(packagingDirectory, "app.zip");

// Create a lambda layer with dependencies
const dependenciesLayer = new lambda.LayerVersion(this, "DependenciesLayer", {
  code: lambda.Code.fromAsset(zipDependencies),
  compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
  description: "Dependencies needed for agent-based lambda",
});

// Define the Lambda function
const weatherFunction = new lambda.Function(this, "AgentLambda", {
  runtime: lambda.Runtime.PYTHON_3_12,
  functionName: "AgentFunction",
  handler: "agent_handler.handler",
  code: lambda.Code.fromAsset(zipApp),
  timeout: Duration.seconds(30),
  memorySize: 128,
  layers: [dependenciesLayer],
  architecture: lambda.Architecture.ARM_64,
});

// Add permissions for Bedrock apis
weatherFunction.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
    resources: ["*"],
  }),
);
```

The dependencies are packaged and pulled in via a Lambda layer separately from the application code. By separating your dependencies into a layer, your application code remains small and enables you to view or edit your function code directly in the Lambda console.

!!! info "Installing Dependencies with the Correct Architecture"
    
    When deploying to AWS Lambda, it's important to install dependencies that match the target Lambda architecture. Because the example above uses ARM64 architecture, dependencies must be installed specifically for this architecture:
    
    ```shell
    # Install Python dependencies for lambda with correct architecture
    pip install -r requirements.txt \
        --python-version 3.12 \
        --platform manylinux2014_aarch64 \
        --target ./packaging/_dependencies \
        --only-binary=:all:
    ```
    
    This ensures that all binary dependencies are compatible with the Lambda ARM64 environment regardless of the operating-system used for development.

    Failing to match the architecture can result in runtime errors when the Lambda function executes.

### Packaging Your Code

The CDK constructs above expect the Python code to be packaged before running the deployment - this can be done using a Python script that creates two ZIP files ([`package_for_lambda.py`][package_for_lambda]):

```python
def create_lambda_package():
    current_dir = Path.cwd()
    packaging_dir = current_dir / "packaging"

    app_dir = current_dir / "lambda"
    app_deployment_zip = packaging_dir / "app.zip"

    dependencies_dir = packaging_dir / "_dependencies"
    dependencies_deployment_zip = packaging_dir / "dependencies.zip"
    
    # ...
    
    with zipfile.ZipFile(dependencies_deployment_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(dependencies_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = Path("python") / os.path.relpath(file_path, dependencies_dir)
                zipf.write(file_path, arcname)

    with zipfile.ZipFile(app_deployment_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(app_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, app_dir)
                zipf.write(file_path, arcname)
```

This approach gives you full control over where your app code lives and how you want to package it.

## Deploying Your Agent & Testing

Assuming that Python & Node dependencies are already installed, package up the assets, run the CDK and deploy:

```bash
python ./bin/package_for_lambda.py

# Bootstrap your AWS environment (if not already done)
npx cdk bootstrap
# Deploy the stack
npx cdk deploy
```

Once fully deployed, testing can be done by hitting the lambda using the AWS CLI:

```bash
aws lambda invoke --function-name AgentFunction \
  --region us-east-1 \
  --cli-binary-format raw-in-base64-out \
  --payload '{"prompt": "What is the weather in Seattle?"}' \
  output.json

# View the formatted output
jq -r '.' ./output.json
```

## Using MCP Tools on Lambda

When using [Model Context Protocol (MCP)](../concepts/tools/mcp-tools.md) tools with Lambda, there are important considerations for transport selection and connection lifecycle management.

### Transport Selection

**stdio transport does not work on Lambda.** The standard stdio transport relies on spawning local processes using commands like `uvx` or `npx`, which are not available in the Lambda execution environment.

Instead, use HTTP-based transports:

- **Streamable HTTP** - Recommended for most use cases
- **SSE (Server-Sent Events)** - For servers that support SSE transport

```python
from mcp.client.streamable_http import streamablehttp_client
from strands import Agent
from strands.tools.mcp import MCPClient

def handler(event, context):
    # Use HTTP-based transport instead of stdio
    mcp_client = MCPClient(
        lambda: streamablehttp_client("https://your-mcp-server.example.com/mcp")
    )

    with mcp_client:
        tools = mcp_client.list_tools_sync()
        agent = Agent(
            system_prompt="You are a helpful assistant.",
            tools=tools,
        )
        response = agent(event.get("prompt"))

    return str(response)
```

### MCP Connection Lifecycle

**Create a new MCP context manager for each Lambda invocation.** The MCP connection should be established within the handler function, not at module level. This ensures:

1. **Clean connection state** - Each invocation gets a fresh connection
2. **Proper resource cleanup** - The context manager ensures connections are closed
3. **Cold start handling** - Connections are established when needed, not at import time

```python
from mcp.client.streamable_http import streamablehttp_client
from strands import Agent
from strands.tools.mcp import MCPClient

# ❌ Don't create MCP client at module level
# mcp_client = MCPClient(...)

def handler(event, context):
    # ✅ Create MCP client within the handler
    mcp_client = MCPClient(
        lambda: streamablehttp_client("https://your-mcp-server.example.com/mcp")
    )

    # ✅ Use context manager to manage connection lifecycle
    with mcp_client:
        tools = mcp_client.list_tools_sync()
        agent = Agent(tools=tools)
        response = agent(event.get("prompt"))

    return str(response)
```

!!! tip "HTTP Transport Performance"
    Creating an HTTP-based MCP connection per invocation is lightweight - it's simply establishing an HTTP connection to a remote server. This is very different from stdio transport, which spawns a subprocess and may download dependencies at runtime (e.g., when using `uvx`). The per-invocation pattern shown above adds minimal overhead for HTTP-based transports.

### AWS IAM Authentication

For MCP servers hosted on AWS that require SigV4 authentication, use the `mcp-proxy-for-aws` package:

```python
from mcp_proxy_for_aws.client import aws_iam_streamablehttp_client
from strands import Agent
from strands.tools.mcp import MCPClient

def handler(event, context):
    mcp_client = MCPClient(
        lambda: aws_iam_streamablehttp_client(
            endpoint="https://your-service.us-east-1.amazonaws.com/mcp",
            aws_region="us-east-1",
            aws_service="bedrock-agentcore"
        )
    )

    with mcp_client:
        tools = mcp_client.list_tools_sync()
        agent = Agent(tools=tools)
        response = agent(event.get("prompt"))

    return str(response)
```

!!! note
    If using `mcp-proxy-for-aws`, add it to your Lambda layer or package it with your function code.

## Summary

The above steps covered:

 - Using the official Strands Agents Lambda layer for quick deployment
 - Creating a Python handler that Lambda invokes to trigger an agent
 - Creating the CDK infrastructure to deploy to Lambda
 - Packaging up the Lambda handler and dependencies (when not using the layer)
 - Deploying the agent and infrastructure to an AWS account
 - Using MCP tools with HTTP-based transports on Lambda
 - Manually testing the Lambda function  

Possible follow-up tasks would be to:

  - Set up a CI/CD pipeline to automate the deployment process
  - Configure the CDK stack to use a [Lambda function URL](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html) or add an [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) to invoke the HTTP Lambda on a REST request.

## Complete Example

For the complete example code, including all files and configurations, see the [`deploy_to_lambda` sample project on GitHub][project_code].

## Related Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)

[project_code]: {{ docs_repo }}/docs/examples/cdk/deploy_to_lambda
[agent_handler]: {{ docs_repo }}/docs/examples/cdk/deploy_to_lambda/lambda/agent_handler.py
[AgentLambdaStack]: {{ docs_repo }}/docs/examples/cdk/deploy_to_lambda/lib/agent-lambda-stack.ts
[package_for_lambda]: {{ docs_repo }}/docs/examples/cdk/deploy_to_lambda/bin/package_for_lambda.py