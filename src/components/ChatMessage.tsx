"use client";
import React from "react";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
	role: ChatRole;
	content: string;
}

export function ChatMessage({ role, content }: ChatMessage) {
	const isUser = role === "user";
	return (
		<div className={`${isUser ? "justify-end" : "justify-start"} flex`}>
			<div
				className={`${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"} max-w-md p-2 rounded-2xl`}
			>
				{content}
			</div>
		</div>
	);
}
