import { isDayKey } from "../days.js";
import type { DayKey } from "../types.js";

const DRAG_THRESHOLD_PX = 5;

/** How close to a scroll container's edge the pointer must get to auto-scroll. */
const AUTO_SCROLL_EDGE_PX = 56;
const AUTO_SCROLL_STEP_PX = 14;
const AUTO_SCROLL_INTERVAL_MS = 16;

/**
 * The nearest scrollable ancestor, crossing shadow boundaries via `host`.
 *
 * Home Assistant renders this editor inside its card-config dialog, whose
 * content area is the scroll container — outside our shadow root entirely. Only
 * about two day groups fit there at once, and elementFromPoint is viewport-based,
 * so without scrolling during a drag any day the author cannot currently see is
 * unreachable and the drop silently does nothing.
 */
function scrollableAncestor(start: Element | null): Element | null {
  let node: Element | null = start;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    if (node.parentElement) {
      node = node.parentElement;
      continue;
    }
    const root = node.getRootNode();
    node = root instanceof ShadowRoot ? root.host : null;
  }
  return document.scrollingElement;
}

export type DragSource =
  | { kind: "block"; day: DayKey; index: number }
  | { kind: "activity"; activityId: string };

export interface Bounds {
  top: number;
  bottom: number;
}

export interface DropTarget {
  day: DayKey;
  index: number;
}

export interface DndCallbacks {
  moveBlock: (from: { day: DayKey; index: number }, to: DropTarget) => void;
  insertActivity: (activityId: string, to: DropTarget) => void;
  requestUpdate: () => void;
}

/** Controls that own their own pointer behaviour and must never start a drag. */
const INTERACTIVE = "select, input, button, textarea, option, a";

/**
 * `allowRow` lets the whole block row start a drag, not just the grip.
 *
 * The grip is a 12px glyph, and a person reaching for a row grabs the row — so
 * grip-only dragging reads as "drag does not work". Rows are enabled for mouse
 * and pen but NOT for touch: a row covered by `touch-action: none` could no
 * longer be used to scroll the panel, which on a tablet matters more than
 * dragging does. Touch keeps the grip, which is what `touch-action: none` is
 * scoped to.
 */
export function parseDragSource(
  element: Element | null,
  allowRow = false,
): DragSource | null {
  // A pointer event's target is typed as Element, but a caller may hand us a
  // child text node (e.g. `node.firstChild`); climb to its parent element
  // before calling `.closest`, which only exists on Element.
  const start = element && element.nodeType !== Node.ELEMENT_NODE ? element.parentElement : element;

  const handle = start?.closest<HTMLElement>("[data-drag-block]");
  if (handle) {
    const day = handle.dataset.dragDay;
    const index = Number(handle.dataset.dragBlock);
    if (isDayKey(day) && Number.isInteger(index) && index >= 0) {
      return { kind: "block", day, index };
    }
    return null;
  }

  if (allowRow && start && !start.closest(INTERACTIVE)) {
    const row = start.closest<HTMLElement>("[data-block-index]");
    const day = row?.closest<HTMLElement>("[data-day]")?.dataset.day;
    const index = Number(row?.dataset.blockIndex);
    if (row && isDayKey(day) && Number.isInteger(index) && index >= 0) {
      return { kind: "block", day, index };
    }
  }

  const chip = start?.closest<HTMLElement>("[data-palette-activity]");
  const activityId = chip?.dataset.paletteActivity;
  return activityId ? { kind: "activity", activityId } : null;
}

/** Geometry kept separate from the DOM so it can be tested over plain numbers. */
export function insertionIndex(bounds: readonly Bounds[], clientY: number): number {
  for (let i = 0; i < bounds.length; i += 1) {
    const row = bounds[i]!;
    if (clientY < (row.top + row.bottom) / 2) return i;
  }
  return bounds.length;
}

/**
 * Hit-testing yields an index into the rows as drawn; moveBlock splices the
 * dragged block out before inserting, so a same-day drop below the source is
 * one position too high.
 */
export function adjustForRemoval(
  source: DragSource,
  targetDay: DayKey,
  index: number,
): number {
  if (source.kind !== "block" || source.day !== targetDay) return index;
  return index > source.index ? index - 1 : index;
}

export class DndController {
  private _source: DragSource | null = null;
  private _origin = { x: 0, y: 0 };
  private _active = false;
  private _hoverDay: DayKey | null = null;
  private _scroller: Element | null = null;
  private _scrollTimer: ReturnType<typeof setInterval> | null = null;
  private _scrollDirection = 0;

