"use client";

import { cn } from "@/lib/utils";
import { Flame, Snowflake } from "lucide-react";

interface CalendarDay {
  date: string;
  completed: boolean;
  frozen: boolean;
}

export default function StreakCalendar({ calendar }: { calendar: CalendarDay[] }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4">
      <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
        Last 30 Days
      </h3>
      <div className="grid grid-cols-10 gap-1.5">
        {calendar.map((day) => (
          <div
            key={day.date}
            className={cn(
              "aspect-square rounded-md flex items-center justify-center text-xs relative",
              day.date === today && "ring-2 ring-[var(--green-primary)]",
              day.completed
                ? "bg-[var(--green-primary)]"
                : day.frozen
                ? "bg-[var(--blue-primary)]/30"
                : "bg-[var(--bg-secondary)]"
            )}
            title={`${day.date}${day.completed ? " - Completed" : day.frozen ? " - Frozen" : ""}`}
          >
            {day.completed && <Flame size={12} className="text-white" />}
            {day.frozen && <Snowflake size={12} className="text-[var(--blue-primary)]" />}
          </div>
        ))}
      </div>
    </div>
  );
}
