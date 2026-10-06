import { del, get, post, put } from "./api";

export type ReminderApiModel = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  dueDate: string;
  priority: string;
  status: string;
  applianceId: string | null;
  maintenanceTaskId: string | null;
  warrantyId: string | null;
  expenseId: string | null;
};

export type ReminderWriteData = {
  title: string;
  description: string;
  type: string;
  dueDate: string;
  priority: string;
  applianceId: string | null;
  maintenanceTaskId: string | null;
  warrantyId: string | null;
  expenseId: string | null;
  status?: string;
};

export const getReminders = () => get<ReminderApiModel[]>("/Reminders");
export const getReminder = (id: string) => get<ReminderApiModel>(`/Reminders/${id}`);
export const createReminder = (data: ReminderWriteData) => post<ReminderApiModel>("/Reminders", data);
export const updateReminder = (id: string, data: ReminderWriteData) => put<void>(`/Reminders/${id}`, { ...data, id });
export const deleteReminder = (id: string) => del(`/Reminders/${id}`);