import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, startOfMonth } from "date-fns";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  bookingDetailsSchema,
} from "../schemas/booking-details-schema";
import type {
  BookingDetailsValues,
  BranchLocation,
  ConfirmedBooking,
} from "../types";
import {
  buildCalendarDays,
  buildTimeSlots,
  getAvailableMonths,
} from "../utils/availability";
import {
  createCalendarInvite,
  createConfirmationCode,
} from "../utils/booking-confirmation";
import { getDefaultVisibleMonth } from "../utils/booking-wizard-constants";

type UseBookingWizardProps = {
  branches: BranchLocation[];
};

const scrollToTop = () => {
  window.scrollTo({ behavior: "smooth", top: 0 });
};

export const useBookingWizard = ({ branches }: UseBookingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBranchSlug, setSelectedBranchSlug] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()));
  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBooking | null>(null);

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
    branches.find((branch) => branch.slug === selectedBranchSlug) ??
    branches[0] ??
    null;
  const availableMonths = selectedBranch
    ? getAvailableMonths(selectedBranch)
    : [];
  const committedDate =
    selectedBranch &&
    selectedDate &&
    buildTimeSlots(selectedBranch, selectedDate).length > 0
      ? selectedDate
      : "";
  const committedTimeSlots =
    selectedBranch && committedDate
      ? buildTimeSlots(selectedBranch, committedDate)
      : [];
  const committedTime =
    selectedTime && committedTimeSlots.includes(selectedTime)
      ? selectedTime
      : "";
  const pickerDate =
    selectedBranch &&
    draftDate &&
    buildTimeSlots(selectedBranch, draftDate).length > 0
      ? draftDate
      : committedDate;
  const pickerTimeSlots =
    selectedBranch && pickerDate
      ? buildTimeSlots(selectedBranch, pickerDate)
      : [];
  const initialVisibleMonth = selectedBranch
    ? getDefaultVisibleMonth(selectedBranch)
    : startOfMonth(new Date());
  const activeMonth =
    selectedBranch && !availableMonths.includes(format(visibleMonth, "yyyy-MM"))
      ? initialVisibleMonth
      : visibleMonth;
  const calendarDays = selectedBranch
    ? buildCalendarDays(selectedBranch, activeMonth)
    : [];
  const visibleMonthKey = format(activeMonth, "yyyy-MM");
  const visibleMonthIndex = availableMonths.indexOf(visibleMonthKey);
  const canMoveToPreviousMonth = visibleMonthIndex > 0;
  const canMoveToNextMonth =
    visibleMonthIndex > -1 && visibleMonthIndex < availableMonths.length - 1;
  const canApplySchedule = Boolean(draftDate);

  const handleBranchSelection = (branch: BranchLocation) => {
    setSelectedBranchSlug(branch.slug);
    setVisibleMonth(getDefaultVisibleMonth(branch));
    setSelectedDate("");
    setSelectedTime("");
    setDraftDate("");
    setDraftTime("");
  };

  const handleDateSelection = (dateKey: string) => {
    if (!selectedBranch) {
      return;
    }

    setDraftDate(dateKey);
    setDraftTime("");
  };

  const handleDraftTimeChange = (value: string) => {
    setDraftTime(value);
  };

  const handleMoveToPreviousMonth = () => {
    if (!canMoveToPreviousMonth) {
      return;
    }

    setVisibleMonth(parseISO(`${availableMonths[visibleMonthIndex - 1]}-01`));
  };

  const handleMoveToNextMonth = () => {
    if (!canMoveToNextMonth) {
      return;
    }

    setVisibleMonth(parseISO(`${availableMonths[visibleMonthIndex + 1]}-01`));
  };

  const handleApplySchedule = () => {
    if (!draftDate) {
      return;
    }

    setSelectedDate(draftDate);
    setSelectedTime(draftTime);
  };

  const handleCancelSchedule = () => {
    setDraftDate(committedDate);
    setDraftTime(committedTime);
    setVisibleMonth(
      committedDate
        ? startOfMonth(parseISO(committedDate))
        : initialVisibleMonth,
    );
  };

  const handleContinueToSchedule = () => {
    if (!selectedBranch) {
      return;
    }

    if (!committedDate) {
      setVisibleMonth(getDefaultVisibleMonth(selectedBranch));
      setDraftDate("");
      setDraftTime("");
    } else {
      setDraftDate(committedDate);
      setDraftTime(committedTime);
      setVisibleMonth(
        committedDate ? startOfMonth(parseISO(committedDate)) : activeMonth,
      );
    }

    setCurrentStep(1);
    scrollToTop();
  };

  const handleBackToBranchSelection = () => {
    setCurrentStep(0);
    scrollToTop();
  };

  const handleContinueToDetails = () => {
    if (!selectedBranch || !committedDate || !committedTime) {
      return;
    }

    setCurrentStep(2);
    scrollToTop();
  };

  const handleBackToDateTime = () => {
    setCurrentStep(1);
    scrollToTop();
  };

  const handleConfirmAppointment = detailsForm.handleSubmit((values) => {
    if (!selectedBranch || !committedDate || !committedTime) {
      return;
    }

    setConfirmedBooking({
      bookedAt: new Date().toISOString(),
      branch: selectedBranch,
      confirmationCode: createConfirmationCode(),
      details: values,
      selectedDate: committedDate,
      selectedTime: committedTime,
    });
    setCurrentStep(3);
    scrollToTop();
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
    setDraftTime("");
    setCurrentStep(0);
    scrollToTop();
  };

  return {
    activeMonth,
    calendarDays,
    canApplySchedule,
    canMoveToNextMonth,
    canMoveToPreviousMonth,
    committedDate,
    committedTime,
    confirmedBooking,
    currentStep,
    detailsForm,
    draftDate,
    draftTime,
    handleApplySchedule,
    handleBackToBranchSelection,
    handleBackToDateTime,
    handleBookAnotherAppointment,
    handleBranchSelection,
    handleCancelSchedule,
    handleConfirmAppointment,
    handleContinueToDetails,
    handleContinueToSchedule,
    handleDateSelection,
    handleDownloadCalendar,
    handleDraftTimeChange,
    handleMoveToNextMonth,
    handleMoveToPreviousMonth,
    handlePrintConfirmation,
    liveDetails,
    pickerDate,
    pickerTimeSlots,
    selectedBranch,
    selectedBranchSlug,
    selectedDate,
    selectedTime,
  };
};
