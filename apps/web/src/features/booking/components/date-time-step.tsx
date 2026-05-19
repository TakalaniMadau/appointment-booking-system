import { format, parseISO } from "date-fns";

import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { BranchLocation, TimeSlotOption } from "../types";
import { buildDisplayTimeSlots } from "../utils/availability";
import { SelectionSummary } from "./selection-summary";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type DateTimeStepProps = {
  committedDate: string;
  committedTime: string;
  dateTimeError: string | null;
  draftSlotId: string;
  isAvailabilityLoading: boolean;
  isAvailabilityRefreshing: boolean;
  pickerDate: string;
  pickerTimeSlots: TimeSlotOption[];
  selectedBranch: BranchLocation;
  showAvailabilityError: boolean;
  onBack: () => void;
  onContinue: () => void;
  onDateSelect: (dateKey: string) => void;
  onDraftTimeChange: (value: string) => void;
};

export const DateTimeStep = ({
  committedDate,
  committedTime,
  dateTimeError,
  draftSlotId,
  isAvailabilityLoading,
  isAvailabilityRefreshing,
  pickerDate,
  pickerTimeSlots,
  selectedBranch,
  showAvailabilityError,
  onBack,
  onContinue,
  onDateSelect,
  onDraftTimeChange,
}: DateTimeStepProps) => {
  const dateFieldValue = pickerDate || "";
  const selectedDateSummary = pickerDate
    ? format(parseISO(pickerDate), "MMMM d, yyyy")
    : "Choose a preferred date and we'll load the available appointment times for that day.";
  const minimumDate = format(new Date(), "yyyy-MM-dd");
  const displayTimeSlots = buildDisplayTimeSlots(pickerTimeSlots, draftSlotId);
  const availableSlotCount = displayTimeSlots.filter(
    (slot) => !slot.isDisabled,
  ).length;
  const draftSlot =
    pickerTimeSlots.find((slot) => slot.id === draftSlotId) ?? null;
  const summaryDate = pickerDate || committedDate;
  const summaryTime = draftSlot?.label || committedTime;

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Card>
          <CardHeader className="border-b border-slate-100 p-6">
            <CardTitle>Select Date &amp; Time</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="rounded-card border border-slate-100 bg-slate-50/70 p-5">
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">Date</p>
                <p className="text-sm text-slate-500">{selectedDateSummary}</p>
              </div>

              <div className="mt-4 space-y-2">
                <label
                  className="block text-xs font-medium text-slate-500"
                  htmlFor="appointment-date"
                >
                  Select appointment date
                </label>
                <Input
                  className=""
                  id="appointment-date"
                  min={minimumDate}
                  onChange={(event) => onDateSelect(event.target.value)}
                  type="date"
                  value={dateFieldValue}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  {pickerDate
                    ? `Available Time Slots - ${format(parseISO(pickerDate), "MMMM d, yyyy")}`
                    : "Available Time Slots"}
                </p>
                <p className="text-sm text-slate-500">
                  {pickerDate
                    ? availableSlotCount > 0
                      ? "Showing the remaining branch time slots for this date."
                      : "There are no remaining branch time slots for this date."
                    : "Select an available date to load that branch's time slots."}
                </p>
              </div>

              {dateTimeError ? (
                <div className="mt-4 rounded-field border border-danger-500/20 bg-danger-100/40 px-4 py-5 text-sm text-danger-500">
                  {dateTimeError}
                </div>
              ) : null}

              {isAvailabilityLoading ? (
                <div className="mt-4 rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  Loading appointment availability for this branch...
                </div>
              ) : showAvailabilityError ? (
                <div className="mt-4 rounded-field border border-danger-500/20 bg-danger-100/40 px-4 py-5 text-sm text-danger-500">
                  We couldn't load appointment slots right now. Please try again
                  in a moment.
                </div>
              ) : !pickerDate ? (
                <div className="mt-4 rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  Select an available date to choose a time.
                </div>
              ) : displayTimeSlots.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {displayTimeSlots.map((slot) => (
                    <button
                      aria-pressed={slot.isSelected}
                      className={cn(
                        "flex min-h-12 items-center justify-center rounded-field border px-4 py-3 text-sm font-semibold transition-colors",
                        slot.isSelected
                          ? "border-brand-blue-600 bg-brand-blue-50 text-brand-blue-700 shadow-soft"
                          : slot.isDisabled
                            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                            : "border-slate-200 bg-white text-slate-700 hover:border-brand-blue-300 hover:text-brand-blue-700",
                      )}
                      disabled={slot.isDisabled}
                      key={slot.label}
                      onClick={() => onDraftTimeChange(slot.id)}
                      type="button"
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No future appointment times are available for the selected
                  date.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <SelectionSummary
          selectedBranch={selectedBranch}
          summaryDate={summaryDate}
          summaryTime={summaryTime}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={onBack}
          className="w-full md:w-xs"
          size="lg"
          variant="secondary"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          {isAvailabilityRefreshing ? (
            <span className="text-sm text-slate-500">
              Refreshing availability...
            </span>
          ) : null}
          <Button
            disabled={!committedDate || !committedTime}
            className="w-full md:w-xs"
            onClick={onContinue}
            size="lg"
          >
            Continue to Details
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
