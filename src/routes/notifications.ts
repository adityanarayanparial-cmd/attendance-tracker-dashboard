import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { pushSubscriptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import webpush from "web-push";

const router = Router();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidEmail = process.env.VAPID_EMAIL || "mailto:attendance@tracker.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};

// GET /notifications/preferences
router.get("/preferences", requireAuth, async (req: any, res: any) => {
  try {
    const [sub] = await db
      .select()
      .from(pushSubscriptionsTable)
      .where(eq(pushSubscriptionsTable.userId, req.userId));
    res.json({
      subscribed: !!sub,
      enabled: sub?.enabled ?? false,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /notifications/subscribe — save subscription + enable
router.post("/subscribe", requireAuth, async (req: any, res: any) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "Invalid push subscription" });
    }

    await db
      .insert(pushSubscriptionsTable)
      .values({
        userId: req.userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        enabled: true,
      })
      .onConflictDoUpdate({
        target: pushSubscriptionsTable.userId,
        set: { endpoint, p256dh: keys.p256dh, auth: keys.auth, enabled: true },
      });

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /notifications/preferences — toggle enabled without changing subscription
router.patch("/preferences", requireAuth, async (req: any, res: any) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "enabled must be a boolean" });
    }
    await db
      .update(pushSubscriptionsTable)
      .set({ enabled })
      .where(eq(pushSubscriptionsTable.userId, req.userId));
    res.json({ ok: true, enabled });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /notifications/subscribe — fully unsubscribe
router.delete("/subscribe", requireAuth, async (req: any, res: any) => {
  try {
    await db
      .delete(pushSubscriptionsTable)
      .where(eq(pushSubscriptionsTable.userId, req.userId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export sender for use in cron job
export async function sendDailyReminders(log: any) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    log.warn("VAPID keys not configured — skipping push notifications");
    return;
  }
  const subs = await db
    .select()
    .from(pushSubscriptionsTable)
    .where(eq(pushSubscriptionsTable.enabled, true));

  log.info({ count: subs.length }, "Sending daily attendance reminders");

  const payload = JSON.stringify({
    title: "Mark Your Attendance 📋",
    body: "Have you marked all your classes today? Open the app to stay on track.",
    url: "/dashboard",
  });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    log.warn({ failed: failed.length }, "Some push notifications failed");
  }
}

export default router;
