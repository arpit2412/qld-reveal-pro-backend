import { pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  city: text("city"),
  state: text("state"),
  zipcode: text("zipcode"),
  country: text("country").default("Australia"),
  created_at: timestamp("created_at").defaultNow(),
});
