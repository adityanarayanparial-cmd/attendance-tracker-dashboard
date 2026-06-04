import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { subjectsTable, attendanceLogsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

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

function subjectToResponse(subject: typeof subjectsTable.$inferSelect) {
  return {
    id: subject.id,
    userId: subject.userId,
    name: subject.name,
    presentCount: subject.presentCount,
    absentCount: subject.absentCount,
    createdAt: subject.createdAt.toISOString(),
  };
}

/** Upsert today's UTC date into attendance_logs for streak tracking */
async function logAttendanceDay(userId: string) {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  await db
    .insert(attendanceLogsTable)
    .values({ userId, date: today })
    .onConflictDoNothing();
}

// GET /subjects — list all subjects for current user
router.get("/", requireAuth, async (req: any, res: any) => {
  try {
    const subjects = await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.userId, req.userId))
      .orderBy(subjectsTable.createdAt);
    res.json(subjects.map(subjectToResponse));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /subjects — create a new subject
router.post("/", requireAuth, async (req: any, res: any) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Subject name is required" });
    }
    const [subject] = await db
      .insert(subjectsTable)
      .values({ userId: req.userId, name: name.trim(), presentCount: 0, absentCount: 0 })
      .returning();
    res.status(201).json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /subjects/:id
router.get("/:id", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [subject] = await db
      .select()
      .from(subjectsTable)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)));
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /subjects/:id
router.patch("/:id", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const updates: Partial<typeof subjectsTable.$inferInsert> = {};
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Subject name must be a non-empty string" });
      }
      updates.name = name.trim();
    }
    const [subject] = await db
      .update(subjectsTable)
      .set(updates)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)))
      .returning();
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /subjects/:id
router.delete("/:id", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [subject] = await db
      .delete(subjectsTable)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)))
      .returning();
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /subjects/:id/present
router.post("/:id/present", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db
      .select()
      .from(subjectsTable)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Subject not found" });
    const [subject] = await db
      .update(subjectsTable)
      .set({ presentCount: existing.presentCount + 1 })
      .where(eq(subjectsTable.id, id))
      .returning();
    await logAttendanceDay(req.userId);
    res.json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /subjects/:id/absent
router.post("/:id/absent", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db
      .select()
      .from(subjectsTable)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Subject not found" });
    const [subject] = await db
      .update(subjectsTable)
      .set({ absentCount: existing.absentCount + 1 })
      .where(eq(subjectsTable.id, id))
      .returning();
    await logAttendanceDay(req.userId);
    res.json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /subjects/:id/undo-present
router.post("/:id/undo-present", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db
      .select()
      .from(subjectsTable)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Subject not found" });
    const [subject] = await db
      .update(subjectsTable)
      .set({ presentCount: Math.max(0, existing.presentCount - 1) })
      .where(eq(subjectsTable.id, id))
      .returning();
    res.json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /subjects/:id/undo-absent
router.post("/:id/undo-absent", requireAuth, async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db
      .select()
      .from(subjectsTable)
      .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, req.userId)));
    if (!existing) return res.status(404).json({ error: "Subject not found" });
    const [subject] = await db
      .update(subjectsTable)
      .set({ absentCount: Math.max(0, existing.absentCount - 1) })
      .where(eq(subjectsTable.id, id))
      .returning();
    res.json(subjectToResponse(subject));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
