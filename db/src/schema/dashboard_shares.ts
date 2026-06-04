import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const dashboardSharesTable = pgTable("dashboard_shares", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DashboardShare = typeof dashboardSharesTable.$inferSelect;
