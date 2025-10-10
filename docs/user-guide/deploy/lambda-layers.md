# Strands Agents Lambda Layers

AWS Lambda layers provide a convenient way to package libraries, custom runtimes, or other function dependencies that can be shared across multiple Lambda functions. The Strands Agents SDK publishes pre-built Lambda layers containing the SDK and its dependencies, making it easier to deploy your agents without managing dependencies yourself.

For detailed instructions on how to use Lambda layers with your functions, see the [AWS Lambda Layers Documentation](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html).

## ARN Format

```
arn:aws:lambda:{REGION}:856699698935:layer:strands-agents-{VERSION}-{ARCHITECTURE}:{LAYER_VERSION}
```

| Parameter | Values |
|-----------|--------|
| `REGION` | All commercial regions |
| `VERSION` | py3_10, py3_11, py3_12 |
| `ARCHITECTURE` | x86_64, arm64 |
| `LAYER_VERSION` | Layer version number |

## Available Layers

<!-- LAYER_TABLE_START -->
| Version | PyPI Version | ARN Format |
|---------|--------------|------------|
| 4 | [1.0.0](https://pypi.org/project/strands-agents/1.0.0) | `arn:aws:lambda:{REGION}:856699698935:layer:strands-agents-{VERSION}-{ARCHITECTURE}:4` |
<!-- LAYER_TABLE_END -->
