import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const settingsFormSchema = z.object({
  locations: z.array(z.object({
    address: z.array(z.string().min(1, "Address line is required")),
    gettingHere: z.object({
      steps: z.array(z.string().min(1, "Step is required")),
      mapEmbedSrc: z.string().url("Must be a valid URL"),
    }),
    phoneNumbers: z.array(
      z.string().regex(/^\+\d{1,4} \d{5} \d{5}$/, "Phone number must be in format +CC 12345 67890")
    ),
    emails: z.array(z.string().email("Invalid email address")),
    openingHours: z.string().min(1, "Opening hours are required"),
  })).min(1, "At least one location is required"),
});
