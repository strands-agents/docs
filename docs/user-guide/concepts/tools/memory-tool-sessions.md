# Memory Tool Session Management

The memory tool provides comprehensive boto3 session injection capabilities that enable flexible AWS authentication patterns for accessing Amazon Bedrock Knowledge Bases. This guide covers how to use custom boto3 sessions for authentication, cross-account access, and advanced session management scenarios.

## Overview

Session injection allows you to provide custom AWS credentials and configuration to the memory tool, enabling:

- **Custom Authentication**: Use specific AWS profiles, credentials, or IAM roles
- **Cross-Account Access**: Access Knowledge Bases in different AWS accounts
- **Multi-Session Management**: Manage multiple AWS sessions simultaneously
- **Flexible Configuration**: Override default AWS credential chain behavior

The memory tool uses a global session store to manage boto3 sessions, allowing you to configure authentication once and use it across multiple memory operations.

## Session Management Functions

## set_memory_session()

Store a boto3 session for use by the memory tool.

```python
from strands_tools.memory import set_memory_session
import boto3
from typing import Optional

def set_memory_session(session: Optional[boto3.Session] = None, key: str = "default") -> None:
    """Store a boto3 session for use by the memory tool."""
    pass  # Implementation handled by the actual function
```

**Parameters:**
- `session` (Optional[boto3.Session]): The boto3 Session to store. If None, removes the stored session for the given key.
- `key` (str): Optional key to store multiple sessions. Defaults to "default".

**Usage:**
```python
import boto3
from strands_tools.memory import set_memory_session

# Store a session with custom profile
session = boto3.Session(profile_name="my-profile")
set_memory_session(session)

# Store multiple sessions with different keys
prod_session = boto3.Session(profile_name="production")
dev_session = boto3.Session(profile_name="development")

set_memory_session(prod_session, key="production")
set_memory_session(dev_session, key="development")
```

## get_memory_session()

Retrieve a stored boto3 session.

```python
from strands_tools.memory import get_memory_session
import boto3
from typing import Optional

def get_memory_session(key: str = "default") -> Optional[boto3.Session]:
    """Retrieve a stored boto3 session."""
    pass  # Implementation handled by the actual function
```

**Parameters:**
- `key` (str): The key used to store the session. Defaults to "default".

**Returns:**
- The stored boto3 Session or None if no session is found for the key.

**Usage:**
```python
from strands_tools.memory import get_memory_session

# Retrieve the default session
session = get_memory_session()

# Retrieve a specific session by key
prod_session = get_memory_session("production")
```

## Authentication Patterns

## Default Session Usage

When no custom session is provided, the memory tool uses the default AWS credential chain:

```python
from strands import Agent
from strands_tools.memory import memory

agent = Agent(tools=[memory])

# Uses default AWS credential chain (environment variables, IAM roles, etc.)
result = agent.tool.memory(
    action="store",
    content="Important meeting notes from today's discussion",
    title="Team Meeting Notes",
    STRANDS_KNOWLEDGE_BASE_ID="myknowledgebase123"
)

print(f"Stored document: {result}")
# Output: {'status': 'success', 'content': [{'text': '✅ Successfully stored content...'}]}

# Retrieve the stored content
search_result = agent.tool.memory(
    action="retrieve",
    query="meeting notes",
    min_score=0.7,
    STRANDS_KNOWLEDGE_BASE_ID="myknowledgebase123"
)

print(f"Retrieved content: {search_result}")
```

## Custom Session with AWS Profile

Use a specific AWS profile configured in your credentials file:

```python
import boto3
from strands import Agent
from strands_tools.memory import memory, set_memory_session

# Create session with specific profile
session = boto3.Session(profile_name="my-company-profile")
set_memory_session(session)

agent = Agent(tools=[memory])

# Memory tool will now use the custom session
result = agent.tool.memory(
    action="store",
    content="Project status update for Q4 2024. All milestones on track.",
    title="Weekly Status",
    STRANDS_KNOWLEDGE_BASE_ID="projectkb456"
)

print(f"Store result: {result['status']}")
# Output: success

# List all documents to verify storage
list_result = agent.tool.memory(
    action="list",
    max_results=10,
    STRANDS_KNOWLEDGE_BASE_ID="projectkb456"
)

print(f"Found {len(list_result['content'])} documents")

# Example with region-specific profile
regional_session = boto3.Session(
    profile_name="eu-profile",
    region_name="eu-west-1"
)
set_memory_session(regional_session, key="europe")

# Use the European session for compliance requirements
eu_result = agent.tool.memory(
    action="store",
    content="GDPR compliant customer data summary",
    title="EU Customer Data",
    session_key="europe",
    STRANDS_KNOWLEDGE_BASE_ID="eukb789"
)
```

