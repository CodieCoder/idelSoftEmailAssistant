import { z } from "zod";

export const ComposeEmailSchema = z.object({
  subject: z.string().min(5),
  body: z.string().min(10),
  to: z.string().email(),
  bcc: z.string().optional().nullable().default(null),
  cc: z.string().optional().nullable().default(null),
});
