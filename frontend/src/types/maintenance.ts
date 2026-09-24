export type MaintenanceStatus = "Upcoming" | "Due Soon" | "Overdue" | "Completed";
export const maintenanceStatuses = [
  "Upcoming",
  "Due Soon",
  "Overdue",
  "Completed",
] as const satisfies readonly MaintenanceStatus[];

export type MaintenancePriority = "Low" | "Medium" | "High" | "Critical";
export const maintenancePriorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
] as const satisfies readonly MaintenancePriority[];

export type MaintenanceFrequency =
  | "One-time"
  | "Monthly"
  | "Every 3 Months"
  | "Every 6 Months"
  | "Yearly";
export const maintenanceFrequencies = [
  "One-time",
  "Monthly",
  "Every 3 Months",
  "Every 6 Months",
  "Yearly",
] as const satisfies readonly MaintenanceFrequency[];

export interface MaintenanceTask {
  id: number;
  title: string;
  description: string;
  applianceId: number | null;
  room: string;
  dueDate: string;
  frequency: MaintenanceFrequency;
  status: MaintenanceStatus;
  lastCompletedDate: string | null;
  nextDueDate: string;
  priority: MaintenancePriority;
}