## Cross-Account Access

Access Knowledge Bases in different AWS accounts using explicit credentials:

```python
import boto3
import os
from strands import Agent
from strands_tools.memory import memory, set_memory_session

# Method 1: Using environment variables for cross-account credentials
cross_account_session = boto3.Session(
    aws_access_key_id=os.getenv("CROSS_ACCOUNT_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("CROSS_ACCOUNT_SECRET_KEY"),
    region_name="us-east-1"
)

set_memory_session(cross_account_session, key="customer-account")

agent = Agent(tools=[memory])

# Store data in customer's Knowledge Base
store_result = agent.tool.memory(
    action="store",
    content="Customer support ticket #12345: Issue resolved successfully",
    title="Support Ticket Resolution",
    session_key="customer-account",
    STRANDS_KNOWLEDGE_BASE_ID="customerkb789"
)

print(f"Cross-account store: {store_result['status']}")

# Retrieve customer feedback from their Knowledge Base
feedback_result = agent.tool.memory(
    action="retrieve",
    query="customer feedback satisfaction",
    min_score=0.6,
    max_results=5,
    session_key="customer-account",
    STRANDS_KNOWLEDGE_BASE_ID="customerkb789"
)

print(f"Found {len(feedback_result['content'])} feedback entries")

# Method 2: Using STS assume role for temporary cross-account access
def create_cross_account_session(role_arn: str, external_id: str = None):
    sts_client = boto3.client('sts')
    
    assume_role_params = {
        'RoleArn': role_arn,
        'RoleSessionName': 'memory-tool-cross-account'
    }
    
    if external_id:
        assume_role_params['ExternalId'] = external_id
    
    response = sts_client.assume_role(**assume_role_params)
    credentials = response['Credentials']
    
    return boto3.Session(
        aws_access_key_id=credentials['AccessKeyId'],
        aws_secret_access_key=credentials['SecretAccessKey'],
        aws_session_token=credentials['SessionToken'],
        region_name="us-east-1"
    )

# Assume role in customer account
customer_session = create_cross_account_session(
    role_arn="arn:aws:iam::123456789012:role/CustomerKnowledgeBaseAccess",
    external_id="unique-external-id-123"
)

set_memory_session(customer_session, key="customer-assumed-role")

# Use the assumed role session
assumed_result = agent.tool.memory(
    action="list",
    max_results=20,
    session_key="customer-assumed-role",
    STRANDS_KNOWLEDGE_BASE_ID="customerkb789"
)

print(f"Documents in customer KB: {len(assumed_result['content'])}")
```

## Multiple Session Management

Manage multiple AWS sessions for different environments or accounts:

