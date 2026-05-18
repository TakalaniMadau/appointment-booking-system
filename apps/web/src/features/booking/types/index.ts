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

export type BranchOperatingWindow = {
  close: string;
  closed: boolean;
  date: string;
  open: string;
};

export type CapitecSearchResponse = {
  stores: Array<{
    address: string;
    attributes: Array<{
      icon: string;
      id: number;
      value: string;
    }>;
    distance: number;
    googleDirectionsLink?: string | null;
    latitude: string;
    local_page_url: string;
    longitude: string;
    name: string;
    nearest: boolean;
    operating_hours: {
      has_operating_hours: boolean;
      operating_time_closed: string | null;
      operating_time_is_open: boolean;
      operating_time_open: string | null;
      operating_time_string: string;
    };
    primaryNumber: string;
    slug: string;
    specialOperatingHours: BranchOperatingWindow[];
    trading_status: string;
  }>;
};

export type BranchLocation = {
  address: string;
  directionsUrl: string | null;
  distanceKm: number;
  isNearest: boolean;
  latitude: number;
  localPageUrl: string;
  longitude: number;
  name: string;
  operatingSummary: string;
  phone: string;
  slug: string;
  specialOperatingHours: BranchOperatingWindow[];
  tags: string[];
  tradingStatus: string;
};

export type CalendarDay = {
  date: Date;
  dateKey: string;
  isAvailable: boolean;
  isCurrentMonth: boolean;
  isPast: boolean;
};

export type BookingDetailsValues = z.infer<typeof bookingDetailsSchema>;

export type ConfirmedBooking = {
  branch: BranchLocation;
  bookedAt: string;
  confirmationCode: string;
  details: BookingDetailsValues;
  selectedDate: string;
  selectedTime: string;
};
