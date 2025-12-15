# Community Packages

The Strands Agents SDK is built on community contributions that extend agent capabilities through custom tools and integrations. If you've built a useful extension for Strands Agents that solves a common problem or integrates with popular services, packaging it for distribution allows other developers to benefit from your work.

## Creating A Package

The first step to sharing your Strands component with the community is creating a Python package. Follow the [official Python packaging tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/) for complete packaging guidance. The key steps are:

- **Create a GitHub repository** - use the naming convention `strands-{thing}` for consistency with the ecosystem.
- **Add detailed documentation** - add a README with usage examples and API references.
- **Include thorough tests** - use unit tests to verify business logic and integration tests to validate the components works against one or more providers. Ensure proper code coverage.

[strands-clova](https://github.com/aidendef/strands-clova) is a community package that can serve as a good example.

## Publishing to PyPI

Once you have a package, you can then publish to PyPI to make it consumable to others. Publishing to PyPI allows users to install your package with pip.

Best practices for publishing include:

- **Configure GitHub workflows** - set up CI/CD to automatically publish releases to PyPI when you create new releases.
- **Follow semantic versioning** - use semver.org conventions for version numbering to help users understand the impact of updates.

## Getting Featured in Documentation

Once your package is published to PyPI, you can request to have it featured in the Strands Agents documentation. Featured packages should provide clear utility to the community and meet high quality standards including comprehensive documentation, thorough testing, and reliable functionality.

Submit your package for consideration by creating an issue in the [Strands Agents documentation repository](https://github.com/strands-agents/docs/issues). Include:

 - Package Name: the name your package name and PyPI link
 - Description: a brief description of functionality including why it benefits the community.
 - Usage examples: how strands customers would wire up and use the components 

Accepted packages will be featured in the Community Package documentation with package descriptions and installation instructions, usage examples showing integration with Strands Agents, and links to the project repository and documentation.

## Best Practices and Examples

### Model Providers

Model providers enable integration with third-party LLM services by implementing the Strands Agents `Model` interface. Each provider should focus on a single service or platform, exposing configuration parameters through structured config objects that users can customize for their specific needs.

For detailed implementation guidance including the `ModelConfig` pattern, `stream` method requirements, and `StreamEvent` formatting, see the [Custom Model Provider documentation](../user-guide/concepts/model-providers/custom_model_provider.md).

A good example of a community model provider is [strands-clova](https://github.com/aidendef/strands-clova).

### Tools

Each tool should have a clear, focused purpose following the single responsibility principle. Use descriptive naming with clear, intuitive names for tools and parameters that make their function obvious to users. Docstrings should include detailed descriptions, parameter explanations, and usage examples to help developers understand how to use your tools effectively.

The [strands-agents-tools](https://github.com/strands-agents/tools) repository serves as an example community tools package and provides example tools to follow for other tool packages. Good example tools include:

 - [sleep](https://github.com/strands-agents/tools/blob/main/src/strands_tools/sleep.py) - includes explicit error checking with messages that guide the caller on how to correct errors
 - [browser](https://github.com/strands-agents/tools/blob/main/src/strands_tools/browser/__init__.py) - detailing how to support multiple tools that share a common core.

## Support & Resources

Building community packages extends the Strands Agents ecosystem and helps other developers solve complex problems with AI agents. Your contributions make the entire community more capable and productive.

If you need help or support building community packages, start a discussion in the [Strands Agents SDK repository](https://github.com/strands-agents/sdk-python/discussions).

