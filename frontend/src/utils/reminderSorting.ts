import type { Reminder } from "../types/reminder";

export type ReminderSortOption =
  | "dueDateAsc"
  | "dueDateDesc"
  | "priorityDesc"
  | "priorityAsc"
  | "titleAsc"
  | "titleDesc";

const priorityRank: Record<Reminder["priority"], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const getReminderDateValue = (dueDate: string): number => {
  const timestamp = Date.parse(dueDate);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortReminders = (
  reminders: Reminder[],
  sortOption: ReminderSortOption,
): Reminder[] => [...reminders].sort((firstReminder, secondReminder) => {
  switch (sortOption) {
    case "dueDateDesc":
      return getReminderDateValue(secondReminder.dueDate) - getReminderDateValue(firstReminder.dueDate);
    case "priorityDesc":
      return priorityRank[secondReminder.priority] - priorityRank[firstReminder.priority];
    case "priorityAsc":
      return priorityRank[firstReminder.priority] - priorityRank[secondReminder.priority];
    case "titleAsc":
      return firstReminder.title.localeCompare(secondReminder.title);
    case "titleDesc":
      return secondReminder.title.localeCompare(firstReminder.title);
    case "dueDateAsc":
    default:
      return getReminderDateValue(firstReminder.dueDate) - getReminderDateValue(secondReminder.dueDate);
  }
});