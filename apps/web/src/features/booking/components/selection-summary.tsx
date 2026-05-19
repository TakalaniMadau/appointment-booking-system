import { format, parseISO } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { BranchLocation } from "../types";
import {
  CalendarIcon,
  ClockIcon,
  LocationPinIcon,
} from "./icons";
import { SummaryTile } from "./summary-tile";

type SelectionSummaryProps = {
  selectedBranch: BranchLocation;
  summaryDate: string;
  summaryTime: string;
};

export const SelectionSummary = ({
  selectedBranch,
  summaryDate,
  summaryTime,
}: SelectionSummaryProps) => (
  <Card className="h-fit">
    <CardHeader className="border-b border-slate-100 p-6">
      <CardTitle>Your Selection</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 p-6">
      {!summaryDate && !summaryTime ? (
        <p className="text-sm leading-6 text-slate-500">
          Select a date and time to preview your appointment.
        </p>
      ) : null}
      <SummaryTile
        icon={<LocationPinIcon className="h-5 w-5" />}
        label="Branch"
        primary={selectedBranch.name}
        secondary={selectedBranch.address}
      />
      {summaryDate ? (
        <SummaryTile
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Date"
          primary={format(parseISO(summaryDate), "MMMM d, yyyy")}
          secondary={format(parseISO(summaryDate), "EEEE")}
        />
      ) : null}
      {summaryTime ? (
        <SummaryTile
          icon={<ClockIcon className="h-5 w-5" />}
          label="Time"
          primary={summaryTime}
        />
      ) : null}
    </CardContent>
  </Card>
);
