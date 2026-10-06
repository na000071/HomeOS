import { appliancesData } from "../data/appliancesData";
import { expensesData } from "../data/expensesData";
import { maintenanceTasksData } from "../data/maintenanceTasksData";
import { warrantiesData } from "../data/warrantiesData";
import type { Appliance } from "./applianceUtils";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Warranty } from "../types/warranty.ts";
import type { Reminder } from "../types/reminder";

export const getReminderAppliance = (reminder: Reminder, appliances: Appliance[] = appliancesData): Appliance | undefined => (
  reminder.applianceId === undefined
    ? undefined
    : appliances.find((item) => item.id === reminder.applianceId)
);

export const getReminderMaintenanceTask = (reminder: Reminder, maintenanceTasks: MaintenanceTask[] = maintenanceTasksData): MaintenanceTask | undefined => (
  reminder.maintenanceTaskId === undefined
    ? undefined
    : maintenanceTasks.find((item) => item.id === reminder.maintenanceTaskId)
);

export const getReminderWarranty = (reminder: Reminder, warranties: Warranty[] = warrantiesData): Warranty | undefined => (
  reminder.warrantyId === undefined
    ? undefined
    : warranties.find((item) => item.id === reminder.warrantyId)
);

export const getReminderExpense = (reminder: Reminder, expenses: Expense[] = expensesData): Expense | undefined => (
  reminder.expenseId === undefined
    ? undefined
    : expenses.find((item) => item.id === reminder.expenseId)
);

export const getReminderRelatedLabel = (reminder: Reminder, data?: { appliances?: Appliance[]; maintenanceTasks?: MaintenanceTask[]; warranties?: Warranty[]; expenses?: Expense[] }): string | undefined => {
  const appliance = getReminderAppliance(reminder, data?.appliances);
  if (appliance) return `${appliance.brand} ${appliance.name}`;

  const task = getReminderMaintenanceTask(reminder, data?.maintenanceTasks);
  if (task) return task.title;

  const warranty = getReminderWarranty(reminder, data?.warranties);
  if (warranty) return warranty.provider;

  const expense = getReminderExpense(reminder, data?.expenses);
  if (expense) return expense.description;

  return undefined;
};