import { appliancesData } from "../data/appliancesData";
import { maintenanceTasksData } from "../data/maintenanceTasksData";
import { documentsData } from "../data/documentsData";
import { expensesData } from "../data/expensesData";
import { remindersData } from "../data/remindersData";
import { roomsData } from "../data/roomsData";
import { warrantiesData } from "../data/warrantiesData";
import type { Document } from "../types/document";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Reminder } from "../types/reminder";
import type { Room } from "../types/room";
import type { SearchRelatedInformation, SearchResult, SearchResultType } from "../types/search";
import type { Warranty } from "../types/warranty.ts";
import type { Appliance } from "./applianceUtils";

export type SearchData = {
  appliances: Appliance[];
  maintenanceTasks: MaintenanceTask[];
  warranties: Warranty[];
  expenses: Expense[];
  documents: Document[];
  reminders: Reminder[];
  rooms: Room[];
};

type SearchEntry = {
  id: number;
  type: SearchResultType;
  title: string;
  description: string;
  searchableText: string;
  route: string;
  related?: SearchRelatedInformation[];
};

const defaultSearchData: SearchData = {
  appliances: appliancesData,
  maintenanceTasks: maintenanceTasksData,
  warranties: warrantiesData,
  expenses: expensesData,
  documents: documentsData,
  reminders: remindersData,
  rooms: roomsData,
};

const normalize = (value: string): string => value.trim().toLocaleLowerCase();

const related = (
  id: number | undefined,
  type: SearchResultType,
  entries: SearchEntry[],
): SearchRelatedInformation[] => {
  if (id === undefined) return [];

  const match = entries.find((entry) => entry.id === id && entry.type === type);
  return match ? [{ id: match.id, title: match.title, type: match.type }] : [];
};

const relatedTitles = (
  id: number | undefined,
  type: SearchResultType,
  entries: SearchEntry[],
): string => related(id, type, entries).map((item) => item.title).join(" ");

const createEntries = (data: SearchData): SearchEntry[] => {
  const applianceEntries: SearchEntry[] = data.appliances.map((appliance) => ({
    id: appliance.id,
    type: "appliance",
    title: `${appliance.brand} ${appliance.name}`,
    description: `${appliance.category} in ${appliance.room} · Model ${appliance.model}`,
    searchableText: [
      appliance.name,
      appliance.brand,
      appliance.model,
      appliance.room,
      appliance.category,
      appliance.serialNumber,
      appliance.warranty,
      appliance.notes,
    ].join(" "),
    route: "/appliances",
  }));

  const maintenanceEntries: SearchEntry[] = data.maintenanceTasks.map((task) => ({
    id: task.id,
    type: "maintenance",
    title: task.title,
    description: `${task.room} · ${task.status} · Due ${task.dueDate}`,
    searchableText: [
      task.title,
      task.description,
      task.room,
      task.dueDate,
      task.frequency,
      task.status,
      task.priority,
      relatedTitles(task.applianceId ?? undefined, "appliance", applianceEntries),
    ].join(" "),
    route: "/maintenance",
    related: related(task.applianceId ?? undefined, "appliance", applianceEntries),
  }));

  const warrantyEntries: SearchEntry[] = data.warranties.map((warranty) => ({
    id: warranty.id,
    type: "warranty",
    title: `${warranty.provider} ${warranty.warrantyType}`,
    description: `${warranty.status} · Coverage through ${warranty.endDate}`,
    searchableText: [
      warranty.provider,
      warranty.warrantyType,
      warranty.coverage,
      warranty.startDate,
      warranty.endDate,
      warranty.status,
      warranty.notes,
      relatedTitles(warranty.applianceId, "appliance", applianceEntries),
    ].join(" "),
    route: "/warranties",
    related: related(warranty.applianceId, "appliance", applianceEntries),
  }));

  const expenseEntries: SearchEntry[] = data.expenses.map((expense) => ({
    id: expense.id,
    type: "expense",
    title: expense.description,
    description: `${expense.category} · $${expense.amount.toFixed(2)} · ${expense.date}`,
    searchableText: [
      expense.description,
      expense.category,
      expense.date,
      expense.notes,
      expense.amount.toString(),
      relatedTitles(expense.applianceId, "appliance", applianceEntries),
      relatedTitles(expense.maintenanceTaskId, "maintenance", maintenanceEntries),
    ].join(" "),
    route: "/expenses",
    related: [
      ...related(expense.applianceId, "appliance", applianceEntries),
      ...related(expense.maintenanceTaskId, "maintenance", maintenanceEntries),
    ],
  }));

  const documentEntries: SearchEntry[] = data.documents.map((document) => ({
    id: document.id,
    type: "document",
    title: document.name,
    description: `${document.category} · ${document.fileType} · Added ${document.dateAdded}`,
    searchableText: [
      document.name,
      document.category,
      document.fileType,
      document.fileName,
      document.dateAdded,
      document.description,
      document.notes,
      relatedTitles(document.applianceId, "appliance", applianceEntries),
      relatedTitles(document.expenseId, "expense", expenseEntries),
    ].join(" "),
    route: "/documents",
    related: [
      ...related(document.applianceId, "appliance", applianceEntries),
      ...related(document.expenseId, "expense", expenseEntries),
    ],
  }));

  const reminderEntries: SearchEntry[] = data.reminders.map((reminder) => ({
    id: reminder.id,
    type: "reminder",
    title: reminder.title,
    description: `${reminder.type} · ${reminder.status} · Due ${reminder.dueDate}`,
    searchableText: [
      reminder.title,
      reminder.description,
      reminder.type,
      reminder.dueDate,
      reminder.priority,
      reminder.status,
      relatedTitles(reminder.applianceId, "appliance", applianceEntries),
      relatedTitles(reminder.maintenanceTaskId, "maintenance", maintenanceEntries),
      relatedTitles(reminder.warrantyId, "warranty", warrantyEntries),
      relatedTitles(reminder.expenseId, "expense", expenseEntries),
    ].join(" "),
    route: "/reminders",
    related: [
      ...related(reminder.applianceId, "appliance", applianceEntries),
      ...related(reminder.maintenanceTaskId, "maintenance", maintenanceEntries),
      ...related(reminder.warrantyId, "warranty", warrantyEntries),
      ...related(reminder.expenseId, "expense", expenseEntries),
    ],
  }));

  const roomEntries: SearchEntry[] = data.rooms.map((room) => ({
    id: room.id,
    type: "room",
    title: room.name,
    description: `${room.type} · ${room.description}`,
    searchableText: [room.name, room.description, room.type, room.icon].join(" "),
    route: "/home",
  }));

  return [
    ...applianceEntries,
    ...maintenanceEntries,
    ...warrantyEntries,
    ...expenseEntries,
    ...documentEntries,
    ...reminderEntries,
    ...roomEntries,
  ];
};

export const searchHomeData = (
  query: string,
  data: SearchData = defaultSearchData,
): SearchResult[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return createEntries(data)
    .filter((entry) => normalize(entry.searchableText).includes(normalizedQuery))
    .map(({ searchableText: _searchableText, ...result }) => result);
};