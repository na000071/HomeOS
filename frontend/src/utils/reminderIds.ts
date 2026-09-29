import type { Reminder } from "../types/reminder";

export const getNextReminderId = (reminders: Reminder[]): number => reminders.reduce(
  (highestId, reminder) => Math.max(highestId, reminder.id),
  0,
) + 1;