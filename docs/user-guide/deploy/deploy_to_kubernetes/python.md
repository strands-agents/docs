# Python Deployment to Kubernetes

This guide covers deploying Python-based Strands agents to Kubernetes using Kind (Kubernetes in Docker) for local and cloud development.

## Prerequisites

- Python 3.10+
- [Docker](https://www.docker.com/) installed and running
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- Model provider credentials

### Step 1: Setup Kind Cluster

Create a Kind cluster:
```bash
kind create cluster --name <cluster-name>
```

Verify cluster is running:
```bash
kubectl get nodes
```

### Step 2: Quick Start Setup

Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Configure Model Provider Credentials:
```bash
export OPENAI_API_KEY='<your-api-key>'
```

**Note**: This example uses OpenAI, but any supported model provider can be configured. See the [Strands documentation](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/model-providers) for all supported model providers.

Create Project:
```bash
mkdir <app-name> && cd <app-name>
uv init --python 3.11
uv add fastapi uvicorn[standard] pydantic strands-agents strands-agents[openai]
```

Project Structure:
```
<app-name>/
├── agent.py                # FastAPI application
├── Dockerfile              # Container configuration
├── k8s-deployment.yaml     # Kubernetes manifests
├── pyproject.toml          # Created by uv init
└── uv.lock                 # Created automatically by uv
```

Create agent.py:
```python
--8<-- "user-guide/deploy/deploy_to_kubernetes/imports.py:imports"
--8<-- "user-guide/deploy/deploy_to_kubernetes/agent.py:agent"
```

Create Dockerfile:
```dockerfile
# Use uv's Python base image
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

WORKDIR /app

# Copy uv files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-cache

# Copy agent file
COPY agent.py ./

# Expose port
EXPOSE 8080

# Run application
CMD ["uv", "run", "uvicorn", "agent:app", "--host", "0.0.0.0", "--port", "8080"]
```

Create k8s-deployment.yaml:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <service-name>
spec:
  replicas: 1
  selector:
    matchLabels:
      app: <app-name>
  template:
    metadata:
      labels:
        app: <app-name>
    spec:
      containers:
      - name: <app-name>
        image: <image-name>:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 8080
        env:
        - name: OPENAI_API_KEY
          value: "<your-api-key>"
---
apiVersion: v1
kind: Service
metadata:
  name: <service-name>
spec:
  selector:
    app: <app-name>
  ports:
  - port: 8080
    targetPort: 8080
  type: NodePort
```

---

## Deploying to Kubernetes

### Step 3: Build and Load Docker Image

Build your Docker image:
```bash
docker build -t <image-name>:latest .
```

Load image into Kind cluster:
```bash
kind load docker-image <image-name>:latest --name <cluster-name>
```

### Step 4: Deploy to Kubernetes

Apply the Kubernetes manifests:
```bash
kubectl apply -f k8s-deployment.yaml
```

Verify deployment:
```bash
kubectl get pods
kubectl get services
```

### Step 5: Test Your Deployment

Port forward to access the service:
```bash
kubectl port-forward svc/<service-name> 8080:8080
```

Test the endpoints:
```bash
# Health check
curl http://localhost:8080/ping

# Test agent invocation
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "What is artificial intelligence?"}}'
```

### Step 6: Making Changes

When you modify your code, redeploy with:

```bash
# Rebuild image
docker build -t <image-name>:latest .

# Load into cluster
kind load docker-image <image-name>:latest --name <cluster-name>

# Restart deployment
kubectl rollout restart deployment <app-name>
```

## Troubleshooting

- **Pod not starting**: Check logs with `kubectl logs <pod-name>`
- **Connection refused**: Verify app is listening on 0.0.0.0:8080
- **Image not found**: Ensure image is loaded with `kind load docker-image`
- **Dependencies missing**: Check `pyproject.toml` and rebuild image
- **"Unable to locate credentials"**: Verify model credentials are set and restart deployment

## Cleanup

Remove the Kind cluster when done:
```bash
kind delete cluster --name <cluster-name>
```

## Optional: Deploy Kubernetes Cluster to Cloud

Once your application works locally with Kind, you can deploy it to any cloud-hosted Kubernetes cluster:

See our documentation for [Deploying Strands Agents to Amazon EKS](https://strandsagents.com/latest/documentation/docs/user-guide/deploy/deploy_to_amazon_eks/) as an example of deploying your Strands Agent to AWS Elastic Kubernetes Service.

### Step 1: Push Container to Repository

Push your image to a container registry:
```bash
# Tag and push to your registry (Docker Hub, ECR, GCR, etc.)
docker tag <image-name>:latest <registry-url>/<image-name>:latest
docker push <registry-url>/<image-name>:latest
```
### Step 2: Update deployment configuration in `k8s-deployment.yaml`:

Change the image pull policy:
   ```yaml
   # Current (local development): Uses local cached images
   imagePullPolicy: Never

   # Change to (cloud deployment): Pulls image from registry
   imagePullPolicy: Always
   ```

Update the image URL:
   ```yaml
   # Current (local development):
   image: <image-name>:latest

   # Change to (cloud deployment):
   image: <registry-url>/<image-name>:latest
   ```

Update the service type for external access:
   ```yaml
   # Current (local development):
   type: NodePort

   # Change to (cloud deployment):
   type: LoadBalancer
   ```
   This gives your service a public IP address that users can access directly, instead of requiring port-forwarding or node IP addresses.

### Step 3: Apply to your cloud cluster:
```bash
# Connect to your cloud cluster (varies by provider)
kubectl config use-context <cloud-context>

# Deploy your application
kubectl apply -f k8s-deployment.yaml
```

**Note**: Your cloud cluster needs permissions to: 

- Pull images from your container registry
- Access your chosen model provider credentials