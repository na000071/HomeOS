export type ExpenseCategory =
  | "Utilities"
  | "Maintenance"
  | "Appliance"
  | "Internet"
  | "Insurance"
  | "Repair"
  | "Service"
  | "Other";

export const expenseCategories = [
  "Utilities",
  "Maintenance",
  "Appliance",
  "Internet",
  "Insurance",
  "Repair",
  "Service",
  "Other",
] as const satisfies readonly ExpenseCategory[];

export interface Expense {
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  applianceId?: number;
  maintenanceTaskId?: number;
  notes: string;
}