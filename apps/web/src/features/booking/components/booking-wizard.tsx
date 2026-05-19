import { format, parseISO } from "date-fns";
import { useRef } from "react";

import { BookingStepper } from "./booking-stepper";
import { BranchSelectionStep } from "./branch-selection-step";
import { ConfirmationStep } from "./confirmation-step";
import { DateTimeStep } from "./date-time-step";
import { DetailsStep } from "./details-step";
import {
  CalendarIcon,
  ClockIcon,
  LocationPinIcon,
} from "./icons";
import { useBranchSearch } from "../hooks/use-branch-search";
import { useBookingWizard } from "../hooks/use-booking-wizard";
import type { BranchLocation } from "../types";

const EMPTY_BRANCHES: BranchLocation[] = [];

export const BookingWizard = () => {
  const {
    activeCoordinates,
    branchesQuery,
    geocodeQuery,
    isLocating,
    locationError,
    searchValue,
    updateSearchValue,
    useCurrentLocation,
  } = useBranchSearch();
  const mapFrameRef = useRef<HTMLDivElement | null>(null);
  const branches = branchesQuery.data ?? EMPTY_BRANCHES;
  const wizard = useBookingWizard({ branches });

  const toggleMapFullscreen = async () => {
    if (!mapFrameRef.current) {
      return;
    }

    if (document.fullscreenElement === mapFrameRef.current) {
      await document.exitFullscreen();
      return;
    }

    await mapFrameRef.current.requestFullscreen();
  };

  return (
    <div className="space-y-6">
      <BookingStepper currentStep={wizard.currentStep} />

      {wizard.currentStep === 0 ? (
        <BranchSelectionStep
          branches={branches}
          isBranchesFetching={branchesQuery.isFetching}
          isBranchesLoading={branchesQuery.isLoading}
          isContinueDisabled={!wizard.selectedBranch}
          isGeocodeFetching={geocodeQuery.isFetching}
          isLocating={isLocating}
          locationError={locationError}
          mapFrameRef={mapFrameRef}
          resultsLabel={`Showing branches near ${activeCoordinates.label}.`}
          searchValue={searchValue}
          selectedBranchId={wizard.selectedBranch?.id ?? null}
          showBranchesError={Boolean(branchesQuery.error)}
          onBranchSelect={wizard.handleBranchSelection}
          onContinue={wizard.handleContinueToSchedule}
          onSearchValueChange={updateSearchValue}
          onToggleMapFullscreen={toggleMapFullscreen}
          onUseCurrentLocation={useCurrentLocation}
        />
      ) : null}

      {wizard.currentStep === 1 && wizard.selectedBranch ? (
        <DateTimeStep
          availability={wizard.availabilityQuery.data ?? null}
          canApplySchedule={wizard.canApplySchedule}
          committedDate={wizard.committedDate}
          committedTime={wizard.committedTime}
          draftSlotId={wizard.draftSlotId}
          dateTimeError={wizard.dateTimeError}
          isAvailabilityLoading={wizard.availabilityQuery.isLoading}
          isAvailabilityRefreshing={wizard.availabilityQuery.isFetching}
          pickerDate={wizard.pickerDate}
          pickerTimeSlots={wizard.pickerTimeSlots}
          selectedBranch={wizard.selectedBranch}
          showAvailabilityError={Boolean(wizard.availabilityQuery.error)}
          onApply={wizard.handleApplySchedule}
          onBack={wizard.handleBackToBranchSelection}
          onCancel={wizard.handleCancelSchedule}
          onContinue={wizard.handleContinueToDetails}
          onDateSelect={wizard.handleDateSelection}
          onDraftTimeChange={wizard.handleDraftTimeChange}
        />
      ) : null}

      {wizard.currentStep === 2 && wizard.selectedBranch ? (
        <DetailsStep
          detailsForm={wizard.detailsForm}
          isSubmitting={wizard.isSubmitting}
          onBack={wizard.handleBackToDateTime}
          onSubmit={wizard.handleConfirmAppointment}
          submissionError={wizard.submissionError}
        />
      ) : null}

      {wizard.currentStep === 3 && wizard.confirmedBooking ? (
        <ConfirmationStep
          booking={wizard.confirmedBooking}
          onBookAnotherAppointment={wizard.handleBookAnotherAppointment}
          onDownloadCalendar={wizard.handleDownloadCalendar}
          onPrintConfirmation={wizard.handlePrintConfirmation}
        />
      ) : null}

      {wizard.currentStep < 3 && wizard.selectedBranch ? (
        <div className="rounded-card border border-slate-200 bg-white px-4 py-4 shadow-soft sm:px-5">
          <div className="flex flex-col gap-4 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <span className="inline-flex items-center gap-2">
                <LocationPinIcon className="h-4 w-4 text-brand-blue-600" />
                {wizard.selectedBranch.name}
              </span>
              {wizard.committedDate ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-brand-blue-600" />
                  {format(parseISO(wizard.committedDate), "EEE, d MMM")}
                </span>
              ) : null}
              {wizard.committedTime ? (
                <span className="inline-flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-brand-blue-600" />
                  {wizard.committedTime}
                </span>
              ) : null}
            </div>

            {wizard.currentStep === 2 ? (
              <span className="text-slate-500">
                {wizard.liveDetails?.fullName
                  ? `Preparing the booking for ${wizard.liveDetails.fullName}.`
                  : "Add your contact details to complete the appointment."}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
