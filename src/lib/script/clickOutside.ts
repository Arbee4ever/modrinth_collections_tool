export function clickOutside(element: HTMLDivElement, callbackFunction: { (): void; (): void }) {
	function onClick(event: { target: Node }) {
		if (!element.contains(event.target)) {
			callbackFunction();
		}
	}

	document.body.addEventListener('click', onClick);

	return {
		update(newCallbackFunction: { (): void; (): void }) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		}
	};
}