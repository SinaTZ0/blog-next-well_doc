import "server-only";

import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", (t) => ({
  id: t.serial().primaryKey(),
  message: t.text().notNull(),
  createdAt: t.timestamp().default(sql`now()`),
}));
