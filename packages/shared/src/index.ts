import { z } from "zod";

export const branchTimezone = "Africa/Johannesburg";

export const purposeOfVisitOptions = [
  { label: "Account support", value: "account-support" },
  { label: "Card collection", value: "card-collection" },
  { label: "Document update", value: "document-update" },
  { label: "Loan or credit enquiry", value: "loan-credit-enquiry" },
  { label: "General branch help", value: "general-branch-help" },
] as const;

export const bookingDetailsSchema = z.object({
  additionalNotes: z
    .string()
    .max(500, "Keep additional notes under 500 characters")
    .transform((value) => value.trim())
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address"),
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(8, "Enter a reachable phone number"),
  purposeOfVisit: z.enum(
    purposeOfVisitOptions.map((option) => option.value) as [
      (typeof purposeOfVisitOptions)[number]["value"],
      ...(typeof purposeOfVisitOptions)[number]["value"][],
    ],
  ),
});

export const branchSummarySchema = z.object({
  address: z.string(),
  city: z.string(),
  directionsUrl: z.string().url(),
  distanceKm: z.number().nullable(),
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
  nextAvailableDate: z.string().nullable(),
  operatingSummary: z.string(),
  phone: z.string(),
  postalCode: z.string(),
  province: z.string(),
  slug: z.string(),
  timezone: z.string(),
});

export const branchesResponseSchema = z.object({
  items: z.array(branchSummarySchema),
});

export const availabilitySlotSchema = z.object({
  endsAt: z.string(),
  id: z.string(),
  isAvailable: z.boolean(),
  label: z.string(),
  startsAt: z.string(),
});

export const availabilityDaySchema = z.object({
  date: z.string(),
  slots: z.array(availabilitySlotSchema),
});

export const branchAvailabilitySchema = z.object({
  branchId: z.string(),
  days: z.array(availabilityDaySchema),
  month: z.string(),
  timezone: z.string(),
});

export const createBookingRequestSchema = bookingDetailsSchema.extend({
  slotId: z.string().min(1, "Choose an appointment time"),
});

export const bookingConfirmationSchema = z.object({
  bookedAt: z.string(),
  branch: branchSummarySchema,
  confirmationCode: z.string(),
  details: bookingDetailsSchema,
  selectedDate: z.string(),
  selectedTime: z.string(),
  slotId: z.string(),
});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type BookingDetails = z.infer<typeof bookingDetailsSchema>;
export type BranchSummary = z.infer<typeof branchSummarySchema>;
export type BranchesResponse = z.infer<typeof branchesResponseSchema>;
export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;
export type AvailabilityDay = z.infer<typeof availabilityDaySchema>;
export type BranchAvailability = z.infer<typeof branchAvailabilitySchema>;
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
export type BookingConfirmation = z.infer<typeof bookingConfirmationSchema>;
export type ApiErrorPayload = z.infer<typeof apiErrorSchema>;
