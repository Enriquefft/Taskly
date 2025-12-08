/**
 * Analyzes partial workflow JSON for credential placeholders.
 */
export function analyzeWorkflowJSON(
	json: any,
): { key: string; prompt: string }[] {
	const missing: { key: string; prompt: string }[] = [];
	if (!json.nodes) return missing;
	json.nodes.forEach((node: any) => {
		if (node.credentials) {
			Object.keys(node.credentials).forEach((credType) => {
				missing.push({
					key: credType,
					prompt: `Please provide your ${credType} credentials. See https://docs.n8n.io/#credentials for guidance.`,
				});
			});
		}
	});
	return missing;
}
