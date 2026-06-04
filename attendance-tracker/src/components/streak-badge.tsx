import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastMarkedDate: string | null;
  markedToday: boolean;
};

function useStreak() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return useQuery<StreakData>({
    queryKey: ["streak"],
    queryFn: () =>
      fetch(`${base}/api/dashboard/streak`, { credentials: "include" }).then((r) => r.json()),
    staleTime: 30_000,
  });
}

function flameColor(streak: number) {
  if (streak === 0) return "text-muted-foreground";
  if (streak < 3) return "text-amber-400";
  if (streak < 7) return "text-orange-500";
  return "text-red-500";
}

function message(streak: number, markedToday: boolean) {
  if (streak === 0) return "Mark today to start a streak!";
  if (!markedToday) return `${streak}-day streak — mark today to keep it!`;
  if (streak === 1) return "Streak started! Come back tomorrow.";
  if (streak < 5) return "Keep it going!";
  if (streak < 14) return "You're on fire!";
  return "Legendary consistency!";
}

export function StreakBadge() {
  const { data, isLoading } = useStreak();

  if (isLoading) {
    return <Skeleton className="h-16 w-36 rounded-2xl" />;
  }

  if (!data) return null;

  const { currentStreak, longestStreak, markedToday } = data;
  const color = flameColor(currentStreak);
  const msg = message(currentStreak, markedToday);

  return (
    <div
      className="bg-background rounded-2xl p-4 border border-border flex flex-col items-center justify-center min-w-[140px] select-none"
      title={`Longest streak: ${longestStreak} day${longestStreak === 1 ? "" : "s"}`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`text-2xl ${color} transition-colors`}>🔥</span>
        <span className={`text-3xl font-black font-mono ${color} transition-colors`}>
          {currentStreak}
        </span>
        <span className="text-xs text-muted-foreground font-medium self-end mb-1">
          {currentStreak === 1 ? "day" : "days"}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground text-center leading-tight mt-1 max-w-[120px]">
        {msg}
      </p>
      {longestStreak > 0 && (
        <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
          Best: {longestStreak}d
        </p>
      )}
    </div>
  );
}

export { useStreak };
