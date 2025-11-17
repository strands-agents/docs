# Connecting Strands Agents to MCP Servers on AgentCore Runtime

## Overview

When deploying Strands agents to AgentCore Runtime alongside MCP servers, proper connection management is critical for performance and reliability. This guide establishes recommended patterns for maintaining efficient connections between agents and MCP servers within the same runtime environment.

## Architecture Patterns

### Persistent Connection Pattern (Recommended)

Use persistent connections to avoid the overhead of reinitializing for each request.

```python
from agentcore.mcp import MCPClient
from strands import Agent

class StrandsAgent(Agent):
    def __init__(self, config):
        super().__init__(config)
        self.mcp_connections = {}
        self._initialize_mcp_connections()
    
    def _initialize_mcp_connections(self):
        """Initialize MCP connections during agent startup"""
        for server_config in self.config.mcp_servers:
            client = MCPClient(f"agentcore://{server_config.name}")
            client.connect()
            self.mcp_connections[server_config.name] = {
                'client': client,
                'tools': client.list_tools()
            }
    
    async def execute_tool(self, server_name, tool_name, params):
        """Execute MCP tool using persistent connection"""
        connection = self.mcp_connections[server_name]
        return await connection['client'].call_tool(tool_name, params)
```

### Connection Pool for Multiple Servers

For agents connecting to multiple MCP servers:

```python
class MCPConnectionPool:
    def __init__(self):
        self.pool = {}
        self.max_connections = 10
    
    def get_client(self, server_name):
        if server_name not in self.pool:
            if len(self.pool) >= self.max_connections:
                raise ConnectionError("Max MCP connections exceeded")
            
            client = MCPClient(f"agentcore://{server_name}")
            client.connect()
            self.pool[server_name] = client
        
        return self.pool[server_name]
    
    def cleanup(self):
        for client in self.pool.values():
            client.disconnect()
        self.pool.clear()
```

## Service Discovery

### Automatic Discovery

AgentCore Runtime provides service discovery for MCP servers:

```python
from agentcore.discovery import ServiceRegistry

class AgentWithDiscovery(StrandsAgent):
    def __init__(self, config):
        super().__init__(config)
        self.registry = ServiceRegistry()
        self._discover_mcp_servers()
    
    def _discover_mcp_servers(self):
        """Discover available MCP servers in runtime"""
        servers = self.registry.find_services(service_type="mcp")
        for server in servers:
            self._connect_to_server(server.name, server.endpoint)
```

### Manual Configuration

For explicit server configuration:

```yaml
# agent-config.yaml
mcp_servers:
  - name: "file-operations"
    endpoint: "agentcore://file-ops-mcp"
    tools: ["read_file", "write_file", "list_directory"]
  - name: "web-scraper"
    endpoint: "agentcore://web-scraper-mcp"
    tools: ["fetch_url", "parse_html"]
```

## Connection Lifecycle Management

### Initialization

```python
async def initialize_agent():
    """Initialize agent with MCP connections"""
    agent = StrandsAgent(config)
    
    # Test all connections
    for server_name, connection in agent.mcp_connections.items():
        try:
            await connection['client'].ping()
        except ConnectionError:
            logger.error(f"Failed to connect to {server_name}")
            raise
    
    return agent
```

### Health Monitoring

```python
class HealthMonitor:
    def __init__(self, agent):
        self.agent = agent
        self.check_interval = 30  # seconds
    
    async def monitor_connections(self):
        """Monitor MCP connection health"""
        while True:
            for name, conn in self.agent.mcp_connections.items():
                try:
                    await conn['client'].ping()
                except ConnectionError:
                    logger.warning(f"Reconnecting to {name}")
                    await self._reconnect(name)
            
            await asyncio.sleep(self.check_interval)
    
    async def _reconnect(self, server_name):
        """Reconnect to failed MCP server"""
        old_conn = self.agent.mcp_connections[server_name]
        old_conn['client'].disconnect()
        
        client = MCPClient(f"agentcore://{server_name}")
        await client.connect()
        
        self.agent.mcp_connections[server_name] = {
            'client': client,
            'tools': await client.list_tools()
        }
```

### Cleanup

```python
async def shutdown_agent(agent):
    """Properly cleanup MCP connections"""
    for connection in agent.mcp_connections.values():
        connection['client'].disconnect()
    
    agent.mcp_connections.clear()
```

## Tool Management

### Dynamic Tool Discovery

