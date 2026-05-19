import type { ComponentType, SVGProps } from "react";

import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import type { BookingStepKey } from "../utils/booking-wizard-constants";
import { stepDefinitions } from "../utils/booking-wizard-constants";
import { CalendarIcon, CheckIcon, LocationPinIcon, UserIcon } from "./icons";

type BookingStepperProps = {
  currentStep: number;
};

const stepIcons: Record<
  BookingStepKey,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  "branch-selection": LocationPinIcon,
  confirmation: CheckIcon,
  "date-time": CalendarIcon,
  details: UserIcon,
};

export const BookingStepper = ({ currentStep }: BookingStepperProps) => (
  <Card>
    <CardContent className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        {stepDefinitions.map((step, index) => {
          const state =
            index < currentStep
              ? "complete"
              : index === currentStep
                ? "current"
                : "upcoming";
          const StepIcon = stepIcons[step.key];

          return (
            <div
              className="relative flex flex-col items-center gap-3"
              key={step.key}
            >
              {index < stepDefinitions.length - 1 ? (
                <span
                  className={cn(
                    "absolute left-8 top-5 h-[3px] w-[calc(100%--3rem)] md:w-[calc(100%--18rem)] md:w-[calc(100%--9rem)] lg:w-[calc(100%--12rem)] xl:w-[calc(100%--19rem)] rounded-full",
                    index < currentStep ? "bg-brand-blue-600" : "bg-slate-200",
                  )}
                />
              ) : null}

              <div
                className={cn(
                  "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm",
                  state === "complete"
                    ? "border-brand-blue-600 bg-brand-blue-600 text-white"
                    : state === "current"
                      ? "border-brand-blue-600 bg-brand-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-400",
                )}
              >
                <StepIcon className="h-4 w-4" />
              </div>

              <div className="hidden space-y-1 sm:block">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    state === "upcoming"
                      ? "text-slate-400"
                      : "text-brand-blue-600",
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
