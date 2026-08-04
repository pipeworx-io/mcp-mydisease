# mcp-mydisease

MyDisease.info MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `query` | Search MyDisease.info for diseases by free-text name or fielded query. Returns matching hits, each keyed by a MONDO disease id (e.g. "MONDO:0015967") with the best-matching ontology and annotation keys. Use this to resolve a disease name to canonical ontology ids before calling the "disease" tool. Free text like "diabetes" or "asthma" works; fielded queries like "mondo.label:asthma" or "disgenet.xrefs.disease_name:..." narrow the search. |
| `disease` | Fetch the full aggregated annotation object for a single disease id. Accepts MONDO ("MONDO:0015967"), DOID ("DOID:9351"), OMIM ("OMIM:125853") and other supported ontology ids. Returns cross-referenced data including MONDO ontology (labels, synonyms, xrefs, parents/children), gene-disease associations from DisGeNET, phenotypes from HPO, and chemical-disease relationships from CTD. Resolve a name to an id first via the "query" tool. |
| `metadata` | Returns MyDisease.info build metadata: total disease document count, available annotation sources (MONDO, DOID, OMIM, DisGeNET, HPO, CTD), and their current release versions. |

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
