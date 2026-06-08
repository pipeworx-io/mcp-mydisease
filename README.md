# mcp-mydisease

MyDisease.info MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 784+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `metadata` | Dataset statistics and release metadata for MyDisease.info (source versions, document counts). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mydisease": {
      "url": "https://gateway.pipeworx.io/mydisease/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 784+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Mydisease data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