```python
class DynamicToolManager:
    def __init__(self, mcp_connections):
        self.connections = mcp_connections
        self.tool_cache = {}
        self.cache_ttl = 300  # 5 minutes
    
    async def get_available_tools(self):
        """Get all available tools from MCP servers"""
        all_tools = {}
        
        for server_name, conn in self.connections.items():
            if self._cache_expired(server_name):
                tools = await conn['client'].list_tools()
                self.tool_cache[server_name] = {
                    'tools': tools,
                    'timestamp': time.time()
                }
            
            all_tools[server_name] = self.tool_cache[server_name]['tools']
        
        return all_tools
```

### Static Tool Registration

```python
# For performance-critical applications
STATIC_TOOL_REGISTRY = {
    'file-operations': ['read_file', 'write_file', 'delete_file'],
    'web-scraper': ['fetch_url', 'parse_html', 'extract_links'],
    'database': ['query', 'insert', 'update']
}

class StaticToolManager:
    def __init__(self, mcp_connections):
        self.connections = mcp_connections
        self.tools = STATIC_TOOL_REGISTRY
    
    def get_server_for_tool(self, tool_name):
        """Find which server provides a specific tool"""
        for server, tools in self.tools.items():
            if tool_name in tools:
                return server
        raise ToolNotFoundError(f"Tool {tool_name} not available")
```

## Error Handling

### Connection Resilience

```python
class ResilientMCPClient:
    def __init__(self, server_name, max_retries=3):
        self.server_name = server_name
        self.max_retries = max_retries
        self.client = None
        self._connect()
    
    def _connect(self):
        self.client = MCPClient(f"agentcore://{self.server_name}")
        self.client.connect()
    
    async def call_tool(self, tool_name, params):
        """Call tool with automatic retry on connection failure"""
        for attempt in range(self.max_retries):
            try:
                return await self.client.call_tool(tool_name, params)
            except ConnectionError:
                if attempt < self.max_retries - 1:
                    logger.warning(f"Retry {attempt + 1} for {self.server_name}")
                    self._connect()
                else:
                    raise
```

## Performance Optimization

### Connection Comparison

| Pattern | Initialization Time | Per-Request Overhead | Memory Usage |
|---------|-------------------|---------------------|--------------|
| Per-Request Init | ~2-3 seconds | High | Low |
| Persistent Connection | ~2-3 seconds (once) | Minimal | Medium |
| Connection Pool | ~5-10 seconds (once) | Minimal | High |

### Best Practices

1. **Use persistent connections** for single-server scenarios
2. **Implement connection pooling** for multi-server environments
3. **Cache tool listings** to avoid repeated discovery calls
4. **Monitor connection health** with periodic ping checks
5. **Implement graceful degradation** when MCP servers are unavailable

## Configuration Examples

### AgentCore Runtime Deployment

```yaml
# deployment.yaml
apiVersion: agentcore/v1
kind: AgentDeployment
metadata:
  name: strands-agent-with-mcp
spec:
  agent:
    image: strands-agent:latest
    config:
      mcp_servers:
        - name: file-ops
          service: file-operations-mcp
        - name: web-scraper
          service: web-scraper-mcp
  
  services:
    - name: file-operations-mcp
      image: mcp-file-server:latest
    - name: web-scraper-mcp
      image: mcp-web-server:latest
```

### Environment Variables

```bash
# Required for AgentCore MCP communication
AGENTCORE_MCP_DISCOVERY=true
AGENTCORE_SERVICE_REGISTRY=internal
MCP_CONNECTION_TIMEOUT=30
MCP_HEALTH_CHECK_INTERVAL=60
```

## Troubleshooting

### Common Issues

**Connection Timeouts**

- Increase `MCP_CONNECTION_TIMEOUT` environment variable
- Verify MCP server is running and accessible
- Check AgentCore service registry

**Tool Not Found Errors**

- Refresh tool cache with `client.list_tools()`
- Verify MCP server implements the required tool
- Check tool name spelling and parameters

**Memory Leaks**

- Ensure proper connection cleanup in shutdown handlers
- Monitor connection pool size limits
- Use weak references for cached tool listings

### Debug Logging

```python
import logging

logging.getLogger('agentcore.mcp').setLevel(logging.DEBUG)
logging.getLogger('strands.agent').setLevel(logging.DEBUG)
```

## Summary

This guide establishes the recommended patterns for efficient MCP server integration within AgentCore Runtime, eliminating the performance overhead of per-request initialization while maintaining reliability and scalability. By using persistent connections and proper lifecycle management, you can achieve optimal performance for your Strands agents running on AgentCore Runtime.
