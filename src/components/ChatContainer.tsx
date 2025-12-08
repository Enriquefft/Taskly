"use client";
import React from "react";
import { useChatContext } from "../context/ChatContext";
import { BotTypingIndicator } from "./BotTypingIndicator";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatContainer() {
	const { messages, sendMessage, isStreaming } = useChatContext();
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto p-4 space-y-2">
				{messages.map((msg, idx) => (
					<ChatMessage
						key={idx.toString()}
						role={msg.role}
						content={msg.content}
					/>
				))}
				{isStreaming && <BotTypingIndicator />}
			</div>
			<ChatInput onSend={sendMessage} disabled={isStreaming} />
		</div>
	);
}
