import { appliancesData } from "../data/appliancesData";
import { expensesData } from "../data/expensesData";
import { maintenanceTasksData } from "../data/maintenanceTasksData";
import { warrantiesData } from "../data/warrantiesData";
import type { Appliance } from "./applianceUtils";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Warranty } from "../types/warranty.ts";
import type { Reminder } from "../types/reminder";

export const getReminderAppliance = (reminder: Reminder): Appliance | undefined => (
  reminder.applianceId === undefined
    ? undefined
    : appliancesData.find((item) => item.id === reminder.applianceId)
);

export const getReminderMaintenanceTask = (reminder: Reminder): MaintenanceTask | undefined => (
  reminder.maintenanceTaskId === undefined
    ? undefined
    : maintenanceTasksData.find((item) => item.id === reminder.maintenanceTaskId)
);

export const getReminderWarranty = (reminder: Reminder): Warranty | undefined => (
  reminder.warrantyId === undefined
    ? undefined
    : warrantiesData.find((item) => item.id === reminder.warrantyId)
);

export const getReminderExpense = (reminder: Reminder): Expense | undefined => (
  reminder.expenseId === undefined
    ? undefined
    : expensesData.find((item) => item.id === reminder.expenseId)
);

export const getReminderRelatedLabel = (reminder: Reminder): string | undefined => {
  const appliance = getReminderAppliance(reminder);
  if (appliance) return `${appliance.brand} ${appliance.name}`;

  const task = getReminderMaintenanceTask(reminder);
  if (task) return task.title;

  const warranty = getReminderWarranty(reminder);
  if (warranty) return warranty.provider;

  const expense = getReminderExpense(reminder);
  if (expense) return expense.description;

  return undefined;
};