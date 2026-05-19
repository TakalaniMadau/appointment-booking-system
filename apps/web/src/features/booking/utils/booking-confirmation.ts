import { addMinutes, format, parse } from "date-fns";
import { purposeOfVisitOptions } from "@appointment/shared";

import type { ConfirmedBooking } from "../types";

export const getPurposeLabel = (value: string) =>
  purposeOfVisitOptions.find((option) => option.value === value)?.label ??
  "Branch visit";

export const createCalendarInvite = (booking: ConfirmedBooking) => {
  const startsAt = parse(
    `${booking.selectedDate} ${booking.selectedTime}`,
    "yyyy-MM-dd hh:mm a",
    new Date(),
  );
  const endsAt = addMinutes(startsAt, 30);
  const formatIcsDate = (value: Date) => format(value, "yyyyMMdd'T'HHmmss");
  const descriptionLines = [
    `Purpose: ${getPurposeLabel(booking.details.purposeOfVisit)}`,
    booking.details.additionalNotes
      ? `Notes: ${booking.details.additionalNotes}`
      : "",
    `Contact: ${booking.details.fullName} / ${booking.details.email} / ${booking.details.phone}`,
  ].filter(Boolean);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Appointment Booking System//Capitec Branch Visit//EN",
    "BEGIN:VEVENT",
    `UID:${booking.confirmationCode}@appointment-booking-system`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startsAt)}`,
    `DTEND:${formatIcsDate(endsAt)}`,
    `SUMMARY:Capitec branch appointment - ${booking.branch.name}`,
    `LOCATION:${booking.branch.address.replaceAll(",", "\\,")}`,
    `DESCRIPTION:${descriptionLines.join("\\n").replaceAll(",", "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};