  constructor(
    private readonly getRoot: () => ShadowRoot | null,
    private readonly callbacks: DndCallbacks,
  ) {}

  get active(): boolean {
    return this._active;
  }

  get hoverDay(): DayKey | null {
    return this._hoverDay;
  }

  readonly onPointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary || event.button !== 0) return;
    const source = parseDragSource(
      event.target as Element | null,
      event.pointerType !== "touch",
    );
    if (!source) return;
    this._source = source;
    this._origin = { x: event.clientX, y: event.clientY };
    this._active = false;
    this._scroller = scrollableAncestor(event.target as Element | null);
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp);
    window.addEventListener("pointercancel", this._onPointerCancel);
  };

  private readonly _onPointerMove = (event: PointerEvent): void => {
    if (!this._source) return;
    if (!this._active) {
      const dx = event.clientX - this._origin.x;
      const dy = event.clientY - this._origin.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      this._active = true;
    }
    event.preventDefault();
    this._updateAutoScroll(event.clientY);
    const day = this._dayUnder(event.clientX, event.clientY);
    if (day !== this._hoverDay) {
      this._hoverDay = day;
      this.callbacks.requestUpdate();
    }
  };

  private readonly _onPointerUp = (event: PointerEvent): void => {
    const source = this._source;
    const wasActive = this._active;
    this._teardown();
    if (!source || !wasActive) return;

    const group = this._groupUnder(event.clientX, event.clientY);
    const day = group?.dataset.day;
    if (!group || !isDayKey(day)) return;

    const bounds: Bounds[] = [...group.querySelectorAll("[data-block-index]")].map((row) => {
      const rect = row.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    });
    const index = adjustForRemoval(source, day, insertionIndex(bounds, event.clientY));

    if (source.kind === "block") {
      this.callbacks.moveBlock({ day: source.day, index: source.index }, { day, index });
      return;
    }
    this.callbacks.insertActivity(source.activityId, { day, index });
  };

  private readonly _onPointerCancel = (): void => {
    this._teardown();
  };

  /**
   * Abort any in-flight drag. The host must call this when it is removed:
   * onPointerDown attaches window listeners that only _teardown removes, so a
   * dialog closed mid-drag would leak all three together with a reference to
   * the detached element.
   */
  cancel(): void {
    this._teardown();
  }

  /**
   * Scroll while the pointer is held near an edge, not merely once per move
   * event: a drag that has reached the edge has stopped generating moves, which
   * is exactly when the scrolling needs to continue.
   */
  private _updateAutoScroll(clientY: number): void {
    const container = this._scroller;
    if (!container) return;

    const isRoot = container === document.scrollingElement;
    const top = isRoot ? 0 : container.getBoundingClientRect().top;
    const bottom = isRoot ? window.innerHeight : container.getBoundingClientRect().bottom;

    let direction = 0;
    if (clientY < top + AUTO_SCROLL_EDGE_PX) direction = -1;
    else if (clientY > bottom - AUTO_SCROLL_EDGE_PX) direction = 1;

    if (direction === this._scrollDirection) return;
    this._scrollDirection = direction;
    this._stopAutoScroll();
    if (direction === 0) return;

    this._scrollTimer = setInterval(() => {
      container.scrollTop += direction * AUTO_SCROLL_STEP_PX;
    }, AUTO_SCROLL_INTERVAL_MS);
  }

  private _stopAutoScroll(): void {
    if (this._scrollTimer !== null) {
      clearInterval(this._scrollTimer);
      this._scrollTimer = null;
    }
  }

  private _teardown(): void {
    this._stopAutoScroll();
    this._scrollDirection = 0;
    this._scroller = null;
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerCancel);
    const needsRepaint = this._active || this._hoverDay !== null;
    this._source = null;
    this._active = false;
    this._hoverDay = null;
    if (needsRepaint) this.callbacks.requestUpdate();
  }

  private _groupUnder(x: number, y: number): HTMLElement | null {
    const root = this.getRoot();
    const element =
      root?.elementFromPoint?.(x, y) ??
      (typeof document.elementFromPoint === "function" ? document.elementFromPoint(x, y) : null);
    return (element as Element | null)?.closest<HTMLElement>("[data-day]") ?? null;
  }

  private _dayUnder(x: number, y: number): DayKey | null {
    const day = this._groupUnder(x, y)?.dataset.day;
    return isDayKey(day) ? day : null;
  }
}
