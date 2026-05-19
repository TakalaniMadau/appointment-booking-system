import assert from "node:assert/strict";
import test from "node:test";

import type { BranchLocation } from "../types";
import {
  deriveVisibleBranches,
  filterBranchesBySearch,
  shouldGeocodeBranchSearch,
} from "./branch-search";

const branches: BranchLocation[] = [
  {
    address: "144 Rivonia Road, Sandton, Gauteng 2196",
    city: "Johannesburg",
    directionsUrl: "https://example.com/sandton",
    distanceKm: 3.2,
    id: "branch_1",
    latitude: -26.1076,
    longitude: 28.0567,
    name: "Sandton Branch",
    nextAvailableDate: "2026-05-20",
    operatingSummary: "Open today · 08:30 - 16:30",
    phone: "010 123 4501",
    postalCode: "2196",
    province: "Gauteng",
    timezone: "Africa/Johannesburg",
  },
  {
    address: "165 Atterbury Road, Menlyn, Gauteng 0181",
    city: "Pretoria",
    directionsUrl: "https://example.com/menlyn",
    distanceKm: 12.7,
    id: "branch_2",
    latitude: -25.7479,
    longitude: 28.2293,
    name: "Menlyn Branch",
    nextAvailableDate: "2026-05-21",
    operatingSummary: "Open today · 08:30 - 16:30",
    phone: "010 123 4503",
    postalCode: "0181",
    province: "Gauteng",
    timezone: "Africa/Johannesburg",
  },
];

test("branch search matches branch details like name and postal code", () => {
  assert.deepEqual(
    filterBranchesBySearch(branches, "2196").map((branch) => branch.id),
    ["branch_1"],
  );
  assert.deepEqual(
    filterBranchesBySearch(branches, "sandton").map((branch) => branch.id),
    ["branch_1"],
  );
});

test("branch search returns no results when neither text nor location matches", () => {
  const result = deriveVisibleBranches({
    branches,
    query: "not-a-real-place",
  });

  assert.equal(result.hasDirectMatches, false);
  assert.equal(result.visibleBranches.length, 0);
});

test("branch search only geocodes when there are no direct branch matches", () => {
  assert.equal(shouldGeocodeBranchSearch("2196", true), false);
  assert.equal(shouldGeocodeBranchSearch("Johannesburg", false), true);
  assert.equal(shouldGeocodeBranchSearch("j", false), false);
});
