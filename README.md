# mcp-mydisease

MyDisease.info MCP. Aggregated disease annotation from the BioThings ecosystem: MONDO/DOID/OMIM ontology mappings, gene-disease associations (DisGeNET), phenotypes (HPO), and chemical-disease relationships (CTD). Use to resolve disease names to ontology ids and pull cross-referenced annotations.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1856+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/mydisease/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1856+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/mydisease_query \
  -H 'Content-Type: application/json' \
  -d '{"query":"diabetes"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/mydisease_query`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-mydisease` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/mydisease/mcp` endpoint shown above. It needs network access;
there is no offline mode.

```json
{
  "mcpServers": {
    "mydisease": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-mydisease"]
    }
  }
}
```

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Mydisease data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
