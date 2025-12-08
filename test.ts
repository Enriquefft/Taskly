import fs from "node:fs";
import path from "node:path";
import { AiWorkflowBuilderService } from "@n8n/ai-workflow-builder"; // Core service :contentReference[oaicite:11]{index=11}
import { AiAssistantClient } from "@n8n_io/ai-assistant-sdk"; // Optional AI client :contentReference[oaicite:13]{index=13}
import { Command } from "commander"; // CLI parsing :contentReference[oaicite:10]{index=10}
import type { INodeTypes } from "n8n-workflow"; // Workflow core types :contentReference[oaicite:14]{index=14}
import pino from "pino";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/** Load a text file from disk. */
function loadFile(filePath: string): string {
	return fs.readFileSync(path.resolve(filePath), "utf8");
}

/** Dummy user context; replace with real user info in production. */
const DEFAULT_USER = { email: "cli@n8n.io", id: "cli-user" };

class DummyLicenseService implements ILicenseService {
	/** Return an empty (or dummy) PEM—EE-only features will be disabled. */
	async loadCertStr(): Promise<string> {
		return "";
	}
	/** Return a no-op Consumer ID */
	getConsumerId(): string {
		return "";
	}
}

// Then wire it in:
const licenseService = new DummyLicenseService();

/**
 * Initialize the AiWorkflowBuilderService.
 * @param baseUrl Optional AI service base URL.
 * @param licenseCertStr License certificate PEM string.
 * @param consumerId License consumer identifier.
 */
async function initBuilder(
	baseUrl?: string,
	licenseCertStr?: string,
	consumerId?: string,
) {
	const logger = pino({ name: "ai-workflow-cli" });
	let aiClient: AiAssistantClient | undefined;

	if (baseUrl && licenseCertStr && consumerId) {
		aiClient = new AiAssistantClient({
			baseUrl,
			consumerId,
			licenseCert: licenseCertStr,
			n8nVersion: "0.2.0",
		});
	}

	return new AiWorkflowBuilderService(
		licenseService,
		nodeTypes,
		aiClient,
		logger,
	);
}

// -----------------------------------------------------------------------------
// CLI Definition
// -----------------------------------------------------------------------------

const program = new Command();

program
	.name("ai-workflow-cli")
	.description("CLI for @n8n/ai-workflow-builder v0.2.0") // Version from npm :contentReference[oaicite:15]{index=15}
	.version("0.2.0");

program
	.option("--base-url <url>", "AI Assistant base URL")
	.option("--cert <path>", "Path to license certificate (PEM)")
	.option("--consumer-id <id>", "License consumer ID");

/**
 * `chat` subcommand: Prompt the AI workflow builder.
 */
program
	.command("chat <message>")
	.description(
		"Generate or continue an AI workflow from a plain-English prompt",
	)
	.option("-w, --workflow-id <workflowId>", "Existing workflow ID")
	.action(async (message: string, opts: { workflowId?: string }) => {
		const { baseUrl, cert, consumerId } = program.opts();
		const licenseCertStr = cert ? loadFile(cert) : undefined;
		const builder = await initBuilder(baseUrl, licenseCertStr, consumerId);

		const payload: ChatPayload = {
			message,
			workflowId: opts.workflowId,
		};

		console.log(`\n🤖 AI Workflow Builder Response:\n`);
		for await (const step of builder.chat(payload, DEFAULT_USER)) {
			console.log("→", step.text);
		}
	});

/**
 * `sessions` subcommand: List chat sessions.
 */
program
	.command("sessions")
	.description("List chat sessions for a workflow")
	.option("-w, --workflow-id <workflowId>", "Workflow ID (optional)")
	.action(async (opts: { workflowId?: string }) => {
		const { baseUrl, cert, consumerId } = program.opts();
		const licenseCertStr = cert ? loadFile(cert) : undefined;
		const builder = await initBuilder(baseUrl, licenseCertStr, consumerId);

		const sessions = await builder.getSessions(opts.workflowId, DEFAULT_USER);
		console.log(JSON.stringify(sessions, null, 2));
	});

// Parse CLI args
program.parse(process.argv);
