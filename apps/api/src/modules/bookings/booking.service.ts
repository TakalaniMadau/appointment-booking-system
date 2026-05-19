import type { Prisma, PrismaClient } from "@prisma/client";
import type { BookingConfirmation, CreateBookingRequest } from "@appointment/shared";

import { AppError } from "../../lib/errors.js";
import { formatDateKeyInTimeZone, formatTimeLabelInTimeZone } from "../../lib/datetime.js";
import { markConfirmationEmailAsSent } from "./email-outbox.service.js";
import { getBranchSummaryById } from "../branches/branch.service.js";

const createConfirmationCode = () =>
  `APT-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now()
    .toString()
    .slice(-4)}`;

const buildConfirmationPayload = async (
  prisma: PrismaClient,
  bookingId: string,
): Promise<BookingConfirmation> => {
  const booking = await prisma.booking.findUnique({
    include: {
      branch: true,
      customer: true,
      slot: true,
    },
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new AppError({
      code: "booking_not_found",
      message: "The booking could not be found.",
      statusCode: 404,
    });
  }

  const branch = await getBranchSummaryById(prisma, booking.branchId);

  return {
    bookedAt: booking.createdAt.toISOString(),
    branch,
    confirmationCode: booking.confirmationCode,
    details: {
      additionalNotes: booking.additionalNotes ?? "",
      email: booking.customer.email,
      fullName: booking.customer.fullName,
      phone: booking.customer.phone,
      purposeOfVisit: booking.purposeOfVisit as CreateBookingRequest["purposeOfVisit"],
    },
    selectedDate: formatDateKeyInTimeZone(booking.slot.startsAt, booking.branch.timezone),
    selectedTime: formatTimeLabelInTimeZone(booking.slot.startsAt, booking.branch.timezone),
    slotId: booking.slotId,
  };
};

export const createBooking = async (
  prisma: PrismaClient,
  input: CreateBookingRequest,
) => {
  const booking = await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
    const slot = await transaction.appointmentSlot.findUnique({
      include: {
        branch: true,
      },
      where: {
        id: input.slotId,
      },
    });

    if (!slot) {
      throw new AppError({
        code: "slot_not_found",
        message: "The selected appointment slot could not be found.",
        statusCode: 404,
      });
    }

    if (slot.startsAt < new Date()) {
      throw new AppError({
        code: "slot_expired",
        message: "That appointment slot has already passed.",
        statusCode: 409,
      });
    }

    const slotUpdate = await transaction.appointmentSlot.updateMany({
      data: {
        status: "BOOKED",
      },
      where: {
        id: slot.id,
        status: "AVAILABLE",
      },
    });

    if (slotUpdate.count === 0) {
      const currentSlot = await transaction.appointmentSlot.findUnique({
        select: {
          status: true,
        },
        where: {
          id: slot.id,
        },
      });

      if (currentSlot?.status === "BOOKED") {
        throw new AppError({
          code: "slot_taken",
          message:
            "That appointment time has just been booked by someone else. Please choose another available time.",
          statusCode: 409,
        });
      }

      if (currentSlot?.status === "BLOCKED") {
        throw new AppError({
          code: "slot_blocked",
          message:
            "That appointment time is no longer available. Please choose another available time.",
          statusCode: 409,
        });
      }

      throw new AppError({
        code: "slot_unavailable",
        message:
          "That appointment time is no longer available. Please choose another available time.",
        statusCode: 409,
      });
    }

    const customer = await transaction.customer.upsert({
      create: {
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
      },
      update: {
        fullName: input.fullName,
        phone: input.phone,
      },
      where: {
        email: input.email,
      },
    });

    const createdBooking = await transaction.booking.create({
      data: {
        additionalNotes: input.additionalNotes || null,
        branchId: slot.branchId,
        confirmationCode: createConfirmationCode(),
        customerId: customer.id,
        purposeOfVisit: input.purposeOfVisit,
        slotId: slot.id,
      },
    });

    await transaction.emailOutbox.create({
      data: {
        bookingId: createdBooking.id,
        payloadJson: {
          branchName: slot.branch.name,
          fullName: input.fullName,
          purposeOfVisit: input.purposeOfVisit,
          slotId: slot.id,
          slotStartsAt: slot.startsAt.toISOString(),
        },
        subject: `Appointment confirmed for ${slot.branch.name}`,
        toEmail: input.email,
      },
    });

    return createdBooking;
  });

  await markConfirmationEmailAsSent(prisma, booking.id);

  return buildConfirmationPayload(prisma, booking.id);
};

export const getBookingByConfirmationCode = async (
  prisma: PrismaClient,
  confirmationCode: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      confirmationCode,
    },
  });

  if (!booking) {
    throw new AppError({
      code: "booking_not_found",
      message: "The booking could not be found.",
      statusCode: 404,
    });
  }

  return buildConfirmationPayload(prisma, booking.id);
};
