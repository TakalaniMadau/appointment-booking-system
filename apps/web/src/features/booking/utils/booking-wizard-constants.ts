import { parseISO, startOfMonth } from "date-fns";

import type { BranchLocation } from "../types";
import { getFirstAvailableDate } from "./availability";

export const stepDefinitions = [
  { key: "branch-selection", label: "Select Branch" },
  { key: "date-time", label: "Date & Time" },
  { key: "details", label: "Your Details" },
  { key: "confirmation", label: "Confirmation" },
] as const;

export type BookingStepKey = (typeof stepDefinitions)[number]["key"];

export const appointmentReminders = [
  "Please arrive 10 minutes before your appointment",
  "Bring a valid government-issued ID",
  "Check your email for the confirmation and any branch requirements",
] as const;

export const getDefaultVisibleMonth = (branch: BranchLocation) => {
  const firstAvailableDate = getFirstAvailableDate(branch);

  if (!firstAvailableDate) {
    return startOfMonth(new Date());
  }

  return startOfMonth(parseISO(firstAvailableDate));
};
