# Amazon EKS Deployment Example

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
export AWS_REGION=us-east-1
export CLUSTER_NAME=eks-strands-agents-demo
```

## Create EKS Auto Mode cluster using eksctl
```bash
eksctl create cluster --name $CLUSTER_NAME --enable-auto-mode
```

## Building and Pushing Docker Image to ECR

Follow these steps to build the Docker image and push it to Amazon ECR:

1. Authenticate to Amazon ECR:
```bash

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
```

2. Create the ECR repository if it doesn't exist:
```bash
aws ecr create-repository --repository-name strands-agents-weather --region ${AWS_REGION}
```

3. Build the Docker image:
```bash
cd docker
docker build --platform linux/amd64 -t strands-agents-weather:latest .
```

4. Tag the image for ECR:
```bash
docker tag strands-agents-weather:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/strands-agents-weather:latest
```

5. Push the image to ECR:
```bash
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/strands-agents-weather:latest
```
## Deploy strands-agents-weather application

1. Deploy the helm chart with the image from ECR:
```bash
cd ..
helm install strands-agents-weather ./chart --set image.repository=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/strands-agents-weather --set image.tag=latest
```

2. Create an IAM policy to allow access to Bedrock
```bash
cat > bedrock-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name strands-agents-weather-bedrock-policy \
  --policy-document file://bedrock-policy.json
```

3. EKS Pod Identity association
```bash
eksctl create podidentityassociation --cluster $CLUSTER_NAME \
  --namespace default \
  --service-account-name strands-agents-weather \
  --permission-policy-arns arn:aws:iam::$AWS_ACCOUNT_ID:policy/strands-agents-weather-bedrock-policy \
  --role-name eks-strands-agents-weather
```

## Test the Agent

Using kubernetes port-forward
```
kubectl --namespace default port-forward service/strands-agents-weather 8080:80
```

Call the weather service
```
curl -X POST \
  http://localhost:8080/weather \
  -H 'Content-Type: application/json' \
  -d '{"prompt": "What is the weather in Seattle?"}'
```

Call the weather streaming endpoint
```
curl -X POST \
  http://localhost:8080/weather-streaming \
  -H 'Content-Type: application/json' \
  -d '{"prompt": "What is the weather in New York in Celsius?"}'
```

## Expose agent using Ingress

TBD