```python
import boto3
from strands import Agent
from strands_tools.memory import memory, set_memory_session, get_memory_session

# Set up multiple sessions for different environments
production_session = boto3.Session(
    profile_name="prod-profile",
    region_name="us-east-1"
)
staging_session = boto3.Session(
    profile_name="staging-profile", 
    region_name="us-west-2"
)
development_session = boto3.Session(
    profile_name="dev-profile",
    region_name="us-west-2"
)

# Store sessions with descriptive keys
set_memory_session(production_session, key="production")
set_memory_session(staging_session, key="staging")
set_memory_session(development_session, key="development")

agent = Agent(tools=[memory])

# Production workflow: Store critical business data
prod_result = agent.tool.memory(
    action="store",
    content="Production deployment completed successfully. Version 2.1.0 deployed at 2024-01-15 14:30 UTC. All health checks passing.",
    title="Production Deployment Log",
    session_key="production",
    STRANDS_KNOWLEDGE_BASE_ID="prodkb123"
)

print(f"Production store: {prod_result['status']}")

# Staging workflow: Store and retrieve test results
staging_store = agent.tool.memory(
    action="store",
    content="Integration tests completed. 95% pass rate. 2 failing tests related to timeout handling.",
    title="Integration Test Results",
    session_key="staging",
    STRANDS_KNOWLEDGE_BASE_ID="stagingkb456"
)

staging_retrieve = agent.tool.memory(
    action="retrieve",
    query="test results timeout",
    min_score=0.5,
    session_key="staging",
    STRANDS_KNOWLEDGE_BASE_ID="stagingkb456"
)

print(f"Found {len(staging_retrieve['content'])} staging test results")

# Development workflow: Experimental features
dev_result = agent.tool.memory(
    action="store",
    content="New feature branch: user-authentication. Implemented OAuth2 flow with JWT tokens. Ready for code review.",
    title="Feature Development Notes",
    session_key="development",
    STRANDS_KNOWLEDGE_BASE_ID="devkb789"
)

# Cross-environment data analysis
def analyze_across_environments():
    environments = ["production", "staging", "development"]
    kb_ids = ["prodkb123", "stagingkb456", "devkb789"]
    
    for env, kb_id in zip(environments, kb_ids):
        if get_memory_session(env):
            result = agent.tool.memory(
                action="list",
                max_results=5,
                session_key=env,
                STRANDS_KNOWLEDGE_BASE_ID=kb_id
            )
            print(f"{env.capitalize()}: {len(result['content'])} documents")
        else:
            print(f"Warning: No session found for {env}")

analyze_across_environments()

# Session cleanup for temporary operations
def cleanup_temporary_sessions():
    temp_keys = ["temp-migration", "temp-backup", "temp-analysis"]
    for key in temp_keys:
        set_memory_session(None, key=key)  # Remove session
        print(f"Cleaned up session: {key}")

# Example: Multi-region session management
regions = ["us-east-1", "us-west-2", "eu-west-1"]
for region in regions:
    regional_session = boto3.Session(
        profile_name="multi-region-profile",
        region_name=region
    )
    set_memory_session(regional_session, key=f"region-{region}")

# Use region-specific sessions for compliance
eu_result = agent.tool.memory(
    action="store",
    content="EU customer data processed according to GDPR requirements",
    title="GDPR Compliance Log",
    session_key="region-eu-west-1",
    STRANDS_KNOWLEDGE_BASE_ID="eukb123"
)

us_result = agent.tool.memory(
    action="retrieve",
    query="customer preferences",
    session_key="region-us-east-1",
    STRANDS_KNOWLEDGE_BASE_ID="uskb456"
)

print(f"EU compliance store: {eu_result['status']}")
print(f"US data retrieval: {len(us_result['content'])} results")
```

## Use Cases

### When to Use Session Injection

**Multi-Environment Deployments**
- Access Knowledge Bases across development, staging, and production environments
- Each environment uses different AWS accounts or regions
- Maintain separate credentials for different deployment stages
- Enable environment-specific data isolation and access controls

**Cross-Account Data Access**
- Access customer data stored in separate AWS accounts
- Implement data segregation while maintaining centralized agent logic
- Support multi-tenant architectures with account-level isolation
- Enable partner integrations with controlled access to specific resources

**Role-Based Access Control**
- Use different IAM roles for different types of operations (read-only vs. read-write)
- Implement least-privilege access patterns for security compliance
- Separate administrative operations from regular user operations
- Support fine-grained permissions based on user roles or contexts

**Regional Data Compliance**
- Access Knowledge Bases in specific regions for data residency requirements
- Route requests to region-specific resources for GDPR, CCPA, or other compliance needs
- Implement geo-fencing for sensitive data access
- Support multi-region disaster recovery scenarios

**Service Account Management**
- Use dedicated service accounts for automated processes
- Separate human user credentials from application credentials
- Implement credential rotation without affecting running applications
- Support CI/CD pipelines with dedicated deployment credentials

**Temporary Access Scenarios**
- Provide time-limited access to specific resources
- Support maintenance operations with elevated privileges
- Enable emergency access patterns with proper audit trails
- Implement break-glass access for critical situations

**Development and Testing**
- Use different credentials for local development vs. CI/CD environments
- Support integration testing with isolated test data
- Enable developers to work with personal AWS accounts
- Facilitate debugging with specific credential contexts

### Integration with Existing AWS Infrastructure

Session injection integrates seamlessly with existing AWS authentication patterns:

