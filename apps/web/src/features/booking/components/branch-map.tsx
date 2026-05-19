import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";

import type { BranchLocation } from "../types";

type BranchMapProps = {
  branches: BranchLocation[];
  onSelectBranch: (branch: BranchLocation) => void;
  selectedBranchId: string | null;
};

const buildMarkerIcon = (isSelected: boolean) =>
  L.divIcon({
    className: "",
    html: `<span class="branch-map-marker${isSelected ? " is-selected" : ""}">
      <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 24 24" width="12">
        <path d="M12 21s6-5.33 6-11a6 6 0 10-12 0c0 5.67 6 11 6 11z" fill="currentColor"></path>
        <circle cx="12" cy="10" fill="#ffffff" r="2.5"></circle>
      </svg>
    </span>`,
    iconAnchor: [12, 12],
    iconSize: [24, 24],
  });

export const BranchMap = ({
  branches,
  onSelectBranch,
  selectedBranchId,
}: BranchMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([-26.2041, 28.0473], 12);

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(mapRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) ?? null,
    [branches, selectedBranchId],
  );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    layerRef.current?.remove();
    layerRef.current = L.layerGroup().addTo(mapRef.current);

    const markers = branches.map((branch) => {
      const marker = L.marker([branch.latitude, branch.longitude], {
        icon: buildMarkerIcon(branch.id === selectedBranchId),
      });

      marker.on("click", () => {
        onSelectBranch(branch);
      });

      marker.bindTooltip(branch.name, {
        direction: "top",
        offset: [0, -12],
      });

      marker.addTo(layerRef.current!);

      return marker;
    });

    if (selectedBranch) {
      mapRef.current.setView(
        [selectedBranch.latitude, selectedBranch.longitude],
        14,
        {
          animate: true,
        },
      );
      return;
    }

    const [onlyMarker] = markers;

    if (markers.length === 1 && onlyMarker) {
      mapRef.current.setView(onlyMarker.getLatLng(), 14);
      return;
    }

    if (markers.length > 1) {
      const bounds = L.featureGroup(markers).getBounds().pad(0.18);
      mapRef.current.fitBounds(bounds);
    }
  }, [branches, onSelectBranch, selectedBranch, selectedBranchId]);

  return <div className="h-full min-h-[420px] w-full" ref={containerRef} />;
};
