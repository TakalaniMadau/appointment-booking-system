import { purposeOfVisitOptions } from "@appointment/shared";
import { z } from "zod";

export { purposeOfVisitOptions };

export const bookingDetailsSchema = z.object({
  additionalNotes: z
    .string()
    .max(500, "Keep additional notes under 500 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address"),
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(8, "Enter a reachable phone number"),
  purposeOfVisit: z.string().min(1, "Select the purpose of the visit"),
});
