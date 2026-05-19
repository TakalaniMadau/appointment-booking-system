import assert from "node:assert/strict";
import test from "node:test";

import {
  branchSummarySchema,
  createBookingRequestSchema,
} from "./index";

test("shared booking contracts accept a valid booking request", () => {
  const payload = createBookingRequestSchema.parse({
    additionalNotes: "Needs wheelchair access",
    email: "jane@example.com",
    fullName: "Jane Doe",
    phone: "0821234567",
    purposeOfVisit: "account-support",
    slotId: "slot_123",
  });

  assert.equal(payload.purposeOfVisit, "account-support");
});

test("shared booking contracts require mapped branch data to include routing details", () => {
  assert.doesNotThrow(() =>
    branchSummarySchema.parse({
      address: "144 Rivonia Road, Sandton, Gauteng 2196",
      city: "Johannesburg",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=-26.1076,28.0567",
      distanceKm: 4.3,
      id: "branch_123",
      latitude: -26.1076,
      longitude: 28.0567,
      name: "Sandton Branch",
      nextAvailableDate: "2026-05-19",
      operatingSummary: "Open today · 08:30 - 16:30",
      phone: "010 123 4501",
      postalCode: "2196",
      province: "Gauteng",
      timezone: "Africa/Johannesburg",
    }),
  );
});
