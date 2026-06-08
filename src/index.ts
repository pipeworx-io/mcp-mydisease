interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * MyDisease.info MCP.
 * Aggregated disease annotation from the BioThings ecosystem: MONDO/DOID/OMIM
 * ontology mappings, gene-disease associations (DisGeNET), phenotypes (HPO),
 * and chemical-disease relationships (CTD). Use to resolve disease names to
 * ontology ids and pull cross-referenced annotations.
 * Docs: https://docs.mydisease.info/en/latest/
 */


const BASE = 'https://mydisease.info/v1';
const UA = 'pipeworx-mcp-mydisease/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'query',
    description:
      'Search MyDisease.info for diseases by free-text name or fielded query. Returns matching hits, each keyed by a MONDO disease id (e.g. "MONDO:0015967") with the best-matching ontology and annotation keys. Use this to resolve a disease name to canonical ontology ids before calling the "disease" tool. Free text like "diabetes" or "asthma" works; fielded queries like "mondo.label:asthma" or "disgenet.xrefs.disease_name:..." narrow the search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Free-text disease name (e.g. "diabetes") or a fielded query (e.g. "mondo.label:asthma").',
        },
        fields: {
          type: 'string',
          description: 'Comma-separated list of annotation fields to return (default: all fields).',
        },
        size: {
          type: 'number',
          description: 'Number of hits to return, 1-1000 (default 10).',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'disease',
    description:
      'Fetch the full aggregated annotation object for a single disease id. Accepts MONDO ("MONDO:0015967"), DOID ("DOID:9351"), OMIM ("OMIM:125853") and other supported ontology ids. Returns cross-referenced data including MONDO ontology (labels, synonyms, xrefs, parents/children), gene-disease associations from DisGeNET, phenotypes from HPO, and chemical-disease relationships from CTD. Resolve a name to an id first via the "query" tool.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'A disease id such as "MONDO:0015967", "DOID:9351", or "OMIM:125853".',
        },
        fields: {
          type: 'string',
          description: 'Comma-separated list of annotation fields to return (default: all fields).',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'metadata',
    description: 'Dataset statistics and release metadata for MyDisease.info (source versions, document counts).',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  try {
    switch (name) {
      case 'query': {
        const p = new URLSearchParams({
          q: reqStr(args, 'query', '"diabetes"'),
          size: String(Math.min(1000, Math.max(1, (args.size as number) ?? 10))),
        });
        if (args.fields) p.set('fields', String(args.fields));
        const res = (await mGet(`/query?${p}`)) as { total?: number; hits?: unknown[] };
        return { total: res?.total ?? 0, hits: res?.hits ?? [] };
      }
      case 'disease': {
        const id = reqStr(args, 'id', '"MONDO:0015967"');
        const p = new URLSearchParams();
        if (args.fields) p.set('fields', String(args.fields));
        const qs = p.toString() ? `?${p}` : '';
        const res = await mGet(`/disease/${encodeURIComponent(id)}${qs}`);
        if (res === null || (typeof res === 'object' && (res as Record<string, unknown>).success === false)) {
          return { error: 'disease not found', id };
        }
        return res;
      }
      case 'metadata':
        return mGet('/metadata');
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

async function mGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`MyDisease: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
