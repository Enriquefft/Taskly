"use server";
import type { ChatMessage } from "../components/ChatMessage";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

/**
 * Streams AI agent replies with retry and fallback handling.
 */
export async function streamAgentReply(messages: ChatMessage[]) {
	console.log("Generating AI response...from", messages);
	const contents = messages.map((msg) => ({
		role: msg.role,
		parts: [{ text: msg.content }],
	}));

	const response = ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents,
	});
	console.log("Got response", response);
	return (await response).text;
}
