import type { DayKey } from "../types.js";

export interface DayNames {
  full: string;
  short: string;
}

export interface EditorStrings {
  tabSettings: string;
  tabSchedule: string;
  tabActivities: string;

  title: string;
  layout: string;
  layoutBlocks: string;
  layoutGrid: string;
  days: string;
  language: string;
  languageAuto: string;
  languageEnglish: string;
  languageBulgarian: string;
  highlightToday: string;
  headerColor: string;

  slots: string;
  addSlot: string;
  slotColumn: string;

  addBlock: string;
  addBlockNeedsActivity: string;
  activity: string;
  start: string;
  end: string;
  slot: string;
  slotNone: string;
  moveUp: string;
  moveDown: string;
  moveToDay: string;
  clearTime: string;
  remove: string;
  placeHint: string;

  activityTitle: string;
  activitySubtitle: string;
  newActivityTitle: string;
  addActivity: string;
  activityInUse: (title: string, count: number) => string;
  confirmRemoveActivity: string;

  noSlots: string;
  noBlocks: string;
  orphanActivity: string;
}

export interface Strings {
  days: Record<DayKey, DayNames>;
  until: (time: string) => string;
  after: (time: string) => string;
  range: (start: string, end: string) => string;
  today: string;
  editor: EditorStrings;
}
