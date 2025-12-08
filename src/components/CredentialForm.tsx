import React, { useState } from "react";
import { z } from "zod";

const TokenSchema = z.string().min(1, "Cannot be empty");

interface CredentialFormProps {
	prompt: string;
	onSubmit: (value: string) => Promise<void>;
}

export function CredentialForm({ prompt, onSubmit }: CredentialFormProps) {
	const [value, setValue] = useState("");
	const [error, setError] = useState<string>();
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = TokenSchema.safeParse(value);
		if (!result.success) {
			setError(result.error.errors[0]?.message);
			return;
		}
		await onSubmit(value);
		setValue("");
		setError(undefined);
	};
	return (
		<form onSubmit={handleSubmit} className="p-4 bg-yellow-50 rounded">
			<p className="mb-2 font-semibold">{prompt}</p>
			<input
				type="password"
				className="w-full border px-2 py-1 rounded mb-2"
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			{error && <p className="text-red-600 mb-2">{error}</p>}
			<button
				type="submit"
				className="bg-green-600 text-white px-4 py-2 rounded"
			>
				Submit
			</button>
		</form>
	);
}
