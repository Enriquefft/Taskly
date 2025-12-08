import { useState } from "react";

/**
 * Tracks collected parameters map.
 */
export function useAgentState() {
	const [collected, setCollected] = useState<Record<string, any>>({});
	function update(key: string, value: any) {
		setCollected((prev) => ({ ...prev, [key]: value }));
	}
	return { collected, update };
}
