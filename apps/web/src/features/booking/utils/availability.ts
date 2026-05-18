import {
  addDays,
  addMinutes,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { BranchLocation, BranchOperatingWindow, CalendarDay } from "../types";

const SLOT_INTERVAL_MINUTES = 30;
const APPOINTMENT_START_HOUR = 8;
const APPOINTMENT_END_HOUR = 16;
const APPOINTMENT_END_MINUTE = 30;

const getAvailableWindows = (branch: BranchLocation): BranchOperatingWindow[] =>
  branch.specialOperatingHours.filter(
    (window) => !window.closed && window.open.length > 0 && window.close.length > 0,
  );

export const getAvailabilityMap = (branch: BranchLocation) =>
  new Map(
    getAvailableWindows(branch).map((window) => [
      window.date,
      window,
    ]),
  );

export const getAvailableMonths = (branch: BranchLocation) =>
  [...new Set(getAvailableWindows(branch).map((window) => window.date.slice(0, 7)))];

export const getFirstAvailableDate = (branch: BranchLocation) =>
  getAvailableWindows(branch)[0]?.date ?? "";

export const buildCalendarDays = (
  branch: BranchLocation,
  month: Date,
): CalendarDay[] => {
  const availabilityMap = getAvailabilityMap(branch);
  const monthStart = startOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const today = startOfDay(new Date());
  const days: CalendarDay[] = [];

  for (
    let cursor = gridStart;
    cursor <= gridEnd;
    cursor = addDays(cursor, 1)
  ) {
    const dateKey = format(cursor, "yyyy-MM-dd");

    days.push({
      date: cursor,
      dateKey,
      isAvailable: availabilityMap.has(dateKey),
      isCurrentMonth: cursor.getMonth() === monthStart.getMonth(),
      isPast: isBefore(startOfDay(cursor), today),
    });
  }

  return days;
};

export const buildTimeSlots = (
  branch: BranchLocation,
  dateKey: string,
): string[] => {
  const availabilityWindow = getAvailabilityMap(branch).get(dateKey);

  if (!availabilityWindow) {
    return [];
  }

  const slotStart = new Date(
    Number(dateKey.slice(0, 4)),
    Number(dateKey.slice(5, 7)) - 1,
    Number(dateKey.slice(8, 10)),
    APPOINTMENT_START_HOUR,
    0,
    0,
    0,
  );
  const slotEnd = new Date(
    Number(dateKey.slice(0, 4)),
    Number(dateKey.slice(5, 7)) - 1,
    Number(dateKey.slice(8, 10)),
    APPOINTMENT_END_HOUR,
    APPOINTMENT_END_MINUTE,
    0,
    0,
  );
  const slots: string[] = [];

  for (let cursor = slotStart; cursor <= slotEnd; cursor = addMinutes(cursor, SLOT_INTERVAL_MINUTES)) {
    slots.push(format(cursor, "hh:mm a"));
  }

  return slots;
};

export const formatWindowSummary = (
  branch: BranchLocation,
  dateKey: string,
): string | null => {
  const window = getAvailabilityMap(branch).get(dateKey);

  if (!window) {
    return null;
  }

  return `${format(parseISO(window.date), "EEEE, d MMMM")} · 08:00 AM - 04:30 PM`;
};
