import { getWarrantyExpirationInfo } from "../services/warrantyDateService";
import type { MaintenanceTask } from "../types/maintenance";
import type { Reminder, ReminderPriority } from "../types/reminder";
import type { Warranty } from "../types/warranty.ts";
import { getReminderStatus, isValidReminderDate } from "./reminderStatus";

export type ReminderSuggestionSource = "Maintenance" | "Warranty";

export type ReminderSuggestion = {
  key: string;
  source: ReminderSuggestionSource;
  reminder: Reminder;
};

type ReminderSuggestionInput = {
  maintenanceTasks: MaintenanceTask[];
  warranties: Warranty[];
  existingReminders: Reminder[];
  referenceDate?: Date;
};

const getMaintenancePriority = (priority: MaintenanceTask["priority"]): ReminderPriority => {
  if (priority === "Critical" || priority === "High") return "High";
  if (priority === "Medium") return "Medium";
  return "Low";
};

export const isReminderDuplicate = (
  reminder: Reminder,
  existingReminders: Reminder[],
): boolean => existingReminders.some((existingReminder) => (
  existingReminder.type === reminder.type && (
    (reminder.type === "Maintenance" && existingReminder.maintenanceTaskId === reminder.maintenanceTaskId) ||
    (reminder.type === "Warranty" && existingReminder.warrantyId === reminder.warrantyId)
  )
));

export const getReminderSuggestions = ({
  maintenanceTasks,
  warranties,
  existingReminders,
  referenceDate = new Date(),
}: ReminderSuggestionInput): ReminderSuggestion[] => {
  const maintenanceSuggestions = maintenanceTasks
    .filter((task) => task.status !== "Completed" && isValidReminderDate(task.dueDate))
    .map((task): ReminderSuggestion | null => {
      const reminder: Reminder = {
        id: -task.id,
        title: task.title,
        description: task.description,
        type: "Maintenance",
        dueDate: task.dueDate,
        priority: getMaintenancePriority(task.priority),
        status: getReminderStatus({ dueDate: task.dueDate, status: "Upcoming" }, referenceDate),
        ...(task.applianceId !== null ? { applianceId: task.applianceId } : {}),
        maintenanceTaskId: task.id,
      };

      return isReminderDuplicate(reminder, existingReminders)
        ? null
        : { key: `Maintenance:${task.id}`, source: "Maintenance", reminder };
    })
    .filter((suggestion): suggestion is ReminderSuggestion => suggestion !== null);

  const warrantySuggestions = warranties
    .map((warranty): ReminderSuggestion | null => {
      const expiration = getWarrantyExpirationInfo(warranty.endDate, referenceDate);
      if (!expiration.isValid || expiration.daysRemaining === null || expiration.daysRemaining < 0 || expiration.daysRemaining > 90) {
        return null;
      }

      const reminder: Reminder = {
        id: -10000 - warranty.id,
        title: "Warranty expiration approaching",
        description: `Review the ${warranty.provider} ${warranty.warrantyType} before ${expiration.expirationDateLabel}.`,
        type: "Warranty",
        dueDate: warranty.endDate,
        priority: expiration.daysRemaining <= 30 ? "High" : "Medium",
        status: getReminderStatus({ dueDate: warranty.endDate, status: "Upcoming" }, referenceDate),
        applianceId: warranty.applianceId,
        warrantyId: warranty.id,
      };

      return isReminderDuplicate(reminder, existingReminders)
        ? null
        : { key: `Warranty:${warranty.id}`, source: "Warranty", reminder };
    })
    .filter((suggestion): suggestion is ReminderSuggestion => suggestion !== null);

  return [...maintenanceSuggestions, ...warrantySuggestions];
};