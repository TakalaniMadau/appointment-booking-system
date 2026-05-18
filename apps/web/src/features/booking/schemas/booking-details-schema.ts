import { z } from "zod";

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
  purposeOfVisit: z.string().min(1, "Select the purpose of the visit"),
});
