"server only";
import { google } from "@ai-sdk/google";

/**
 * Returns configured Gemini LLM client.
 */
export function getLLM() {
	return google("gemini-1.5-pro-latest");
}
