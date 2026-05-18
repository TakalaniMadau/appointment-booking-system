import { format } from "date-fns";

import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Select } from "../../../components/ui/select";
import type { BranchLocation, CalendarDay } from "../types";
import { SelectionSummary } from "./selection-summary";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./icons";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type DateTimeStepProps = {
  activeMonth: Date;
  calendarDays: CalendarDay[];
  canApplySchedule: boolean;
  canMoveToNextMonth: boolean;
  canMoveToPreviousMonth: boolean;
  committedDate: string;
  committedTime: string;
  draftTime: string;
  pickerDate: string;
  pickerTimeSlots: string[];
  selectedBranch: BranchLocation;
  onApply: () => void;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
  onDateSelect: (dateKey: string) => void;
  onDraftTimeChange: (value: string) => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
};

export const DateTimeStep = ({
  activeMonth,
  calendarDays,
  canApplySchedule,
  canMoveToNextMonth,
  canMoveToPreviousMonth,
  committedDate,
  committedTime,
  draftTime,
  pickerDate,
  pickerTimeSlots,
  selectedBranch,
  onApply,
  onBack,
  onCancel,
  onContinue,
  onDateSelect,
  onDraftTimeChange,
  onNextMonth,
  onPreviousMonth,
}: DateTimeStepProps) => (
  <>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <Card>
        <CardHeader className="border-b border-slate-100 p-6">
          <CardTitle>Select Date &amp; Time</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Button
              disabled={!canMoveToPreviousMonth}
              onClick={onPreviousMonth}
              size="sm"
              variant="ghost"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <p className="flex-1 text-center text-2xl font-semibold text-slate-900">
              {format(activeMonth, "MMMM yyyy")}
            </p>
            <Button
              disabled={!canMoveToNextMonth}
              onClick={onNextMonth}
              size="sm"
              variant="ghost"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-medium text-slate-500">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-4">
            {calendarDays.map((day) => (
              <button
                className={cn(
                  "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                  day.dateKey === pickerDate
                    ? "bg-brand-blue-600 text-white shadow-action"
                    : day.isAvailable && day.isCurrentMonth && !day.isPast
                      ? "text-slate-900 hover:bg-brand-blue-50 hover:text-brand-blue-700"
                      : day.isCurrentMonth
                        ? "text-slate-300"
                        : "text-slate-300/80",
                )}
                disabled={!day.isAvailable || !day.isCurrentMonth || day.isPast}
                key={day.dateKey}
                onClick={() => onDateSelect(day.dateKey)}
                type="button"
              >
                {format(day.date, "d")}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-base font-semibold text-slate-900">Time</p>

            {!pickerDate ? (
              <div className="mt-4 rounded-field border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Select an available date to choose a time.
              </div>
            ) : pickerTimeSlots.length > 0 ? (
              <>
                <div className="mt-4 space-y-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-500">
                      Time
                    </label>
                    <Select
                      className="h-10 text-sm"
                      onChange={(event) => onDraftTimeChange(event.target.value)}
                      value={draftTime}
                    >
                      <option disabled value="">
                        Select a time
                      </option>
                      {pickerTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button onClick={onCancel} size="lg" variant="secondary">
                    Cancel
                  </Button>
                  <Button disabled={!canApplySchedule} onClick={onApply} size="lg">
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
      <Button
        disabled={!committedDate || !committedTime}
        onClick={onContinue}
        size="lg"
      >
        Continue to Details
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  </>
);
