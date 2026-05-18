import type {
  BranchLocation,
  CapitecSearchResponse,
  GeocodedLocation,
  SearchCoordinates,
} from "../features/booking/types";

const CAPITEC_API_BASE_URL =
  import.meta.env.VITE_CAPITEC_API_BASE_URL ?? "/capitec-api";

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

export const searchCapitecBranches = async ({
  latitude,
  longitude,
}: SearchCoordinates): Promise<BranchLocation[]> => {
  const formData = new FormData();
  formData.set("domain", "capitecpages.localpages.io");
  formData.set("latitude", `${latitude}`);
  formData.set("longitude", `${longitude}`);
  formData.set("attributes", "[]");
  formData.set("radius", "20");
  formData.set("initialLoad", "false");

  const payload = await parseResponse<CapitecSearchResponse>(
    await fetch(`${CAPITEC_API_BASE_URL}/locations/search`, {
      body: formData,
      headers: {
        "X-Requested-By-Application": "localpages",
      },
      method: "POST",
    }),
  );

  return payload.stores
    .filter((store) =>
      store.attributes.some((attribute) => attribute.value === "Branch"),
    )
    .map((store) => ({
      address: store.address,
      directionsUrl: store.googleDirectionsLink ?? null,
      distanceKm: Number(store.distance.toFixed(1)),
      isNearest: store.nearest,
      latitude: Number(store.latitude),
      localPageUrl: store.local_page_url,
      longitude: Number(store.longitude),
      name: store.name,
      operatingSummary:
        store.operating_hours.operating_time_string || "Hours unavailable",
      phone: store.primaryNumber,
      slug: store.slug,
      specialOperatingHours: [...store.specialOperatingHours].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
      tags: store.attributes.map((attribute) => attribute.value),
      tradingStatus: store.trading_status,
    }))
    .sort((left, right) => left.distanceKm - right.distanceKm);
};
