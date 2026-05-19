import { format, isAfter, parseISO } from "date-fns";

import type { AvailabilityMonth, TimeSlotOption } from "../types";

export type DisplayTimeSlot = {
  id: string;
  isDisabled: boolean;
  isSelected: boolean;
  label: string;
};

export const getAvailabilityMap = (availability: AvailabilityMonth | null) =>
  new Map(
    (availability?.days ?? []).map((day) => [
      day.date,
      day,
    ]),
  );

export const getDaySlots = (
  availability: AvailabilityMonth | null,
  dateKey: string,
): TimeSlotOption[] => getAvailabilityMap(availability).get(dateKey)?.slots ?? [];

export const buildTimeSlots = (
  availability: AvailabilityMonth | null,
  dateKey: string,
): TimeSlotOption[] => getDaySlots(availability, dateKey).filter((slot) => slot.isAvailable);

export const buildDisplayTimeSlots = (
  slots: TimeSlotOption[],
  selectedSlotId: string,
  now: Date = new Date(),
): DisplayTimeSlot[] =>
  slots
    .filter((slot) => isAfter(parseISO(slot.startsAt), now))
    .map((slot) => ({
      id: slot.id,
      isDisabled: !slot.isAvailable,
      isSelected: slot.id === selectedSlotId,
      label: slot.label,
    }));

export const getMonthKey = (month: Date) => format(month, "yyyy-MM");

export const isDateInAvailabilityMonth = (
  availability: AvailabilityMonth | null,
  dateKey: string,
) => availability?.month === dateKey.slice(0, 7);

export const formatWindowSummary = (
  availability: AvailabilityMonth | null,
  dateKey: string,
): string | null => {
  const slots = getAvailabilityMap(availability)
    .get(dateKey)
    ?.slots.filter((slot) => slot.isAvailable) ?? [];

  if (slots.length === 0) {
    return null;
  }

  const firstSlot = slots[0];
  const lastSlot = slots.at(-1);

  if (!firstSlot || !lastSlot) {
    return null;
  }

  return `${format(new Date(`${dateKey}T00:00:00`), "EEEE, d MMMM")} · ${firstSlot.label} - ${lastSlot.label}`;
};
