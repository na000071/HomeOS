export type ReminderType =
  | "Maintenance"
  | "Warranty"
  | "Bill"
  | "Inspection"
  | "Document"
  | "Other";

export type ReminderPriority = "Low" | "Medium" | "High";

export type ReminderStatus = "Upcoming" | "Due Soon" | "Overdue" | "Completed";

export const reminderTypes = [
  "Maintenance",
  "Warranty",
  "Bill",
  "Inspection",
  "Document",
  "Other",
] as const satisfies readonly ReminderType[];

export const reminderPriorities = ["Low", "Medium", "High"] as const satisfies readonly ReminderPriority[];

export const reminderStatuses = [
  "Upcoming",
  "Due Soon",
  "Overdue",
  "Completed",
] as const satisfies readonly ReminderStatus[];

export interface Reminder {
  id: number;
  title: string;
  description: string;
  type: ReminderType;
  dueDate: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  applianceId?: number;
  maintenanceTaskId?: number;
  warrantyId?: number;
  expenseId?: number;
}