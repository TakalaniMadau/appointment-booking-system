import { format, parseISO } from "date-fns";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import type { ConfirmedBooking } from "../types";
import { appointmentReminders } from "../utils/booking-wizard-constants";
import { getPurposeLabel } from "../utils/booking-confirmation";
import { ConfirmationRow } from "./confirmation-row";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  InfoIcon,
  LocationPinIcon,
  NoteIcon,
  PrinterIcon,
  UserIcon,
} from "./icons";

type ConfirmationStepProps = {
  booking: ConfirmedBooking;
  onBookAnotherAppointment: () => void;
  onDownloadCalendar: () => void;
  onPrintConfirmation: () => void;
};

export const ConfirmationStep = ({
  booking,
  onBookAnotherAppointment,
  onDownloadCalendar,
  onPrintConfirmation,
}: ConfirmationStepProps) => (
  <Card>
    <CardContent className="space-y-8 p-6 text-center sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-500">
        <CheckCircleIcon className="h-8 w-8" />
      </div>

      <div className="space-y-3">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
          Appointment Confirmed!
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
          Your appointment has been successfully scheduled. A confirmation email
          has been sent.
        </p>
      </div>

      <div className="rounded-card border border-brand-blue-200 bg-brand-blue-50 p-6 text-left">
        <h3 className="text-center text-2xl font-semibold text-slate-900">
          Appointment Details Summary
        </h3>

        <div className="mt-6 divide-y divide-brand-blue-200">
          <ConfirmationRow
            icon={<LocationPinIcon className="h-5 w-5" />}
            label="Location"
            primary={booking.branch.name}
            secondary={booking.branch.address}
          />
          <ConfirmationRow
            icon={<CalendarIcon className="h-5 w-5" />}
            label="Date & Time"
            primary={`${format(parseISO(booking.selectedDate), "EEEE, MMMM d, yyyy")} at ${booking.selectedTime}`}
            secondary={`Confirmation code: ${booking.confirmationCode}`}
          />
          <ConfirmationRow
            icon={<UserIcon className="h-5 w-5" />}
            label="Contact Information"
            primary={booking.details.fullName}
            secondary={`${booking.details.email} | ${booking.details.phone}`}
          />
          <ConfirmationRow
            icon={<NoteIcon className="h-5 w-5" />}
            label="Purpose"
            primary={getPurposeLabel(booking.details.purposeOfVisit)}
            secondary={
              booking.details.additionalNotes ||
              "No additional notes were added."
            }
          />
        </div>
      </div>

      <div className="rounded-card border border-warning-400/60 bg-warning-50 p-5 text-left">
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-1 h-5 w-5 text-warning-400" />
          <div className="space-y-2">
            <p className="font-semibold text-slate-900">Important Reminders:</p>
            <ul className="space-y-2 pl-4 text-sm leading-6 text-slate-700">
              {appointmentReminders.map((reminder) => (
                <li key={reminder}>{reminder}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onDownloadCalendar} size="lg">
          <CalendarPlusIcon className="h-4 w-4" />
          Add to Calendar
        </Button>
        <Button onClick={onPrintConfirmation} size="lg" variant="secondary">
          <PrinterIcon className="h-4 w-4" />
          Print Confirmation
        </Button>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <button
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue-600 transition-colors hover:text-brand-blue-700"
          onClick={onBookAnotherAppointment}
          type="button"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Book Another Appointment
        </button>
      </div>
    </CardContent>
  </Card>
);
