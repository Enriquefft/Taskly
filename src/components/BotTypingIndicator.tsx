"use client";
import React from "react";

export function BotTypingIndicator() {
	return (
		<div className="flex space-x-1 p-2">
			<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
			<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
			<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></div>
		</div>
	);
}
