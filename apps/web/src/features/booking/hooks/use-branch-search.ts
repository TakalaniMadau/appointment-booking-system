import { useQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";

import { geocodeSearchLocation, getBranches } from "../../../api/branches";
import {
  deriveVisibleBranches,
  shouldGeocodeBranchSearch,
} from "../utils/branch-search";
import type { SearchCoordinates } from "../types";
import { useDebouncedValue } from "./use-debounced-value";

const defaultCoordinates: SearchCoordinates = {
  label: "Johannesburg, Gauteng",
  latitude: -26.2041,
  longitude: 28.0473,
  source: "default",
};

const LOCATION_SEARCH_DEBOUNCE_MS = 350;

export const useBranchSearch = () => {
  const [manualCoordinates, setManualCoordinates] =
    useState<SearchCoordinates | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const trimmedSearchValue = searchValue.trim();
  const debouncedSearchValue = useDebouncedValue(
    trimmedSearchValue,
    LOCATION_SEARCH_DEBOUNCE_MS,
  );

  const baseCoordinates = manualCoordinates ?? defaultCoordinates;
  const baseBranchesQuery = useQuery({
    queryFn: () => getBranches(baseCoordinates),
    queryKey: [
      "branches",
      baseCoordinates.latitude,
      baseCoordinates.longitude,
    ],
    staleTime: 300_000,
  });
  const visibleBranchesResult = deriveVisibleBranches({
    branches: baseBranchesQuery.data ?? [],
    query: trimmedSearchValue,
  });
  const shouldGeocodeSearch = shouldGeocodeBranchSearch(
    debouncedSearchValue,
    visibleBranchesResult.hasDirectMatches,
  );
  const geocodeQuery = useQuery({
    enabled: shouldGeocodeSearch,
    queryFn: () => geocodeSearchLocation(debouncedSearchValue),
    queryKey: ["branch-search-location", debouncedSearchValue],
    staleTime: 300_000,
  });
  const searchCoordinates =
    shouldGeocodeSearch && geocodeQuery.data?.[0]
      ? ({
          label: geocodeQuery.data[0].label,
          latitude: geocodeQuery.data[0].latitude,
          longitude: geocodeQuery.data[0].longitude,
          source: "search",
        } satisfies SearchCoordinates)
      : null;
  const activeCoordinates = searchCoordinates ?? baseCoordinates;
  const branchesQuery = useQuery({
    queryFn: () => getBranches(activeCoordinates),
    queryKey: [
      "branches",
      activeCoordinates.latitude,
      activeCoordinates.longitude,
    ],
    staleTime: 300_000,
  });
  const visibleBranches = !trimmedSearchValue
    ? branchesQuery.data ?? []
    : visibleBranchesResult.hasDirectMatches
      ? visibleBranchesResult.visibleBranches
      : searchCoordinates
        ? branchesQuery.data ?? []
        : [];
  const isWaitingForLocationMatch =
    shouldGeocodeSearch &&
    trimmedSearchValue !== debouncedSearchValue &&
    !searchCoordinates;
  const isSearchingLocation =
    Boolean(trimmedSearchValue) &&
    !visibleBranchesResult.hasDirectMatches &&
    (isWaitingForLocationMatch ||
      geocodeQuery.isFetching ||
      (Boolean(searchCoordinates) && branchesQuery.isFetching));
  const locationError =
    shouldGeocodeSearch &&
    geocodeQuery.isSuccess &&
    !searchCoordinates &&
    !isWaitingForLocationMatch
      ? `No branches or South African locations matched "${debouncedSearchValue}".`
      : deviceError;

  const resultsLabel = trimmedSearchValue
    ? visibleBranchesResult.hasDirectMatches
      ? `Found ${visibleBranches.length} matching ${
          visibleBranches.length === 1 ? "branch" : "branches"
        } for "${trimmedSearchValue}".`
      : isWaitingForLocationMatch || geocodeQuery.isFetching
        ? "Finding the closest matching location..."
        : searchCoordinates
          ? `Showing branches near ${searchCoordinates.label}.`
          : shouldGeocodeSearch && geocodeQuery.isSuccess
            ? `No branches or South African locations matched "${debouncedSearchValue}".`
            : `No branches matched "${trimmedSearchValue}".`
    : `Showing branches near ${baseCoordinates.label}.`;

  const updateSearchValue = (value: string) => {
    setDeviceError(null);
    setManualCoordinates(null);

    startTransition(() => {
      setSearchValue(value);
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setDeviceError("Location access is not available in this browser.");
      return;
    }

    setIsLocating(true);
    setDeviceError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setManualCoordinates({
          label: "your current location",
          latitude: coords.latitude,
          longitude: coords.longitude,
          source: "device",
        });
        setSearchValue("");
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setDeviceError(
          "We couldn't access your location, so we're still showing branches near Johannesburg.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
  };

  return {
    activeCoordinates,
    branchesQuery,
    geocodeQuery,
    isLocating,
    isSearchingLocation,
    locationError,
    resultsLabel,
    searchValue,
    updateSearchValue,
    useCurrentLocation,
    visibleBranches,
  };
};
