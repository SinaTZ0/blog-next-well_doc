import "server-only";
import { z } from "zod";

// 1️⃣ Define two schemas: one for server-only vars, one for public (NEXT_PUBLIC_…)
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
  GOOGLE_CLIENT_ID: z.string().min(1, { message: "GOOGLE_CLIENT_ID is required" }),
  GOOGLE_CLIENT_SECRET: z.string().min(1, { message: "GOOGLE_CLIENT_SECRET is required" }),
});

const clientEnvSchema = z.object({
  // NEXT_PUBLIC_API_URL: z.string().url({ message: "NEXT_PUBLIC_API_URL must be a URL" }),
  NEXT_PUBLIC_APP_URL: z.string().url({ message: "NEXT_PUBLIC_APP_URL must be a URL" }),
});

// 2️⃣ Validate now, so any mis-configuration fails at build/start
const _serverEnv = serverEnvSchema.safeParse(process.env);
if (!_serverEnv.success) {
  console.error("\n ❌ Invalid server environment variables:", _serverEnv.error.format());
  process.exit(1);
}

const _publicEnv = clientEnvSchema.safeParse(process.env);
if (!_publicEnv.success) {
  console.error("\n ❌ Invalid client environment variables:", _publicEnv.error.format());
  process.exit(1);
}

// 3️⃣ Export two objects for use throughout your app
export const serverEnv = _serverEnv.data;

export type ClientEnv = z.infer<typeof clientEnvSchema>;
