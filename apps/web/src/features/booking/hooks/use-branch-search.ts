import { useQuery } from "@tanstack/react-query";
import { startTransition, useDeferredValue, useState } from "react";

import { geocodeSearchLocation, searchCapitecBranches } from "../../../api/capitec";
import type { SearchCoordinates } from "../types";

const defaultCoordinates: SearchCoordinates = {
  label: "Johannesburg, Gauteng",
  latitude: -26.2041,
  longitude: 28.0473,
  source: "default",
};

export const useBranchSearch = () => {
  const [manualCoordinates, setManualCoordinates] =
    useState<SearchCoordinates | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue.trim());

  const geocodeQuery = useQuery({
    enabled: deferredSearchValue.length >= 2,
    queryFn: () => geocodeSearchLocation(deferredSearchValue),
    queryKey: ["branch-search-location", deferredSearchValue],
    staleTime: 300_000,
  });

  const searchCoordinates =
    deferredSearchValue.length >= 2 && geocodeQuery.data?.[0]
      ? ({
          label: geocodeQuery.data[0].label,
          latitude: geocodeQuery.data[0].latitude,
          longitude: geocodeQuery.data[0].longitude,
          source: "search",
        } satisfies SearchCoordinates)
      : null;
  const activeCoordinates = manualCoordinates ?? searchCoordinates ?? defaultCoordinates;
  const locationError =
    deferredSearchValue.length >= 2 &&
    geocodeQuery.isSuccess &&
    !searchCoordinates
      ? `No South African locations matched "${deferredSearchValue}".`
      : deviceError;

  const branchesQuery = useQuery({
    queryFn: () => searchCapitecBranches(activeCoordinates),
    queryKey: [
      "capitec-branches",
      activeCoordinates.latitude,
      activeCoordinates.longitude,
    ],
    staleTime: 300_000,
  });

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
    locationError,
    searchValue,
    updateSearchValue,
    useCurrentLocation,
  };
};
