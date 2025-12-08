"use client";
import React, { createContext, useContext, useState } from "react";
import type { ChatMessage } from "../components/ChatMessage";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { streamAgentReply } from "@/actions/streamAgentReply";

interface ChatContextType {
	messages: ChatMessage[];
	sendMessage: (text: string) => Promise<void>;
	isStreaming: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
	children: React.ReactNode;
	// sendMessageAction: (
	// 	messages: ChatMessage[],
	// ) => Promise<AsyncGenerator<GenerateContentResponse>>;
}

export function ChatProvider({
	children,
	// sendMessageAction,
}: ChatProviderProps) {
	const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
		"n8n-chat",
		[],
	);
	const [isStreaming, setIsStreaming] = useState(false);

	async function sendMessage(text: string) {
		// Add the user message
		setMessages((msgs) => [...msgs, { content: text, role: "user" }]);

		// Kick off the streaming reply
		setIsStreaming(true);
		// Immediately insert an empty assistant message to update in place
		setMessages((msgs) => [
			...msgs,
			{ content: ".", role: "assistant" as const },
		]);

		console.log("Messages", [...messages, { content: text, role: "user" }]);

		// Calling action HERE
		const response = await streamAgentReply([
			...messages,
			{ content: text, role: "user" },
		]);

		console.log("Got response!!");

		setMessages((msgs) => {
			const updated = [...msgs];
			updated[updated.length - 1] = {
				content: response ?? "",
				role: "assistant",
			};
			return updated;
		});

		setIsStreaming(false);
	}

	return (
		<ChatContext.Provider value={{ isStreaming, messages, sendMessage }}>
			{children}
		</ChatContext.Provider>
	);
}

export function useChatContext() {
	const ctx = useContext(ChatContext);
	if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
	return ctx;
}
