// import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { serverEnv } from "@/env";

export const db = drizzle(serverEnv.DATABASE_URL, {
  schema,
  casing: "snake_case",
});
