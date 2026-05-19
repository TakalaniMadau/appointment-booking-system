import type { FormEventHandler } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { purposeOfVisitOptions } from "../schemas/booking-details-schema";
import type { BookingDetailsValues } from "../types";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type DetailsStepProps = {
  detailsForm: UseFormReturn<BookingDetailsValues>;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submissionError: string | null;
};

const FieldError = ({ message }: { message: string | undefined }) =>
  message ? <p className="mt-2 text-sm text-danger-500">{message}</p> : null;

export const DetailsStep = ({
  detailsForm,
  isSubmitting,
  onBack,
  onSubmit,
  submissionError,
}: DetailsStepProps) => (
  <>
    <Card>
      <CardHeader className="border-b border-slate-100 p-6 sm:p-8">
        <CardTitle className="text-[2rem]">Your Information</CardTitle>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form
          className="grid gap-5"
          id="booking-details-form"
          onSubmit={onSubmit}
        >
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="fullName"
            >
              Full Name *
            </label>
            <Input
              id="fullName"
              invalid={Boolean(detailsForm.formState.errors.fullName)}
              placeholder="John Doe"
              {...detailsForm.register("fullName")}
            />
            <FieldError
              message={detailsForm.formState.errors.fullName?.message}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="email"
            >
              Email Address *
            </label>
            <Input
              id="email"
              invalid={Boolean(detailsForm.formState.errors.email)}
              placeholder="john.doe@example.com"
              type="email"
              {...detailsForm.register("email")}
            />
            <FieldError message={detailsForm.formState.errors.email?.message} />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="phone"
            >
              Phone Number *
            </label>
            <Input
              id="phone"
              invalid={Boolean(detailsForm.formState.errors.phone)}
              placeholder="082 123 4567"
              {...detailsForm.register("phone")}
            />
            <FieldError message={detailsForm.formState.errors.phone?.message} />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="purposeOfVisit"
            >
              Purpose of Visit *
            </label>
            <Select
              defaultValue=""
              id="purposeOfVisit"
              invalid={Boolean(detailsForm.formState.errors.purposeOfVisit)}
              {...detailsForm.register("purposeOfVisit")}
            >
              <option disabled value="">
                Select a purpose
              </option>
              {purposeOfVisitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FieldError
              message={detailsForm.formState.errors.purposeOfVisit?.message}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="additionalNotes"
            >
              Additional Notes (Optional)
            </label>
            <Textarea
              id="additionalNotes"
              invalid={Boolean(detailsForm.formState.errors.additionalNotes)}
              placeholder="Any specific requirements or questions..."
              {...detailsForm.register("additionalNotes")}
            />
            <FieldError
              message={detailsForm.formState.errors.additionalNotes?.message}
            />
          </div>

          {submissionError ? (
            <div className="rounded-field border border-danger-500/20 bg-danger-100/40 px-4 py-3 text-sm text-danger-500">
              {submissionError}
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>

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
      <Button
        disabled={isSubmitting}
        form="booking-details-form"
        size="lg"
        type="submit"
      >
        {isSubmitting ? "Confirming Appointment..." : "Review Appointment"}
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  </>
);
