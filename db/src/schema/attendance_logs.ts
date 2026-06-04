import { pgTable, serial, text, date, unique } from "drizzle-orm/pg-core";

export const attendanceLogsTable = pgTable(
  "attendance_logs",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    date: date("date").notNull(),
  },
  (t) => [unique("attendance_logs_user_date_unique").on(t.userId, t.date)]
);

export type AttendanceLog = typeof attendanceLogsTable.$inferSelect;
