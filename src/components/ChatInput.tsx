"use client";
import React, { useState } from "react";

interface ChatInputProps {
	onSend: (text: string) => Promise<void>;
	disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
	const [text, setText] = useState("");
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!text) return;
		await onSend(text);
		setText("");
	};
	return (
		<form onSubmit={handleSubmit} className="flex p-4 bg-white border-t">
			<input
				type="text"
				className="flex-1 border rounded px-3 py-2 mr-2"
				value={text}
				onChange={(e) => setText(e.target.value)}
				disabled={disabled}
				placeholder="Type your message..."
			/>
			<button
				type="submit"
				disabled={disabled || !text}
				className="bg-blue-600 text-white px-4 rounded"
			>
				Send
			</button>
		</form>
	);
}
