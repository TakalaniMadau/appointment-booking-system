import { format, parseISO } from "date-fns";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import type {
  AvailabilityMonth,
  BranchLocation,
  TimeSlotOption,
} from "../types";
import { SelectionSummary } from "./selection-summary";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type DateTimeStepProps = {
  availability: AvailabilityMonth | null;
  canApplySchedule: boolean;
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
  onApply: () => void;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
  onDateSelect: (dateKey: string) => void;
  onDraftTimeChange: (value: string) => void;
};

export const DateTimeStep = ({
  availability,
  canApplySchedule,
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
  onApply,
  onBack,
  onCancel,
  onContinue,
  onDateSelect,
  onDraftTimeChange,
}: DateTimeStepProps) => {
  const dateFieldValue = pickerDate || "";
  const selectedDateSummary = pickerDate
    ? format(parseISO(pickerDate), "EEEE, d MMMM yyyy")
    : "Choose a preferred date and we'll load the available appointment times for that day.";
  const minimumDate = format(new Date(), "yyyy-MM-dd");

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
              <p className="text-base font-semibold text-slate-900">Time</p>

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
              ) : pickerTimeSlots.length > 0 ? (
                <>
                  <div className="mt-4 space-y-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-500">
                        Select time slot
                      </label>
                      <Select
                        className="h-10 text-sm"
                        onChange={(event) =>
                          onDraftTimeChange(event.target.value)
                        }
                        value={draftSlotId}
                      >
                        <option disabled value="">
                          Select a time
                        </option>
                        {pickerTimeSlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Button onClick={onCancel} size="lg" variant="secondary">
                      Cancel
                    </Button>
                    <Button
                      disabled={!canApplySchedule}
                      onClick={onApply}
                      size="lg"
                    >
                      Apply
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-4 rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No appointment times are available for the selected date yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <SelectionSummary
          availability={availability}
          committedDate={committedDate}
          committedTime={committedTime}
          selectedBranch={selectedBranch}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={onBack} size="lg" variant="secondary">
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
