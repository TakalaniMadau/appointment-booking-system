import { format, parseISO } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { AvailabilityMonth, BranchLocation } from "../types";
import { formatWindowSummary } from "../utils/availability";
import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  LocationPinIcon,
} from "./icons";
import { SummaryTile } from "./summary-tile";

type SelectionSummaryProps = {
  availability: AvailabilityMonth | null;
  committedDate: string;
  committedTime: string;
  selectedBranch: BranchLocation;
};

export const SelectionSummary = ({
  availability,
  committedDate,
  committedTime,
  selectedBranch,
}: SelectionSummaryProps) => (
  <Card className="h-fit">
    <CardHeader className="border-b border-slate-100 p-6">
      <CardTitle>Your Selection</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 p-6">
      <SummaryTile
        icon={<LocationPinIcon className="h-5 w-5" />}
        label="Branch"
        primary={selectedBranch.name}
        secondary={selectedBranch.address}
      />
      {committedDate ? (
        <SummaryTile
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Date"
          primary={format(parseISO(committedDate), "MMMM d, yyyy")}
          secondary={format(parseISO(committedDate), "EEEE")}
        />
      ) : null}
      {committedTime && committedDate ? (
        <SummaryTile
          icon={<ClockIcon className="h-5 w-5" />}
          label="Time"
          primary={committedTime}
          secondary={formatWindowSummary(availability, committedDate) ?? ""}
        />
      ) : null}

      <div className="rounded-field bg-slate-50 px-4 py-4 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-0.5 h-4 w-4 text-brand-blue-600" />
          <div className="space-y-2">
            <p>Please arrive 10 minutes early.</p>
            <p>Bring a valid ID to your branch visit.</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
