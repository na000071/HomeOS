import { getReminderStatus } from "./reminderStatus";
import type {
  Reminder,
  ReminderPriority,
  ReminderStatus,
  ReminderType,
} from "../types/reminder";

export type ReminderFilters = {
  status: ReminderStatus | "all";
  type: ReminderType | "all";
  priority: ReminderPriority | "all";
  applianceId: number | "all";
};

export const filterReminders = (
  reminders: Reminder[],
  filters: ReminderFilters,
): Reminder[] => reminders.filter((reminder) => {
  const currentStatus = getReminderStatus(reminder);

  return (
    (filters.status === "all" || currentStatus === filters.status) &&
    (filters.type === "all" || reminder.type === filters.type) &&
    (filters.priority === "all" || reminder.priority === filters.priority) &&
    (filters.applianceId === "all" || reminder.applianceId === filters.applianceId)
  );
});