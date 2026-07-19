import z from "zod";

export const appConfigSchema = z.object({
  apiUrl: z.url().optional(),
  environment: z.enum(["development", "staging", "production"]),
  debug: z.boolean().optional()
});

export type AppConfig = z.infer<typeof appConfigSchema>;
