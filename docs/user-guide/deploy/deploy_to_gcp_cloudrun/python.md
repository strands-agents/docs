# Python Deployment to Google's Cloud Run Platform

This guide covers deploying Python-based Strands agents to [Google Cloud Run Platform](https://docs.cloud.google.com/run/docs/quickstarts)

## Prerequisites

- Python 3.10+
- Google Cloud account with appropriate [permissions](https://docs.cloud.google.com/run/docs/reference/iam/roles)
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
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


This approach demonstrates how to deploy a custom agent using FastAPI and Docker, following Cloud Run requirements.

**Requirements**

- **FastAPI Server**: Web server framework for handling requests
- **`/invocations` Endpoint**: POST endpoint for agent interactions
- **`/ping` Endpoint**: GET endpoint for health checks
- **Container Engine**: Docker, Finch, or Podman (Docker used for this example)
- **Docker Container**: AMD64 containerized deployment package

### Step 1: Quick Start Setup

Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Configure Gemini Credentials (if using Gemini)   
User can configure API Keys for other model providers as outlined in the Quickstart Guide's "[Configuring Credentials](https://strandsagents.com/latest/documentation/docs/user-guide/quickstart/python/#configuring-credentials)"

```bash
export GOOGLE_API_KEY='<google-api-key>'
```

Create Project

```bash
mkdir my-custom-agent && cd my-custom-agent
uv init --python 3.11
uv add fastapi uvicorn[standard] pydantic httpx strands-agents google-genai
```

Project Structure example

```
my-custom-agent/
├── agent.py                # FastAPI application
├── Dockerfile              # AMD64 container configuration
├── pyproject.toml          # Created by uv init
└── uv.lock                 # Created automatically by uv
```

### Step 2: Prepare your agent code

Example: agent.py

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime,timezone
import os
from strands import Agent
from strands.models.gemini import GeminiModel

app = FastAPI(title="Strands Agent Server", version="1.0.0")

gemini_model = GeminiModel(
  client_args={
    "api_key": os.getenv("GOOGLE_API_KEY")
  },
  model_id="gemini-2.5-flash",
  params={"temperature": 0.7}
)

# Initialize Strands agent using Gemini
strands_agent = Agent(model=gemini_model)

class InvocationRequest(BaseModel):
    input: Dict[str, Any]

class InvocationResponse(BaseModel):
    output: Dict[str, Any]

@app.post("/invocations", response_model=InvocationResponse)
async def invoke_agent(request: InvocationRequest):
    try:
        user_message = request.input.get("prompt", "")
        if not user_message:
            raise HTTPException(
                status_code=400,
                detail="No prompt found in input. Please provide a 'prompt' key in the input."
            )

        result = strands_agent(user_message)
        response = {
            "message": result.message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "model": "strands-agent",
        }

        return InvocationResponse(output=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent processing failed: {str(e)}")

@app.get("/ping")
async def ping():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

### Step 3: Test Locally

```bash
# Run the application
uv run uvicorn agent:app --host 0.0.0.0 --port 8080

# Test /ping endpoint
curl http://localhost:8080/ping

# Test /invocations endpoint
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "input": {"prompt": "What is artificial intelligence?"}
  }'
```

### Step 4: Prepare your docker image

Create docker file

```dockerfile
# Use uv's AMD64 Python base image
FROM --platform=linux/amd64 ghcr.io/astral-sh/uv:python3.11-bookworm-slim

WORKDIR /app

# Copy uv files
COPY pyproject.toml uv.lock ./

# Install dependencies (including strands-agents)
RUN uv sync --frozen --no-cache

# Copy agent file
COPY agent.py ./

# Expose port
EXPOSE 8080

# Run application
CMD ["uv", "run", "uvicorn", "agent:app", "--host", "0.0.0.0", "--port", "8080"]
```

Setup Docker buildx

```bash
docker buildx create --use
```

Build and Test Locally

```bash
# Build the image
docker buildx build --platform linux/amd64 -t my-agent:amd64 --load .

# Test locally with credentials
docker run --platform linux/amd64 -p 8080:8080 \
  -e GOOGLE_API_KEY="your-api-key" \
  my-agent:amd64
```

Deploy to Cloud Run

```bash
# Build Cloud Run Image
gcloud builds submit \
  --tag gcr.io/<your-project-id>/my-agent \
  --project <your-project-id>

# Deploy built image
gcloud run deploy my-agent \
  --image gcr.io/<your-project-id>/my-agent \
  --region us-central1 \
  --project <your-project-id> \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=false,GOOGLE_API_KEY=<google-api-key>"

```

After successful deployment, the command will output the service URL. Look for:

```
Service URL: https://my-agent-<random-id>-central1.run.app
```

Save this URL as you'll need it to invoke your agent.

### Step 5: Invoke Your Agent

Execute shell

```bash

# Test /ping endpoint
curl https://my-agent-<random-id>-uc.a.run.app/ping

# Test /invocations endpoint
curl -X POST https://my-agent-<random-id>-central1.run.app/invocations \
-H "Content-Type: application/json" \
-d '{"input": {"prompt": "What is artificial intelligence?"}}'
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

