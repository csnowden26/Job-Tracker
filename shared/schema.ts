import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const STATUSES = [
  "Bookmarked",
  "Applied",
  "Phone Screen",
  "Interviewing",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export const INTEREST_LEVELS = ["High", "Medium", "Low"] as const;

export const prospects = pgTable("prospects", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  roleTitle: text("role_title").notNull(),
  jobUrl: text("job_url"),
  status: text("status").notNull().default("Bookmarked"),
  interestLevel: text("interest_level").notNull().default("Medium"),
  salary: text("salary").notNull().default(""),
  contactName: text("contact_name").notNull().default(""),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProspectSchema = createInsertSchema(prospects).omit({
  id: true,
  createdAt: true,
}).extend({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  status: z.enum(STATUSES).default("Bookmarked"),
  interestLevel: z.enum(INTEREST_LEVELS).default("Medium"),
  salary: z.string().min(1, "Salary is required"),
  jobUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  contactName: z.string().min(1, "Point of contact name is required"),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
}).refine(
  (data) => {
    const phone = data.contactPhone?.trim() ?? "";
    const email = data.contactEmail?.trim() ?? "";
    return phone.length > 0 || email.length > 0;
  },
  {
    message: "At least one contact method (phone or email) is required",
    path: ["contactPhone"],
  }
);

export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type Prospect = typeof prospects.$inferSelect;
