export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export type DayKey = (typeof DAY_KEYS)[number];
export type Lang = "en" | "bg";
export type Layout = "blocks" | "grid";
export type Density = "full" | "compact" | "stacked";

export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
}

export interface Block {
  activity: string;
  start?: string;
  end?: string;
}

export interface Slot {
  slot: number;
  start: string;
  end: string;
}

export interface CardConfig {
  type: string;
  title?: string;
  layout: Layout;
  days: DayKey[];
  language: "auto" | Lang;
  highlight_today: boolean;
  header_color: string;
  activities: Activity[];
  slots?: Slot[];
  schedule: Partial<Record<DayKey, Block[]>>;
}

export type TimeFormatSetting = "12" | "24" | "language" | "system";

export type FirstWeekdaySetting =
  | "language"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface HassLocale {
  language?: string;
  time_format?: TimeFormatSetting;
  first_weekday?: FirstWeekdaySetting;
}

export interface Hass {
  language?: string;
  locale?: HassLocale;
  themes?: unknown;
}
