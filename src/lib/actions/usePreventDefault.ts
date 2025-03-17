export default function usePreventDefault(node: HTMLFormElement) {
	const handler = (event: Event) => {
		event.preventDefault();
	};

	node.addEventListener('submit', handler);

	return {
		destroy() {
			node.removeEventListener('submit', handler);
		}
	};
}
