import { format } from "date-fns";

import { cn } from "../../../lib/utils";
import type { BranchLocation } from "../types";
import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  DistanceIcon,
  PhoneIcon,
} from "./icons";

type BranchCardProps = {
  branch: BranchLocation;
  isSelected: boolean;
  onSelect: () => void;
};

export const BranchCard = ({
  branch,
  isSelected,
  onSelect,
}: BranchCardProps) => {
  const availableToday = branch.specialOperatingHours.some(
    (window) =>
      window.date === format(new Date(), "yyyy-MM-dd") && !window.closed,
  );

  return (
    <button
      className={cn(
        "rounded-card border p-5 text-left transition-all duration-200",
        isSelected
          ? "border-brand-blue-600 bg-brand-blue-50 shadow-soft"
          : "border-slate-200 bg-white hover:border-brand-blue-200 hover:bg-brand-blue-50/40",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            {branch.name}
          </h3>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            {branch.address}
          </p>
        </div>

        <span className="inline-flex h-6 w-6 items-center justify-center">
          {isSelected ? (
            <CheckCircleIcon className="h-5 w-5 text-brand-blue-600" />
          ) : (
            <CircleIcon className="h-5 w-5 text-slate-300" />
          )}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-brand-blue-600" />
          {branch.operatingSummary}
        </span>
        <span className="inline-flex items-center gap-2">
          <PhoneIcon className="h-4 w-4 text-brand-blue-600" />
          {branch.phone}
        </span>
        <span className="inline-flex items-center gap-2">
          <DistanceIcon className="h-4 w-4 text-brand-blue-600" />
          {branch.distanceKm} km away
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold",
            availableToday ? "text-success-500" : "text-slate-500",
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              availableToday ? "bg-success-500" : "bg-slate-300",
            )}
          />
          {availableToday ? "Available today" : branch.tradingStatus}
        </span>

        {branch.directionsUrl ? (
          <a
            className="text-sm font-semibold text-brand-blue-600 transition-colors hover:text-brand-blue-700"
            href={branch.directionsUrl}
            rel="noreferrer"
            target="_blank"
          >
            Directions
          </a>
        ) : null}
      </div>
    </button>
  );
};
