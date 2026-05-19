import type { RefObject } from "react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { BranchLocation } from "../types";
import { BranchCard } from "./branch-card";
import { BranchMap } from "./branch-map";
import {
  ArrowRightIcon,
  FullscreenIcon,
  SearchIcon,
  TargetIcon,
} from "./icons";

type BranchSelectionStepProps = {
  branches: BranchLocation[];
  isBranchesFetching: boolean;
  isBranchesLoading: boolean;
  isContinueDisabled: boolean;
  isGeocodeFetching: boolean;
  isLocating: boolean;
  isSearchingLocation: boolean;
  locationError: string | null;
  mapFrameRef: RefObject<HTMLDivElement | null>;
  resultsLabel: string;
  searchValue: string;
  selectedBranchId: string | null;
  onBranchSelect: (branch: BranchLocation) => void;
  onContinue: () => void;
  onSearchValueChange: (value: string) => void;
  onToggleMapFullscreen: () => void | Promise<void>;
  onUseCurrentLocation: () => void;
  showBranchesError: boolean;
};

export const BranchSelectionStep = ({
  branches,
  isBranchesFetching,
  isBranchesLoading,
  isContinueDisabled,
  isGeocodeFetching,
  isLocating,
  isSearchingLocation,
  locationError,
  mapFrameRef,
  resultsLabel,
  searchValue,
  selectedBranchId,
  onBranchSelect,
  onContinue,
  onSearchValueChange,
  onToggleMapFullscreen,
  onUseCurrentLocation,
  showBranchesError,
}: BranchSelectionStepProps) => (
  <>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <Card>
        <CardHeader className="border-b border-slate-100 p-6">
          <div className="space-y-2">
            <CardTitle>Select a Branch</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          <div className="flex items-center">
            <div className="relative grow-7">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-11"
                onChange={(event) => onSearchValueChange(event.target.value)}
                placeholder="Search by branch, city, or postal code"
                value={searchValue}
              />
            </div>
            <div className="grow-0">
              <Button
                className="self-start font-normal"
                disabled={isLocating}
                onClick={onUseCurrentLocation}
                size="sm"
                variant="ghost"
              >
                {isLocating ? "Locating..." : "Use my location"}
                <TargetIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-slate-500">
              {isGeocodeFetching
                ? "Finding the closest matching location..."
                : resultsLabel}
            </p>
            {isBranchesFetching ? (
              <span className="inline-flex items-center gap-2 text-brand-blue-600">
                <span className="h-2 w-2 rounded-full bg-brand-blue-500" />
                Loading branches...
              </span>
            ) : null}
          </div>

          {locationError ? (
            <div className="rounded-field border border-warning-400/60 bg-warning-50 px-4 py-3 text-sm text-slate-700">
              {locationError}
            </div>
          ) : null}

          {isBranchesLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  className="h-40 animate-pulse rounded-card border border-slate-200 bg-slate-50"
                  key={index}
                />
              ))}
            </div>
          ) : showBranchesError ? (
            <div className="rounded-field border border-danger-500/20 bg-danger-100/40 px-4 py-3 text-sm text-danger-500">
              We couldn't load branches right now.
            </div>
          ) : branches.length === 0 && isSearchingLocation ? (
            <div className="rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              Finding the closest matching location...
            </div>
          ) : branches.length === 0 ? (
            <div className="rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              {searchValue.trim()
                ? `No branches matched "${searchValue.trim()}". Try another branch, city, or postal code.`
                : "No branches are available right now."}
            </div>
          ) : (
            <div className="grid max-h-[34rem] gap-4 overflow-auto pr-1">
              {branches.map((branch) => (
                <BranchCard
                  branch={branch}
                  isSelected={branch.id === selectedBranchId}
                  key={branch.id}
                  onSelect={() => onBranchSelect(branch)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
          <div className="mb-0">
            <CardTitle>Map View</CardTitle>
          </div>
          <Button onClick={onToggleMapFullscreen} size="sm" variant="ghost">
            <FullscreenIcon className="h-4 w-4" />
            Full Screen
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div
            className="overflow-hidden rounded-card border border-slate-200 bg-slate-50"
            ref={mapFrameRef}
          >
            <BranchMap
              branches={branches}
              onSelectBranch={onBranchSelect}
              selectedBranchId={selectedBranchId}
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="flex justify-end">
      <Button disabled={isContinueDisabled} onClick={onContinue} size="lg">
        Continue to Date &amp; Time
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  </>
);