```python
import boto3
from strands import Agent
from strands_tools.memory import memory, set_memory_session

# Use existing STS assume role pattern
def assume_role_session(role_arn: str, session_name: str) -> boto3.Session:
    sts_client = boto3.client('sts')
    response = sts_client.assume_role(
        RoleArn=role_arn,
        RoleSessionName=session_name
    )
    
    credentials = response['Credentials']
    return boto3.Session(
        aws_access_key_id=credentials['AccessKeyId'],
        aws_secret_access_key=credentials['SecretAccessKey'],
        aws_session_token=credentials['SessionToken']
    )

# Assume role for cross-account access
cross_account_session = assume_role_session(
    role_arn="arn:aws:iam::123456789012:role/KnowledgeBaseAccessRole",
    session_name="memory-tool-session"
)

set_memory_session(cross_account_session, key="customer-account")

agent = Agent(tools=[memory])

# Use the assumed role session
result = agent.tool.memory(
    action="list",
    session_key="customer-account",
    STRANDS_KNOWLEDGE_BASE_ID="customerkb"
)
```

## Best Practices

### Session Lifecycle Management

**Session Storage**
- Store sessions at application startup or when needed
- Use descriptive keys that reflect the session's purpose
- Clean up unused sessions to prevent memory leaks

```python
from strands_tools.memory import set_memory_session

# Good: Descriptive session keys
set_memory_session(prod_session, key="production-us-east-1")
set_memory_session(dev_session, key="development-us-west-2")

# Clean up when done
set_memory_session(None, key="temporary-session")  # Removes the session
```

**Session Validation**
- Verify session credentials before storing
- Handle expired credentials gracefully
- Implement session refresh patterns for long-running applications

```python
import boto3
from botocore.exceptions import ClientError
from strands_tools.memory import set_memory_session

def validate_and_store_session(session: boto3.Session, key: str) -> bool:
    try:
        # Test the session by making a simple AWS call
        sts = session.client('sts')
        sts.get_caller_identity()
        
        # Session is valid, store it
        set_memory_session(session, key=key)
        return True
    except ClientError as e:
        print(f"Session validation failed: {e}")
        return False

# Validate before storing
if validate_and_store_session(my_session, "validated-session"):
    print("Session stored successfully")
else:
    print("Session validation failed")
```

## Error Handling

**Session Not Found**
- Handle cases where a requested session key doesn't exist
- Provide fallback to default session or clear error messages

```python
from strands import Agent
from strands_tools.memory import memory, get_memory_session

agent = Agent(tools=[memory])

# Check if session exists before using
session_key = "production"
if get_memory_session(session_key) is None:
    print(f"Warning: Session '{session_key}' not found, using default")
    session_key = "default"

result = agent.tool.memory(
    action="retrieve",
    query="search term",
    session_key=session_key,
    STRANDS_KNOWLEDGE_BASE_ID="kb123"
)
```

**Authentication Failures**
- Implement retry logic for temporary authentication failures
- Log authentication errors for debugging
- Provide clear error messages for credential issues

## Security Considerations

**Credential Management**
- Never hardcode AWS credentials in source code
- Use environment variables, AWS profiles, or IAM roles
- Implement credential rotation for long-running applications

```python
import os
import boto3
from strands_tools.memory import set_memory_session

# Good: Use environment variables
session = boto3.Session(
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-west-2')
)

# Better: Use IAM roles or AWS profiles when possible
session = boto3.Session(profile_name=os.getenv('AWS_PROFILE', 'default'))
```

**Session Isolation**
- Use unique session keys for different purposes
- Avoid sharing sessions between unrelated operations
- Implement proper access controls for session management

```python
# Good: Separate sessions for different purposes
set_memory_session(read_only_session, key="readonly-operations")
set_memory_session(admin_session, key="admin-operations")

# Bad: Sharing high-privilege session for all operations
# set_memory_session(admin_session, key="default")  # Don't do this
```

**Credential Rotation and Expiration**
- Implement automatic credential refresh for long-running applications
- Monitor session token expiration times
- Handle credential rotation gracefully without service interruption

```python
import boto3
from datetime import datetime, timezone
from strands_tools.memory import set_memory_session, get_memory_session

def refresh_session_if_needed(session_key: str, role_arn: str):
    """Refresh session if it's close to expiration"""
    session = get_memory_session(session_key)
    
    if session and hasattr(session, '_session'):
        # Check if session token is close to expiration (within 15 minutes)
        credentials = session.get_credentials()
        if credentials.token:
            # For assumed role sessions, refresh proactively
            sts_client = boto3.client('sts')
            response = sts_client.assume_role(
                RoleArn=role_arn,
                RoleSessionName=f'refreshed-{session_key}'
            )
            
            new_session = boto3.Session(
                aws_access_key_id=response['Credentials']['AccessKeyId'],
                aws_secret_access_key=response['Credentials']['SecretAccessKey'],
                aws_session_token=response['Credentials']['SessionToken']
            )
            
            set_memory_session(new_session, key=session_key)
            print(f"Refreshed session: {session_key}")

# Use in long-running applications
refresh_session_if_needed("production", "arn:aws:iam::123456789012:role/ProductionRole")
```

