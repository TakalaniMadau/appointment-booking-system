import type {
  AvailabilityDay,
  AvailabilitySlot,
  BookingConfirmation,
  BranchSummary,
} from "@appointment/shared";
import type { z } from "zod";

import type { bookingDetailsSchema } from "../schemas/booking-details-schema";

export type SearchCoordinates = {
  label: string;
  latitude: number;
  longitude: number;
  source: "default" | "device" | "search";
};

export type GeocodedLocation = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

export type BranchLocation = BranchSummary;

export type BookingDetailsValues = z.infer<typeof bookingDetailsSchema>;

export type ConfirmedBooking = BookingConfirmation;

export type AvailabilityMonth = {
  days: AvailabilityDay[];
  month: string;
  timezone: string;
};

export type TimeSlotOption = AvailabilitySlot;
