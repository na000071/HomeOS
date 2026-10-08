import { getExpenseDashboardData } from "./expenseDashboard";
import { getMaintenanceDashboardData } from "./maintenanceDashboard";
import { getReminderStatus } from "./reminderStatus";
import { getWarrantyDashboardData } from "./warrantyDashboard";
import type { Appliance } from "../utils/applianceUtils";
import type { Document } from "../types/document";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Reminder } from "../types/reminder";
import type { Room } from "../types/room";
import type { Warranty } from "../types/warranty";

export type DashboardTone = "danger" | "warning" | "info";

export type DashboardItem = {
  key: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  tone: DashboardTone;
};

export type DashboardActivity = {
  key: string;
  title: string;
  description: string;
  date: string;
  href: string;
};

const dateValue = (value: string): number => {
  const parsed = new Date(`${value}T00:00:00`).getTime();
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

export const getGreeting = (hour = new Date().getHours()): string => {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const getDashboardStats = (
  appliances: Appliance[],
  rooms: Room[],
  maintenanceTasks: MaintenanceTask[],
  warranties: Warranty[],
  expenses: Expense[],
  documents: Document[],
  reminders: Reminder[],
) => {
  const maintenance = getMaintenanceDashboardData(maintenanceTasks);
  const warranty = getWarrantyDashboardData(warranties, appliances);
  const expense = getExpenseDashboardData(expenses);
  const openReminders = reminders.filter((reminder) => getReminderStatus(reminder) !== "Completed").length;

  return {
    appliances: appliances.length,
    rooms: rooms.length,
    upcomingMaintenance: maintenance.upcoming,
    activeWarranties: warranty.active,
    monthlyExpenses: expense.thisMonth,
    openReminders,
    documents: documents.length,
    maintenanceTasks: maintenanceTasks.length,
    appliancesWithoutRoom: appliances.filter((appliance) => !appliance.roomId).length,
  };
};

export const getNeedsAttention = (
  maintenanceTasks: MaintenanceTask[],
  warranties: Warranty[],
  reminders: Reminder[],
  appliances: Appliance[],
): DashboardItem[] => {
  const items: DashboardItem[] = [];
  const warrantyData = getWarrantyDashboardData(warranties, appliances);

  maintenanceTasks
    .filter((task) => task.status === "Overdue")
    .sort((first, second) => dateValue(first.dueDate) - dateValue(second.dueDate))
    .slice(0, 3)
    .forEach((task) => items.push({
      key: `maintenance-overdue-${task.id}`,
      title: task.title,
      description: "Maintenance is overdue",
      meta: `Due ${task.dueDate}`,
      href: "/maintenance",
      tone: "danger",
    }));

  reminders
    .filter((reminder) => getReminderStatus(reminder) === "Overdue")
    .sort((first, second) => dateValue(first.dueDate) - dateValue(second.dueDate))
    .slice(0, 3)
    .forEach((reminder) => items.push({
      key: `reminder-overdue-${reminder.id}`,
      title: reminder.title,
      description: "Reminder is overdue",
      meta: `Due ${reminder.dueDate}`,
      href: "/reminders",
      tone: "danger",
    }));

  warrantyData.recentlyExpiring.slice(0, 3).forEach((warranty) => items.push({
    key: `warranty-expiring-${warranty.id}`,
    title: `${warranty.applianceBrand} ${warranty.applianceName}`.trim(),
    description: `${warranty.provider} coverage is expiring soon`,
    meta: warranty.expirationDateLabel,
    href: "/warranties",
    tone: "warning",
  }));

  maintenanceTasks
    .filter((task) => (task.status === "Upcoming" || task.status === "Due Soon") && (task.priority === "High" || task.priority === "Critical"))
    .sort((first, second) => dateValue(first.dueDate) - dateValue(second.dueDate))
    .slice(0, 3)
    .forEach((task) => items.push({
      key: `maintenance-priority-${task.id}`,
      title: task.title,
      description: `${task.priority} priority maintenance`,
      meta: `Due ${task.dueDate}`,
      href: "/maintenance",
      tone: "info",
    }));

  return items.slice(0, 8);
};

export const getUpcomingItems = (
  maintenanceTasks: MaintenanceTask[],
  warranties: Warranty[],
  expenses: Expense[],
  reminders: Reminder[],
  appliances: Appliance[],
): DashboardItem[] => {
  const items: DashboardItem[] = [];
  const warrantyData = getWarrantyDashboardData(warranties, appliances);

  maintenanceTasks
    .filter((task) => task.status !== "Completed")
    .sort((first, second) => dateValue(first.dueDate) - dateValue(second.dueDate))
    .slice(0, 2)
    .forEach((task) => items.push({
      key: `maintenance-upcoming-${task.id}`,
      title: task.title,
      description: "Maintenance",
      meta: `Due ${task.dueDate}`,
      href: "/maintenance",
      tone: "info",
    }));

  warrantyData.recentlyExpiring.slice(0, 2).forEach((warranty) => items.push({
    key: `warranty-upcoming-${warranty.id}`,
    title: `${warranty.applianceBrand} ${warranty.applianceName}`.trim(),
    description: "Warranty expiration",
    meta: warranty.expirationDateLabel,
    href: "/warranties",
    tone: "warning",
  }));

  expenses
    .filter((expense) => dateValue(expense.date) >= dateValue(new Date().toISOString().slice(0, 10)))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date))
    .slice(0, 2)
    .forEach((expense) => items.push({
      key: `expense-upcoming-${expense.id}`,
      title: expense.description,
      description: "Expense",
      meta: `${expense.date} · $${expense.amount.toFixed(2)}`,
      href: "/expenses",
      tone: "info",
    }));

  reminders
    .filter((reminder) => getReminderStatus(reminder) !== "Completed")
    .sort((first, second) => dateValue(first.dueDate) - dateValue(second.dueDate))
    .slice(0, 2)
    .forEach((reminder) => items.push({
      key: `reminder-upcoming-${reminder.id}`,
      title: reminder.title,
      description: "Reminder",
      meta: `Due ${reminder.dueDate}`,
      href: "/reminders",
      tone: "info",
    }));

  return items.slice(0, 8);
};

export const getRecentActivity = (
  appliances: Appliance[],
  maintenanceTasks: MaintenanceTask[],
  expenses: Expense[],
  documents: Document[],
): DashboardActivity[] => [
  ...appliances.slice(0, 2).map((appliance) => ({
    key: `appliance-${appliance.id}`,
    title: appliance.name,
    description: "Appliance",
    date: "Recently added",
    href: "/appliances",
  })),
  ...maintenanceTasks
    .filter((task) => task.lastCompletedDate)
    .sort((first, second) => dateValue(second.lastCompletedDate ?? "") - dateValue(first.lastCompletedDate ?? ""))
    .slice(0, 2)
    .map((task) => ({
      key: `maintenance-${task.id}`,
      title: task.title,
      description: "Maintenance completed",
      date: task.lastCompletedDate ?? "",
      href: "/maintenance",
    })),
  ...[...expenses].sort((first, second) => dateValue(second.date) - dateValue(first.date)).slice(0, 2).map((expense) => ({
    key: `expense-${expense.id}`,
    title: expense.description,
    description: "Expense added",
    date: expense.date,
    href: "/expenses",
  })),
  ...[...documents].sort((first, second) => dateValue(second.dateAdded) - dateValue(first.dateAdded)).slice(0, 2).map((document) => ({
    key: `document-${document.id}`,
    title: document.name,
    description: "Document added",
    date: document.dateAdded,
    href: "/documents",
  })),
].slice(0, 8);
