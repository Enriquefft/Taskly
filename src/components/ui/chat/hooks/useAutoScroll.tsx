import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollState {
	isAtBottom: boolean;
	autoScrollEnabled: boolean;
}

interface UseAutoScrollOptions {
	offset?: number;
	smooth?: boolean;
	content?: React.ReactNode;
}

export function useAutoScroll(options: UseAutoScrollOptions = {}) {
	const { offset = 20, smooth = false } = options;
	const scrollRef = useRef<HTMLDivElement>(null);
	const lastContentHeight = useRef(0);
	const userHasScrolled = useRef(false);

	const [scrollState, setScrollState] = useState<ScrollState>({
		autoScrollEnabled: true,
		isAtBottom: true,
	});

	const checkIsAtBottom = useCallback(
		(element: HTMLElement) => {
			const { scrollTop, scrollHeight, clientHeight } = element;
			const distanceToBottom = Math.abs(
				scrollHeight - scrollTop - clientHeight,
			);
			return distanceToBottom <= offset;
		},
		[offset],
	);

	const scrollToBottom = useCallback(
		(instant?: boolean) => {
			if (!scrollRef.current) return;

			const targetScrollTop =
				scrollRef.current.scrollHeight - scrollRef.current.clientHeight;

			if (instant) {
				scrollRef.current.scrollTop = targetScrollTop;
			} else {
				scrollRef.current.scrollTo({
					behavior: smooth ? "smooth" : "auto",
					top: targetScrollTop,
				});
			}

			setScrollState({
				autoScrollEnabled: true,
				isAtBottom: true,
			});
			userHasScrolled.current = false;
		},
		[smooth],
	);

	const handleScroll = useCallback(() => {
		if (!scrollRef.current) return;

		const atBottom = checkIsAtBottom(scrollRef.current);

		setScrollState((prev) => ({
			autoScrollEnabled: atBottom ? true : prev.autoScrollEnabled,
			// Re-enable auto-scroll if at the bottom
			isAtBottom: atBottom,
		}));
	}, [checkIsAtBottom]);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		element.addEventListener("scroll", handleScroll, { passive: true });
		return () => element.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (!scrollElement) return;

		const currentHeight = scrollElement.scrollHeight;
		const hasNewContent = currentHeight !== lastContentHeight.current;

		if (hasNewContent) {
			if (scrollState.autoScrollEnabled) {
				requestAnimationFrame(() => {
					scrollToBottom(lastContentHeight.current === 0);
				});
			}
			lastContentHeight.current = currentHeight;
		}
	}, [scrollState.autoScrollEnabled, scrollToBottom]);

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		const resizeObserver = new ResizeObserver(() => {
			if (scrollState.autoScrollEnabled) {
				scrollToBottom(true);
			}
		});

		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [scrollState.autoScrollEnabled, scrollToBottom]);

	const disableAutoScroll = useCallback(() => {
		const atBottom = scrollRef.current
			? checkIsAtBottom(scrollRef.current)
			: false;

		// Only disable if not at bottom
		if (!atBottom) {
			userHasScrolled.current = true;
			setScrollState((prev) => ({
				...prev,
				autoScrollEnabled: false,
			}));
		}
	}, [checkIsAtBottom]);

	return {
		autoScrollEnabled: scrollState.autoScrollEnabled,
		disableAutoScroll,
		isAtBottom: scrollState.isAtBottom,
		scrollRef,
		scrollToBottom: () => scrollToBottom(false),
	};
}
