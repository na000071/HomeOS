import type { Reminder, ReminderStatus } from "../types/reminder";

export const parseReminderDate = (value: string): Date | null => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getReminderStatus = (
  reminder: Pick<Reminder, "dueDate" | "status">,
  referenceDate = new Date(),
): ReminderStatus => {
  if (reminder.status === "Completed") return "Completed";

  const parsedDueDate = parseReminderDate(reminder.dueDate);
  if (!parsedDueDate) return "Upcoming";

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const daysUntilDue = Math.ceil((parsedDueDate.getTime() - today.getTime()) / 86_400_000);

  if (daysUntilDue < 0) return "Overdue";
  if (daysUntilDue <= 7) return "Due Soon";
  return "Upcoming";
};

export const isValidReminderDate = (value: string): boolean => (
  parseReminderDate(value) !== null
);