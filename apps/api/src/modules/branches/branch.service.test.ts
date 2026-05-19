import assert from "node:assert/strict";
import test from "node:test";

import { formatMonthWindow } from "../../lib/datetime.js";

test("formatMonthWindow builds an inclusive month start and exclusive month end", () => {
  const { end, start } = formatMonthWindow("2026-05");

  assert.equal(start.toISOString(), "2026-04-30T22:00:00.000Z");
  assert.equal(end.toISOString(), "2026-05-31T22:00:00.000Z");
});
