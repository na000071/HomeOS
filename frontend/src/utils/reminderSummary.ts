import type { Reminder } from "../types/reminder";
import { getReminderStatus } from "./reminderStatus";

export type ReminderSummary = {
  total: number;
  upcoming: number;
  dueSoon: number;
  overdue: number;
  completed: number;
};

export const getReminderSummary = (reminders: Reminder[]): ReminderSummary =>
  reminders.reduce<ReminderSummary>(
    (summary, reminder) => {
      summary.total += 1;

      switch (getReminderStatus(reminder)) {
        case "Upcoming":
          summary.upcoming += 1;
          break;
        case "Due Soon":
          summary.dueSoon += 1;
          break;
        case "Overdue":
          summary.overdue += 1;
          break;
        case "Completed":
          summary.completed += 1;
          break;
      }

      return summary;
    },
    {
      total: 0,
      upcoming: 0,
      dueSoon: 0,
      overdue: 0,
      completed: 0,
    },
  );