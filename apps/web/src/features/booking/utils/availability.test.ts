import assert from "node:assert/strict";
import test from "node:test";

import type { AvailabilityMonth } from "../types";
import {
  buildDisplayTimeSlots,
  buildTimeSlots,
  getDaySlots,
  isDateInAvailabilityMonth,
} from "./availability";

const availability: AvailabilityMonth = {
  days: [
    {
      date: "2026-05-19",
      slots: [
        {
          endsAt: "2026-05-19T07:00:00.000Z",
          id: "slot_1",
          isAvailable: true,
          label: "08:30 AM",
          startsAt: "2026-05-19T06:30:00.000Z",
        },
        {
          endsAt: "2026-05-19T07:30:00.000Z",
          id: "slot_2",
          isAvailable: false,
          label: "09:00 AM",
          startsAt: "2026-05-19T07:00:00.000Z",
        },
        {
          endsAt: "2026-05-19T08:00:00.000Z",
          id: "slot_3",
          isAvailable: true,
          label: "09:30 AM",
          startsAt: "2026-05-19T07:30:00.000Z",
        },
      ],
    },
  ],
  month: "2026-05",
  timezone: "Africa/Johannesburg",
};

test("availability helpers filter out unavailable time slots", () => {
  const slots = buildTimeSlots(availability, "2026-05-19");

  assert.equal(slots.length, 2);
  assert.equal(slots[0]?.id, "slot_1");
  assert.equal(slots[1]?.id, "slot_3");
});

test("availability helpers return all day slots before display filtering", () => {
  const slots = getDaySlots(availability, "2026-05-19");

  assert.equal(slots.length, 3);
  assert.equal(slots[1]?.id, "slot_2");
  assert.equal(slots[2]?.id, "slot_3");
});

test("availability helpers build a fixed display grid with disabled gaps", () => {
  const displaySlots = buildDisplayTimeSlots(
    availability.days[0]?.slots ?? [],
    "slot_3",
    new Date("2026-05-19T06:45:00.000Z"),
  );

  const unavailable = displaySlots.find((slot) => slot.label === "09:00 AM");
  const selected = displaySlots.find((slot) => slot.label === "09:30 AM");
  const hiddenPast = displaySlots.find((slot) => slot.label === "08:30 AM");

  assert.equal(displaySlots.length, 2);
  assert.equal(displaySlots[0]?.label, "09:00 AM");
  assert.equal(unavailable?.isDisabled, true);
  assert.equal(selected?.isDisabled, false);
  assert.equal(selected?.isSelected, true);
  assert.equal(hiddenPast, undefined);
});

test("availability helpers can tell when a selected date matches the loaded month", () => {
  assert.equal(isDateInAvailabilityMonth(availability, "2026-05-19"), true);
  assert.equal(isDateInAvailabilityMonth(availability, "2026-06-01"), false);
  assert.equal(isDateInAvailabilityMonth(null, "2026-05-19"), false);
});
