import { isDayKey } from "../days.js";
import type { DayKey } from "../types.js";

const DRAG_THRESHOLD_PX = 5;

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

export function parseDragSource(element: Element | null): DragSource | null {
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
    const source = parseDragSource(event.target as Element | null);
    if (!source) return;
    this._source = source;
    this._origin = { x: event.clientX, y: event.clientY };
    this._active = false;
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

  private _teardown(): void {
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
