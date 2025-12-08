import type { ChatMessage } from "@/components/ChatMessage";
import { extractWorkflowParams } from "../utils/extractWorkflowParams";
import { workflowTemplates } from "../utils/templates";

/**
 * Determines missing info or suggests a template start.
 */
export function needsMoreInfo(
	messages: ChatMessage[],
): { key: string; prompt: string }[] | null {
	const params = extractWorkflowParams(messages);
	if (params.length) return params;
	const hasUser = messages.some((m) => m.role === "user");
	const suggested = messages.find(
		(m) =>
			m.role === "assistant" &&
			m.content.includes("Would you like to start from a template?"),
	);
	if (hasUser && !suggested) {
		return [
			{
				key: "template",
				prompt: `Would you like to start from a template? Options: ${Object.keys(workflowTemplates).join(", ")}`,
			},
		];
	}
	return null;
}
