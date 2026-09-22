import type { Strings } from "./types.js";

export const bg: Strings = {
  days: {
    mon: { full: "понеделник", short: "пн" },
    tue: { full: "вторник", short: "вт" },
    wed: { full: "сряда", short: "ср" },
    thu: { full: "четвъртък", short: "чт" },
    fri: { full: "петък", short: "пт" },
    sat: { full: "събота", short: "сб" },
    sun: { full: "неделя", short: "нд" },
  },
  until: (time) => `до ${time}`,
  after: (time) => `след ${time}`,
  range: (start, end) => `${start}–${end}`,
  today: "Днес",
  editor: {
    tabSettings: "Настройки",
    tabSchedule: "Разписание",
    tabActivities: "Дейности",

    title: "Заглавие",
    layout: "Изглед",
    layoutBlocks: "Блокове",
    layoutGrid: "Мрежа",
    days: "Дни",
    language: "Език",
    languageAuto: "Автоматично",
    languageEnglish: "Английски",
    languageBulgarian: "Български",
    highlightToday: "Отбелязвай днешния ден",
    headerColor: "Цвят на заглавката",

    slots: "Часови интервали",
    addSlot: "Добави интервал",
    slotColumn: "Интервал",

    addBlock: "Добави блок",
    addBlockNeedsActivity: "Първо добавете дейност",
    activity: "Дейност",
    start: "Начало",
    end: "Край",
    slot: "Интервал",
    slotNone: "Извън мрежата",
    moveUp: "Премести нагоре",
    moveDown: "Премести надолу",
    moveToDay: "Премести в друг ден",
    clearTime: "Изчисти този час (блокът става отворен)",
    remove: "Премахни",
    placeHint: "Докоснете дейност, след което докоснете ден, за да я добавите там",

    activityTitle: "Заглавие",
    activitySubtitle: "Подзаглавие",
    newActivityTitle: "Име на нова дейност",
    addActivity: "Добави дейност",
    activityInUse: (title, count) =>
      `„${title}“ се използва в ${count} ${count === 1 ? "блок" : "блока"}.`,
    confirmRemoveActivity: "Да се премахне ли въпреки това?",

    noSlots: `Добавете часови интервали, за да използвате изгледа „Мрежа“.`,
    noBlocks: "Няма занимания",
    orphanActivity: "Непозната дейност",
  },
};
