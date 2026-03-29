import { addDays, format, isToday, startOfToday } from "date-fns";
import { zhCN } from "date-fns/locale";

import type { MealType } from "../types/models";

export function formatISODate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function buildSevenDayRange(baseDate: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(baseDate, index);
    return {
      date,
      iso: formatISODate(date),
      dayLabel: isToday(date) ? "今天" : format(date, "EEE", { locale: zhCN }),
      numberLabel: format(date, "d"),
      monthLabel: format(date, "M月d日", { locale: zhCN }),
      isToday: isToday(date),
    };
  });
}

export function getTodayIso() {
  return formatISODate(startOfToday());
}

export function getTomorrowIso() {
  return formatISODate(addDays(startOfToday(), 1));
}

export function getMealLabel(mealType: MealType) {
  switch (mealType) {
    case "breakfast":
      return "早餐";
    case "lunch":
      return "午餐";
    case "dinner":
      return "晚餐";
    default:
      return mealType;
  }
}

export function getMealTimeHint(mealType: MealType) {
  switch (mealType) {
    case "breakfast":
      return "07:00 - 09:00";
    case "lunch":
      return "12:00 - 14:00";
    case "dinner":
      return "18:00 - 20:00";
    default:
      return "";
  }
}
