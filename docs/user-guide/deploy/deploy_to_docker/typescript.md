# TypeScript Deployment to Docker

This guide covers deploying TypeScript-based Strands agents using Docker for local and cloud development.

## Prerequisites

- Node.js 20+
- [Docker](https://www.docker.com/) installed and running
- Model provider credentials

---

## Deploying with Docker

### Quick Start Setup

Configure Model Provider Credentials:
```bash
export OPENAI_API_KEY='<your-api-key>'
```

**Note**: This example uses OpenAI, but any supported model provider can be configured. See the [Strands documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers) for all supported model providers.

Create Project:
```bash
mkdir <app-name> && cd <app-name>
npm init -y
npm install @strands-agents/sdk express @types/express typescript ts-node
npm install -D @types/node
```

Project Structure:
```
<app-name>/
├── index.ts                # Express application
├── Dockerfile              # Container configuration
├── package.json            # Created by npm init
├── tsconfig.json           # TypeScript configuration
└── package-lock.json       # Created automatically by npm
```

Create tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Update package.json scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node index.ts"
  }
}
```

Create index.ts:
```typescript
--8<-- "user-guide/deploy/deploy_to_docker/imports.ts:imports"
--8<-- "user-guide/deploy/deploy_to_docker/index.ts:agent"
```

Create Dockerfile:
```dockerfile
# Use Node 20+
FROM node:20

WORKDIR /app

# Copy source code
COPY . ./

# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
```

### Step 1: Build Docker Image

Build your Docker image:
```bash
docker build -t <image-name>:latest .
```

### Step 2: Run Docker Container

Run the container with OpenAI credentials:
```bash
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  <image-name>:latest
```

### Step 3: Test Your Deployment

Test the endpoints:
```bash
# Health check
curl http://localhost:8080/ping

# Test agent invocation
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "What is artificial intelligence?"}}'
```

### Step 4: Making Changes

When you modify your code, rebuild and run:

```bash
# Rebuild image
docker build -t <image-name>:latest .

# Stop existing container (if running)
docker stop $(docker ps -q --filter ancestor=<image-name>:latest)

# Run new container
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  <image-name>:latest
```

## Troubleshooting

- **Container not starting**: Check logs with `docker logs <container-id>`
- **Connection refused**: Verify app is listening on 0.0.0.0:8080
- **Image build fails**: Check `package.json` and dependencies
- **TypeScript compilation errors**: Check `tsconfig.json` and run `npm run build` locally
- **"Unable to locate credentials"**: Verify model provider credentials environment variables are set
- **Port already in use**: Use different port mapping `-p 8081:8080`

## Cleanup

Stop and remove containers:
```bash
# Stop all containers using your image
docker stop $(docker ps -q --filter ancestor=<image-name>:latest)

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune
```

## Optional: Docker Compose

For easier management, create a `docker-compose.yml`:

```yaml
# Example for OpenAI
version: '3.8'
services:
  <app-name>:
    build: .
    ports:
      - "8080:8080"
    environment:
      - OPENAI_API_KEY=<your-api-key>
```

Run with Docker Compose:
```bash
# Start services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

## Optional: Deploy to Cloud Container Service

Once your application works locally with Docker, you can deploy it to any cloud-hosted container service. The Docker container you've created is the foundation for deploying to the cloud platform of your choice (AWS, GCP, Azure, etc).

Our other deployment guides build on this Docker foundation to show you how to deploy to specific cloud services:

- [Amazon Bedrock AgentCore](../deploy_to_bedrock_agentcore/typescript.md) - Deploy to AWS with Bedrock integration
- [AWS Fargate](../deploy_to_aws_fargate.md) - Deploy to AWS's managed container service
- [Amazon EKS](../deploy_to_amazon_eks.md) - Deploy to Kubernetes on AWS
- [Amazon EC2](../deploy_to_amazon_ec2.md) - Deploy directly to EC2 instances