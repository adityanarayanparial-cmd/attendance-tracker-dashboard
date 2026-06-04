import { Router } from "express";
import { db } from "@workspace/db";
import { dashboardSharesTable, subjectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /reports/:token — public, no auth required
router.get("/:token", async (req: any, res: any) => {
  try {
    const { token } = req.params;
    const [share] = await db
      .select()
      .from(dashboardSharesTable)
      .where(eq(dashboardSharesTable.token, token));

    if (!share) {
      return res.status(404).json({ error: "Report not found or link has been revoked." });
    }

    const subjects = await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.userId, share.userId))
      .orderBy(subjectsTable.createdAt);

    const totalPresent = subjects.reduce((s, x) => s + x.presentCount, 0);
    const totalAbsent = subjects.reduce((s, x) => s + x.absentCount, 0);
    const totalClasses = totalPresent + totalAbsent;
    const overallPercentage =
      totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 10000) / 100;

    res.json({
      subjects: subjects.map((s) => ({
        id: s.id,
        name: s.name,
        presentCount: s.presentCount,
        absentCount: s.absentCount,
      })),
      generatedAt: new Date().toISOString(),
      totalPresent,
      totalAbsent,
      overallPercentage,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
