import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateBookingRequest } from "@appointment/shared";
import { isAfter, parseISO, startOfMonth } from "date-fns";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { createBooking, getBranchAvailability } from "../../../api/branches";
import { ApiError } from "../../../api/client";
import {
  bookingDetailsSchema,
} from "../schemas/booking-details-schema";
import type {
  AvailabilityMonth,
  BookingDetailsValues,
  BranchLocation,
  ConfirmedBooking,
  TimeSlotOption,
} from "../types";
import {
  getDaySlots,
  getMonthKey,
  isDateInAvailabilityMonth,
} from "../utils/availability";
import {
  createCalendarInvite,
} from "../utils/booking-confirmation";
import {
  getDefaultVisibleMonth,
} from "../utils/booking-wizard-constants";

type UseBookingWizardProps = {
  branches: BranchLocation[];
};

const scrollToTop = () => {
  window.scrollTo({ behavior: "smooth", top: 0 });
};

export const useBookingWizard = ({ branches }: UseBookingWizardProps) => {
  const [dateTimeError, setDateTimeError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedTimeLabel, setSelectedTimeLabel] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftSlotId, setDraftSlotId] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()));
  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBooking | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const detailsForm = useForm<BookingDetailsValues>({
    defaultValues: {
      additionalNotes: "",
      email: "",
      fullName: "",
      phone: "",
      purposeOfVisit: "",
    },
    resolver: zodResolver(bookingDetailsSchema),
  });
  const liveDetails = useWatch({
    control: detailsForm.control,
  });

  const selectedBranch =
    branches.find((branch) => branch.id === selectedBranchId) ?? null;
  const visibleMonthKey = getMonthKey(visibleMonth);
  const availabilityQuery = useQuery({
    enabled: Boolean(selectedBranch),
    queryFn: () => getBranchAvailability(selectedBranch!.id, visibleMonthKey),
    queryKey: ["branch-availability", selectedBranch?.id, visibleMonthKey],
  });
  const availability: AvailabilityMonth | null = availabilityQuery.data ?? null;
  const committedDate = selectedDate;
  const committedTime = selectedTimeLabel;
  const pickerDate = draftDate || committedDate;
  const pickerTimeSlots =
    pickerDate && isDateInAvailabilityMonth(availability, pickerDate)
      ? getDaySlots(availability, pickerDate)
      : [];
  const isSelectableSlot = (slot: TimeSlotOption | null) =>
    Boolean(slot?.isAvailable) &&
    Boolean(slot && isAfter(parseISO(slot.startsAt), new Date()));
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
  });

  const isSlotSelectionError = (error: unknown): error is ApiError =>
    error instanceof ApiError &&
    [
      "slot_blocked",
      "slot_expired",
      "slot_not_found",
      "slot_taken",
      "slot_unavailable",
    ].includes(error.code ?? "");

  const handleBranchSelection = (branch: BranchLocation) => {
    setDateTimeError(null);
    setSelectedBranchId(branch.id);
    setVisibleMonth(getDefaultVisibleMonth(branch));
    setSelectedDate("");
    setSelectedSlotId("");
    setSelectedTimeLabel("");
    setDraftDate("");
    setDraftSlotId("");
    setSubmissionError(null);
  };

  const handleDateSelection = (dateKey: string) => {
    setDateTimeError(null);
    setDraftDate(dateKey);
    setDraftSlotId("");
    setSelectedDate(dateKey);
    setSelectedSlotId("");
    setSelectedTimeLabel("");

    if (!dateKey) {
      return;
    }

    setVisibleMonth(startOfMonth(parseISO(dateKey)));
  };

  const handleDraftTimeChange = (value: string) => {
    setDateTimeError(null);
    setDraftSlotId(value);

    const slot = pickerTimeSlots.find((candidate) => candidate.id === value) ?? null;

    if (!draftDate || !slot || !isSelectableSlot(slot)) {
      return;
    }

    setSelectedDate(draftDate);
    setSelectedSlotId(slot.id);
    setSelectedTimeLabel(slot.label);
  };

  const handleContinueToSchedule = () => {
    if (!selectedBranch) {
      return;
    }

    setDateTimeError(null);
    if (!committedDate) {
      setVisibleMonth(getDefaultVisibleMonth(selectedBranch));
      setDraftDate("");
      setDraftSlotId("");
    } else {
      setDraftDate(committedDate);
      setDraftSlotId(selectedSlotId);
      setVisibleMonth(startOfMonth(parseISO(committedDate)));
    }

    setCurrentStep(1);
    scrollToTop();
  };

  const handleBackToBranchSelection = () => {
    setDateTimeError(null);
    setCurrentStep(0);
    scrollToTop();
  };

  const handleContinueToDetails = () => {
    if (!selectedBranch || !committedDate || !committedTime || !selectedSlotId) {
      return;
    }

    setDateTimeError(null);
    setCurrentStep(2);
    scrollToTop();
  };

  const handleBackToDateTime = () => {
    setCurrentStep(1);
    scrollToTop();
  };

  const handleConfirmAppointment = detailsForm.handleSubmit(async (values: BookingDetailsValues) => {
    if (!selectedBranch || !committedDate || !committedTime || !selectedSlotId) {
      return;
    }

    setSubmissionError(null);

    try {
      const booking = await createBookingMutation.mutateAsync({
        ...values,
        purposeOfVisit:
          values.purposeOfVisit as CreateBookingRequest["purposeOfVisit"],
        slotId: selectedSlotId,
      });

      setConfirmedBooking(booking);
      setCurrentStep(3);
      scrollToTop();
    } catch (error) {
      if (isSlotSelectionError(error)) {
        setSubmissionError(null);
        setDateTimeError(error.message);
        setDraftDate(committedDate);
        setDraftSlotId("");
        setSelectedSlotId("");
        setSelectedTimeLabel("");
        await availabilityQuery.refetch();
        setCurrentStep(1);
        scrollToTop();
        return;
      }

      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We couldn't confirm the appointment. Please try again.",
      );
    }
  });

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) {
      return;
    }

    const invite = createCalendarInvite(confirmedBooking);
    const blob = new Blob([invite], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${confirmedBooking.confirmationCode.toLowerCase()}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  const handleBookAnotherAppointment = () => {
    detailsForm.reset();
    setConfirmedBooking(null);
    setDraftDate("");
    setDraftSlotId("");
    setDateTimeError(null);
    setSelectedDate("");
    setSelectedSlotId("");
    setSelectedTimeLabel("");
    setSubmissionError(null);
    setCurrentStep(0);
    scrollToTop();
  };

  return {
    availabilityQuery,
    committedDate,
    committedTime,
    confirmedBooking,
    currentStep,
    dateTimeError,
    detailsForm,
    draftSlotId,
    handleBackToBranchSelection,
    handleBackToDateTime,
    handleBookAnotherAppointment,
    handleBranchSelection,
    handleConfirmAppointment,
    handleContinueToDetails,
    handleContinueToSchedule,
    handleDateSelection,
    handleDownloadCalendar,
    handleDraftTimeChange,
    handlePrintConfirmation,
    isSubmitting: createBookingMutation.isPending,
    liveDetails,
    pickerDate,
    pickerTimeSlots,
    selectedBranch,
    submissionError,
  };
};