**Audit and Logging**
- Log session usage for security auditing
- Monitor cross-account access patterns
- Implement alerting for unusual authentication patterns

```python
import logging
from strands_tools.memory import set_memory_session, get_memory_session

# Configure audit logging
audit_logger = logging.getLogger('memory_tool_audit')
audit_logger.setLevel(logging.INFO)

def audit_session_usage(session_key: str, action: str, kb_id: str):
    """Log session usage for audit purposes"""
    session = get_memory_session(session_key)
    if session:
        try:
            sts = session.client('sts')
            identity = sts.get_caller_identity()
            audit_logger.info(
                f"Session usage - Key: {session_key}, Action: {action}, "
                f"KB: {kb_id}, Account: {identity['Account']}, "
                f"User: {identity.get('Arn', 'Unknown')}"
            )
        except Exception as e:
            audit_logger.warning(f"Failed to audit session {session_key}: {e}")

# Use before memory operations
audit_session_usage("production", "store", "prodkb123")
```

**Least Privilege Access**
- Grant minimum necessary permissions for each session
- Use separate sessions for different permission levels
- Regularly review and audit session permissions

```python
# Example IAM policy for read-only memory tool access
readonly_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:Retrieve",
                "bedrock:ListKnowledgeBases",
                "bedrock:GetKnowledgeBase"
            ],
            "Resource": "arn:aws:bedrock:*:*:knowledge-base/specific-kb-id"
        }
    ]
}

# Example IAM policy for full memory tool access
full_access_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:*"
            ],
            "Resource": "arn:aws:bedrock:*:*:knowledge-base/specific-kb-id"
        }
    ]
}
```

## Troubleshooting

### Common Issues

**Session Key Not Found**
```text
Error: Session key 'production' not found
```
**Solution:** Verify the session was stored with the correct key:
```python
from strands_tools.memory import set_memory_session, get_memory_session

# Store session
set_memory_session(my_session, key="production")

# Verify it was stored
if get_memory_session("production") is not None:
    print("Session stored successfully")
```

**Invalid Credentials**
```text
Error: The security token included in the request is invalid
```
**Solution:** Check credential validity and refresh if needed:
```python
import boto3
from botocore.exceptions import ClientError

try:
    session = boto3.Session(profile_name="my-profile")
    sts = session.client('sts')
    identity = sts.get_caller_identity()
    print(f"Using credentials for: {identity['Arn']}")
except ClientError as e:
    print(f"Credential validation failed: {e}")
```

**Region Mismatch**
```text
Error: Knowledge Base not found in specified region
```
**Solution:** Ensure session region matches Knowledge Base region:
```python
session = boto3.Session(
    profile_name="my-profile",
    region_name="us-east-1"  # Match Knowledge Base region
)
```

**Cross-Account Access Denied**
```text
Error: User is not authorized to perform: bedrock:Retrieve
```
**Solution:** Verify IAM permissions and trust relationships:
- Ensure the IAM role/user has necessary Bedrock permissions
- Check Knowledge Base resource policies
- Verify cross-account trust relationships are configured

```python
# Check current permissions
import boto3
from strands_tools.memory import get_memory_session

def check_bedrock_permissions(session_key: str = "default"):
    session = get_memory_session(session_key)
    if not session:
        print(f"No session found for key: {session_key}")
        return
    
    try:
        bedrock_agent = session.client('bedrock-agent')
        # Try to list knowledge bases to test permissions
        response = bedrock_agent.list_knowledge_bases(maxResults=1)
        print("✅ Bedrock permissions verified")
        return True
    except Exception as e:
        print(f"❌ Bedrock permission check failed: {e}")
        return False

check_bedrock_permissions("production")
```

