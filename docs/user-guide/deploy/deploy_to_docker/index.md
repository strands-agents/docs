Docker is a containerization platform that packages your Strands agents and their dependencies into lightweight, portable containers. It enables consistent deployment across different environments, from local development to production servers, ensuring your agent runs the same way everywhere. Across cloud deployment options, contianerizing your agent with Docker is often the foundational first step.

This guide walks you through containerizing your Strands agents with Docker, testing them locally, and preparing them for deployment to any container-based platform.

## Choose Strands SDK Your Language

Select your preferred programming language to get started with deploying Strands agents to Docker:

<div class="sl-link-card astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a href="python/" class="astro-mf7fz2mj"> <span class="title astro-mf7fz2mj">Python Deployment</span> </a> <span class="description astro-mf7fz2mj">Deploy your Python Strands agent to Docker!</span> </span> <svg aria-hidden="true" class="icon rtl:flip astro-mf7fz2mj astro-c6vsoqas" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="--sl-icon-size: 1.333em;"><path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/></svg> </div><div class="sl-link-card astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a href="typescript/" class="astro-mf7fz2mj"> <span class="title astro-mf7fz2mj">TypeScript Deployment</span> </a> <span class="description astro-mf7fz2mj">Deploy your TypeScript Strands agent to Docker!</span> </span> <svg aria-hidden="true" class="icon rtl:flip astro-mf7fz2mj astro-c6vsoqas" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="--sl-icon-size: 1.333em;"><path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/></svg> </div>

## Additional Resources

-   [Strands Documentation](https://strandsagents.com/latest/)
-   [Docker Documentation](https://docs.docker.com/)