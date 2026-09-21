/**
 * `composed: true` is required: the event is dispatched from inside the
 * editor's shadow root and Home Assistant listens on the host side of it.
 */
export function fireEvent<T>(node: HTMLElement, type: string, detail: T): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}
