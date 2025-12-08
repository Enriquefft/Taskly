import Ajv from "ajv";
import type { ChatMessage } from "../components/ChatMessage";

// Example JSON‐schema snippets for common n8n node parameter requirements
const paramSchemas: Record<string, object> = {
	"n8n-nodes-base.emailSend": {
		properties: {
			subject: { type: "string" },
			to: { format: "email", type: "string" },
		},
		required: ["to"],
		type: "object",
	},
	"n8n-nodes-base.githubTrigger": {
		properties: {
			repository: { type: "string" },
			token: { type: "string" },
		},
		required: ["repository", "token"],
		type: "object",
	},
};

/**
 * Scans the **last** assistant message for a ```json … ``` block,
 * parses it, and runs each node’s parameters through AJV to spot
 * missing or invalid fields.
 */
export function extractWorkflowParams(
	messages: ChatMessage[],
): { key: string; prompt: string }[] {
	// 1. Find the last assistant message that contains a JSON code fence
	const last = [...messages].reverse().find((m) => m.role === "assistant");
	if (!last) return [];

	const match = last.content.match(/```json\s*([\s\S]+?)\s*```/);
	if (!match || !match[1]) return [];

	let wf: any;
	try {
		wf = JSON.parse(match[1]);
	} catch {
		return [];
	}

	// 2. Validate each node’s parameters against its schema
	const ajv = new Ajv({ allErrors: true, strict: false });
	const missing: { key: string; prompt: string }[] = [];

	for (const node of wf.nodes || []) {
		const schema = paramSchemas[node.type];
		if (!schema) continue;

		const validate = ajv.compile(schema);
		const data = node.parameters || {};
		const valid = validate(data);
		if (!valid && validate.errors) {
			for (const err of validate.errors) {
				const prop =
					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					err.instancePath.replace(/^\//, "") || err.params["missingProperty"];
				missing.push({
					key: `${node.name}.${prop}`,
					prompt: `⚠️ For the “${node.name}” step, please provide a valid **${prop}**.`,
				});
			}
		}
	}

	return missing;
}
