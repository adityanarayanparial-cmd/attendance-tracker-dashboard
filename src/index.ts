import app from "./app";
import { logger } from "./lib/logger";
import cron from "node-cron";
import { sendDailyReminders } from "./routes/notifications";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Daily reminder at 8:00 PM IST (14:30 UTC)
  cron.schedule("30 14 * * *", () => {
    sendDailyReminders(logger).catch((e) =>
      logger.error({ err: e }, "Push notification cron failed")
    );
  });

  logger.info("Daily reminder cron scheduled (8:00 PM IST)");
});
