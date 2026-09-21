class HaCardStub extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
          color: var(--primary-text-color, #212121);
        }
      </style>
      <slot></slot>
    `;
  }
}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCardStub);

const ACTIVITIES = [
  { id: "english", label: "Английски", color: "#3b82f6" },
  { id: "daycare", label: "Занималня", color: "#64748b" },
  { id: "break", label: "Почивка и хапване", color: "#94a3b8" },
  { id: "judo", label: "Джудо", color: "#f97316" },
  { id: "chess", label: "Шах", color: "#a855f7" },
  { id: "free", label: "Свободен следобед", color: "#22c55e" },
  { id: "home", label: "Връщане вкъщи", color: "#22c55e" },
];

const SCHOOL_DAY = (afternoon) => [
  { activity: "english", start: "15:20", end: "16:20" },
  { activity: "break", start: "16:20", end: "17:30" },
  { activity: afternoon, start: "17:30", end: "18:30" },
  { activity: "home", start: "18:30" },
];

const CLUB_DAY = [
  { activity: "daycare", end: "16:00" },
  { activity: "break", start: "16:00", end: "16:30" },
  { activity: "chess", start: "16:30", end: "17:30" },
];

const baseConfig = () => ({
  type: "custom:weekly-timetable-card",
  title: "Седмична програма",
  layout: "blocks",
  days: ["mon", "tue", "wed", "thu", "fri"],
  language: "auto",
  highlight_today: true,
  header_color: "#1e3a5f",
  activities: ACTIVITIES,
  people: [
    {
      name: "Иван",
      emoji: "🥋",
      color: "#f472b6",
      slots: [
        { slot: 1, start: "08:00", end: "08:45" },
        { slot: 2, start: "08:45", end: "09:30" },
        { slot: 3, start: "09:50", end: "10:35" },
      ],
      schedule: {
        mon: SCHOOL_DAY("judo"),
        tue: [{ activity: "daycare", end: "16:00" }, { activity: "free", start: "16:00" }],
        wed: SCHOOL_DAY("judo"),
        thu: CLUB_DAY,
        fri: CLUB_DAY,
        sat: [{ activity: "judo", start: "10:00", end: "11:30" }],
        sun: [],
      },
    },
    {
      name: "Мария",
      emoji: "🎻",
      color: "#38bdf8",
      schedule: {
        mon: [{ activity: "daycare", end: "16:00" }],
        tue: SCHOOL_DAY("chess"),
        wed: [],
        thu: [{ activity: "free" }],
        fri: CLUB_DAY,
        sat: [],
        sun: [],
      },
    },
  ],
});

const card = document.querySelector("weekly-timetable-card");
const frame = document.querySelector("#frame");
const controls = document.querySelector(".controls");

function readControls() {
  const value = (name) => controls.querySelector(`[name="${name}"]`).value;
  return {
    hassLanguage: value("hass-language"),
    timeFormat: value("time-format"),
    cardLanguage: value("card-language"),
    layout: value("layout"),
    dayCount: Number(value("day-count")),
    width: Number(value("width")),
    theme: value("theme"),
  };
}

function apply() {
  const state = readControls();

  card.hass = {
    language: state.hassLanguage,
    locale: { language: state.hassLanguage, time_format: state.timeFormat, first_weekday: "monday" },
  };

  const config = baseConfig();
  config.language = state.cardLanguage;
  config.layout = state.layout;
  config.days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].slice(0, state.dayCount);
  card.setConfig(config);

  frame.style.width = `${state.width}px`;
  document.documentElement.dataset.theme = state.theme;
  controls.querySelector("#width-readout").textContent = `${state.width}px`;
}

controls.addEventListener("input", apply);
controls.addEventListener("change", apply);
apply();

const editor = document.createElement("weekly-timetable-card-editor");
editor.hass = card.hass;
editor.setConfig(baseConfig());
editor.addEventListener("config-changed", (event) => {
  card.setConfig(event.detail.config);
  editor.setConfig(event.detail.config);
});
document.querySelector("#editor-frame").append(editor);
