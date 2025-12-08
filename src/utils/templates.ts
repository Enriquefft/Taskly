/**
 * Pre‐built “skeleton” workflows for common scenarios.
 * Users can choose one to shortcut the chat Q&A.
 */
export const workflowTemplates = {
	githubEmail: {
		connections: {
			"GitHub Trigger": [
				{
					index: 0,
					node: "Send Email",
					type: "main",
				},
			],
		},
		name: "GitHub to Email",
		nodes: [
			{
				name: "GitHub Trigger",
				parameters: {
					repository: "", // will be filled by user
					token: "", // will be filled by user
				},
				type: "n8n-nodes-base.githubTrigger",
			},
			{
				name: "Send Email",
				parameters: {
					subject: "New GitHub Issue", // will be filled by user
					to: "",
				},
				type: "n8n-nodes-base.emailSend",
			},
		],
	},
	// add more templates here as needed...
} as const;

export type TemplateKey = keyof typeof workflowTemplates;
