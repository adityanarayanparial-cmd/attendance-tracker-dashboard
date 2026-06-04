import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { subjectsTable, dashboardSharesTable, attendanceLogsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

// GET /dashboard/summary
router.get("/summary", requireAuth, async (req: any, res: any) => {
  try {
    const subjects = await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.userId, req.userId));

    const totalSubjects = subjects.length;
    const totalPresent = subjects.reduce((s, x) => s + x.presentCount, 0);
    const totalAbsent = subjects.reduce((s, x) => s + x.absentCount, 0);
    const totalClasses = totalPresent + totalAbsent;
    const overallPercentage = totalClasses === 0 ? 0 : (totalPresent / totalClasses) * 100;

    const safeCount = subjects.filter((s) => {
      const total = s.presentCount + s.absentCount;
      return total > 0 && (s.presentCount / total) * 100 >= 75;
    }).length;

    const atRiskCount = subjects.filter((s) => {
      const total = s.presentCount + s.absentCount;
      return total > 0 && (s.presentCount / total) * 100 < 75;
    }).length;

    res.json({
      totalSubjects,
      totalPresent,
      totalAbsent,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      safeCount,
      atRiskCount,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /dashboard/streak
router.get("/streak", requireAuth, async (req: any, res: any) => {
  try {
    const logs = await db
      .select({ date: attendanceLogsTable.date })
      .from(attendanceLogsTable)
      .where(eq(attendanceLogsTable.userId, req.userId))
      .orderBy(desc(attendanceLogsTable.date));

    const dates = logs.map((l) => l.date); // "YYYY-MM-DD" strings, descending

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

    const markedToday = dates[0] === today;

    // Determine start of current streak
    let startFrom: string | null = null;
    if (markedToday) startFrom = today;
    else if (dates[0] === yesterday) startFrom = yesterday;

    let currentStreak = 0;
    if (startFrom) {
      const startMs = new Date(startFrom).getTime();
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(startMs - i * 86_400_000).toISOString().slice(0, 10);
        if (dates[i] === expected) currentStreak++;
        else break;
      }
    }

    // Longest streak
    let longestStreak = 0;
    let run = 0;
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        run = 1;
      } else {
        const prev = new Date(dates[i - 1]).getTime();
        const curr = new Date(dates[i]).getTime();
        if (prev - curr === 86_400_000) {
          run++;
        } else {
          longestStreak = Math.max(longestStreak, run);
          run = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, run);

    res.json({
      currentStreak,
      longestStreak,
      lastMarkedDate: dates[0] ?? null,
      markedToday,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /dashboard/share — create or regenerate share token
router.post("/share", requireAuth, async (req: any, res: any) => {
  try {
    const token = randomUUID();
    await db
      .insert(dashboardSharesTable)
      .values({ userId: req.userId, token })
      .onConflictDoUpdate({
        target: dashboardSharesTable.userId,
        set: { token },
      });
    res.json({ token });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /dashboard/share — revoke share token
router.delete("/share", requireAuth, async (req: any, res: any) => {
  try {
    await db
      .delete(dashboardSharesTable)
      .where(eq(dashboardSharesTable.userId, req.userId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /dashboard — delete all subjects for user
router.delete("/", requireAuth, async (req: any, res: any) => {
  try {
    await db
      .delete(subjectsTable)
      .where(eq(subjectsTable.userId, req.userId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
