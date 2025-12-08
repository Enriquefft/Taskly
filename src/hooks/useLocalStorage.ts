import { useEffect, useState } from "react";

/**
 * Hook for persisting state to localStorage.
 */
export function useLocalStorage<T>(key: string, initial: T) {
	const [state, setState] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initial;
		} catch {
			return initial;
		}
	});
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);
	return [state, setState] as const;
}
