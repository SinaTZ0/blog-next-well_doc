import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/drizzle/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   google: {
  //     clientId: serverEnv.GOOGLE_CLIENT_ID,
  //     clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
  //   },
  // },
  session: {
    updateAge: 1,
  },
});
