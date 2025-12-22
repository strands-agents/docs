# Typescript Deployment to Google's Cloud Run Platform

> ⚠️ **Important**: Gemini models are only supported in Python SDK. This example uses the OpenAI model provider.

This guide covers deploying Typescript-based Strands agents to [Google Cloud Run Platform](https://docs.cloud.google.com/run/docs/quickstarts) using Express and Docker.

## Prerequisites

- Node.js 20+
- Google Cloud account with appropriate [permissions](https://docs.cloud.google.com/run/docs/reference/iam/roles)
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- OpenAI API Key Credentials
  - Or supported model crendentials of your choice
  - Gemini not supported in Typescript
- A container engine: this example will use [Docker](https://www.docker.com/)

### Setup Google Cloud

1. Install and authenticate with Google Cloud CLI:
```bash
# Install gcloud CLI (if not already installed)
# Follow instructions at: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set your project
gcloud config set project <your-project-id>
```

2. Enable required APIs:
```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Cloud Build API  
gcloud services enable cloudbuild.googleapis.com
```

---
## Deploying to Cloud Run

### Step 1: Quick Start Setup

#### Create project structure

```bash
mkdir my-typescript-agent && cd my-typescript-agent
npm init -y
```

Create or update your `package.json` with the following configuration and dependencies:

```json
{
  "name": "my-typescript-agent",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js"
  },
  "dependencies": {
    "@strands-agents/sdk": "latest",
    "express": "^4.18.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "typescript": "^5.3.3"
  }
}
```

Then install all dependencies:

```bash
npm install
```

#### Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
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

#### Configure credentials
This example utilizes the OpenAI model provider.
User can configure API Keys for other model providers as outlined in the Quickstart Guide's "[Configuring Credentials](https://strandsagents.com/latest/documentation/docs/user-guide/quickstart/typescript/#configuring-credentials)".


### Step 2: Prepare your agent code

Example: index.ts

```typescript
import { Agent } from '@strands-agents/sdk'
import { OpenAIModel } from '@strands-agents/sdk/openai'
import express, { type Request, type Response } from 'express'

const PORT = process.env.PORT || 8080
// Configure the agent with Open AI
const agent = new Agent({
  model: new OpenAIModel({
    apiKey: process.env.OPENAI_API_KEY || '<openai-api-key>',
    modelId: 'gpt-4o',
  })
})

const app = express()

// Health check endpoint (REQUIRED)
app.get('/ping', (_, res) =>
  res.json({
    status: 'Healthy',
    time_of_last_update: Math.floor(Date.now() / 1000),
  })
)

// Agent invocation endpoint (REQUIRED)
app.post('/invocations', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    console.log('Request body type:', typeof req.body)
    console.log('Request body:', req.body)
    console.log('Content-Type:', req.headers['content-type'])

    // Decode binary payload
    const prompt = new TextDecoder().decode(req.body)

    // Invoke the agent
    const response = await agent.invoke(prompt)

    // Return response
    return res.json({ response })
  } catch (err) {
    console.error('Error processing request:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AgentCore Runtime server listening on port ${PORT}`)
  console.log(`📍 Endpoints:`)
  console.log(`   POST http://0.0.0.0:${PORT}/invocations`)
  console.log(`   GET  http://0.0.0.0:${PORT}/ping`)
})
```

### Step 3: Test Locally

**Compile & Start server**
```bash
npm run build

npm start
```

**Test health check**

```bash
curl http://localhost:8080/ping
```

**Test invocation**

```bash
echo -n "What is artificial intelligence?" | curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/octet-stream" \
  --data-binary @-
```

### Step 4: Prepare your docker image

Create docker file

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

Build and Test Locally

**Build the image**

```bash
docker build -t my-typescript-agent .
```

**Run the container**

```bash
docker run -p 8081:8080 my-typescript-agent
```

**Test in another terminal**

```bash
curl http://localhost:8081/ping

echo -n "What is artificial intelligence?" | curl -X POST http://localhost:8081/invocations \
  -H "Content-Type: application/octet-stream" \
  --data-binary @-
```

### Step 5: Deploy to Cloud Run

```bash
# Build Docker Image
docker build --platform linux/amd64 -t gcr.io/<your-project-id>/my-typescript-agent .

# Push docker image
 docker push gcr.io/<your-project-id>/my-typescript-agent

# Deploy built image
gcloud run deploy my-typescript-agent \
--image gcr.io/<your-project-id>/my-typescript-agent \
--region us-central1 --project <your-project-id> 

```

After successful deployment, the command will output the service URL. Look for:

```
Service URL: https://my-typescript-agent-<random-id>-central1.run.app
```

Save this URL as you'll need it to invoke your agent.

### Step 6: Invoke Your Agent

Execute shell to test

```bash
# Test /ping endpoint
curl https://my-typescript-agent-<random-id>.us-central1.run.app/ping

# Test /invocations endpoint
echo -n "What is artificial intelligence?" | curl -X POST "https://my-typescript-agent-<random-id>.us-central1.run.app/invocations" \
-H "Content-Type: application/octet-stream" \
--data-binary @-
```


Expected Response Format

```json
{
  "output": {
    "message": {
      "role": "assistant",
      "content": [
        {
          "text": "# Artificial Intelligence in Simple Terms\n\nArtificial Intelligence (AI) is technology that allows computers to do tasks that normally need human intelligence. Think of it as teaching machines to:\n\n- Learn from information (like how you learn from experience)\n- Make decisions based on what they've learned\n- Recognize patterns (like identifying faces in photos)\n- Understand language (like when I respond to your questions)\n\nInstead of following specific step-by-step instructions for every situation, AI systems can adapt to new information and improve over time.\n\nExamples you might use every day include voice assistants like Siri, recommendation systems on streaming services, and email spam filters that learn which messages are unwanted."
        }
      ]
    },
    "timestamp": "2025-07-13T01:48:06.740668",
    "model": "strands-agent"
  }
}
```

---

## Additional Resources

- [Strands Documentation](https://strandsagents.com/latest/)
- [GCP IAM Documentation](https://docs.cloud.google.com/iam/docs/overview)
- [Docker Documentation](https://docs.docker.com/)
- [Cloud Run Documentation](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run)
- [OpenAI Model Provider Documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers/openai/)