import assert from "node:assert/strict";
import test from "node:test";

import type { AvailabilityMonth } from "../types";
import {
  buildTimeSlots,
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
      ],
    },
  ],
  month: "2026-05",
  timezone: "Africa/Johannesburg",
};

test("availability helpers filter out unavailable time slots", () => {
  const slots = buildTimeSlots(availability, "2026-05-19");

  assert.equal(slots.length, 1);
  assert.equal(slots[0]?.id, "slot_1");
});

test("availability helpers can tell when a selected date matches the loaded month", () => {
  assert.equal(isDateInAvailabilityMonth(availability, "2026-05-19"), true);
  assert.equal(isDateInAvailabilityMonth(availability, "2026-06-01"), false);
  assert.equal(isDateInAvailabilityMonth(null, "2026-05-19"), false);
});