**Session Token Expired**
```text
Error: The provided token has expired
```
**Solution:** Refresh expired session tokens:
```python
import boto3
from botocore.exceptions import ClientError
from strands_tools.memory import set_memory_session, get_memory_session

def handle_expired_session(session_key: str, role_arn: str = None):
    """Handle expired session by refreshing credentials"""
    try:
        if role_arn:
            # Refresh using assume role
            sts_client = boto3.client('sts')
            response = sts_client.assume_role(
                RoleArn=role_arn,
                RoleSessionName=f'refreshed-{session_key}'
            )
            
            new_session = boto3.Session(
                aws_access_key_id=response['Credentials']['AccessKeyId'],
                aws_secret_access_key=response['Credentials']['SecretAccessKey'],
                aws_session_token=response['Credentials']['SessionToken']
            )
            
            set_memory_session(new_session, key=session_key)
            print(f"✅ Session {session_key} refreshed successfully")
        else:
            print(f"❌ Cannot refresh session {session_key} without role ARN")
            
    except ClientError as e:
        print(f"❌ Failed to refresh session {session_key}: {e}")

# Usage
handle_expired_session("production", "arn:aws:iam::123456789012:role/ProductionRole")
```

**Knowledge Base Not Found**
```text
Error: Knowledge base with ID 'kb123' not found
```
**Solution:** Verify Knowledge Base ID and region:
```python
def verify_knowledge_base(kb_id: str, session_key: str = "default"):
    """Verify Knowledge Base exists and is accessible"""
    from strands_tools.memory import get_memory_session
    
    session = get_memory_session(session_key)
    if not session:
        print(f"No session found for key: {session_key}")
        return False
    
    try:
        bedrock_agent = session.client('bedrock-agent')
        response = bedrock_agent.get_knowledge_base(knowledgeBaseId=kb_id)
        kb_info = response['knowledgeBase']
        print(f"✅ Knowledge Base found: {kb_info['name']}")
        print(f"   Status: {kb_info['status']}")
        print(f"   Region: {session.region_name}")
        return True
    except Exception as e:
        print(f"❌ Knowledge Base verification failed: {e}")
        return False

verify_knowledge_base("kb123", "production")
```

**Network Connectivity Issues**
```text
Error: Unable to locate credentials
Error: Connection timeout
```
**Solution:** Check network connectivity and credential sources:
```python
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

def diagnose_connectivity_issues(session_key: str = "default"):
    """Diagnose common connectivity and credential issues"""
    from strands_tools.memory import get_memory_session
    
    print(f"Diagnosing session: {session_key}")
    
    # Check if session exists
    session = get_memory_session(session_key)
    if not session:
        print("❌ Session not found in memory store")
        return False
    
    try:
        # Test basic AWS connectivity
        sts = session.client('sts')
        identity = sts.get_caller_identity()
        print(f"✅ AWS connectivity: Account {identity['Account']}")
        
        # Test region configuration
        print(f"✅ Session region: {session.region_name}")
        
        # Test Bedrock service availability
        bedrock = session.client('bedrock-agent')
        print("✅ Bedrock service client created")
        
        return True
        
    except NoCredentialsError:
        print("❌ No AWS credentials found")
        print("   Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY")
        print("   Or configure AWS profile with 'aws configure'")
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'UnauthorizedOperation':
            print("❌ Insufficient permissions")
        elif error_code == 'InvalidUserID.NotFound':
            print("❌ Invalid AWS credentials")
        else:
            print(f"❌ AWS API error: {error_code}")
            
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        
    return False

diagnose_connectivity_issues("production")
```

## Debugging Session Issues

**Check Current Session**
```python
from strands_tools.memory import get_memory_session

session = get_memory_session("my-key")
if session:
    sts = session.client('sts')
    identity = sts.get_caller_identity()
    print(f"Session identity: {identity}")
    print(f"Session region: {session.region_name}")
else:
    print("No session found for key 'my-key'")
```

**Test Session Connectivity**
```python
def test_session_connectivity(session_key: str = "default"):
    from strands_tools.memory import get_memory_session
    
    session = get_memory_session(session_key)
    if not session:
        print(f"No session found for key: {session_key}")
        return False
    
    try:
        # Test basic AWS connectivity
        sts = session.client('sts')
        identity = sts.get_caller_identity()
        print(f"✅ Session valid - Account: {identity['Account']}")
        
        # Test Bedrock access
        bedrock = session.client('bedrock-agent')
        # This will fail if no permissions, but that's expected
        print("✅ Bedrock client created successfully")
        return True
        
    except Exception as e:
        print(f"❌ Session test failed: {e}")
        return False

# Test the default session
test_session_connectivity()

# Test a specific session
test_session_connectivity("production")
```

## Related Documentation

- [Memory Tool Overview](example-tools-package.md#rag--memory)
- [Amazon Bedrock Model Provider](../model-providers/amazon-bedrock.md)
- [Memory Agent Example](../../../examples/python/memory_agent.md)
- [AWS boto3 Session Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html)
- [AWS Credential Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)