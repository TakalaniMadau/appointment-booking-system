import {
  bookingConfirmationSchema,
  branchAvailabilitySchema,
  branchesResponseSchema,
  createBookingRequestSchema,
  type BookingConfirmation,
  type BranchAvailability,
  type BranchSummary,
  type CreateBookingRequest,
} from "@appointment/shared";

import type { GeocodedLocation, SearchCoordinates } from "../features/booking/types";
import { api } from "./client";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

type NominatimRecord = {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};

export const geocodeSearchLocation = async (
  query: string,
): Promise<GeocodedLocation[]> => {
  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "za");

  const results = await parseResponse<NominatimRecord[]>(
    await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    }),
  );

  return results.map((result) => ({
    id: `${result.place_id}`,
    label: result.display_name,
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  }));
};

export const getBranches = async (
  coordinates: SearchCoordinates,
): Promise<BranchSummary[]> => {
  const params = new URLSearchParams();
  params.set("latitude", `${coordinates.latitude}`);
  params.set("longitude", `${coordinates.longitude}`);

  const response = branchesResponseSchema.parse(
    await api<unknown>(`/branches?${params.toString()}`),
  );

  return response.items;
};

export const getBranchAvailability = async (
  branchId: string,
  month: string,
): Promise<BranchAvailability> =>
  branchAvailabilitySchema.parse(
    await api<unknown>(
      `/branches/${branchId}/availability?month=${encodeURIComponent(month)}`,
    ),
  );

export const createBooking = async (
  input: CreateBookingRequest,
): Promise<BookingConfirmation> =>
  bookingConfirmationSchema.parse(
    await api<unknown>("/bookings", {
      body: JSON.stringify(createBookingRequestSchema.parse(input)),
      method: "POST",
    }),
  );
