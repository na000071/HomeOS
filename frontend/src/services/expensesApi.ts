import { del, get, post, put } from "./api";

export type ExpenseApiModel = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  applianceId: string | null;
  maintenanceTaskId: string | null;
  notes: string | null;
};

export type ExpenseWriteData = {
  category: string;
  description: string;
  amount: number;
  date: string;
  applianceId: string | null;
  maintenanceTaskId: string | null;
  notes: string | null;
};

export const getExpenses = () => get<ExpenseApiModel[]>("/Expenses");
export const getExpense = (id: string) => get<ExpenseApiModel>(`/Expenses/${id}`);
export const createExpense = (data: ExpenseWriteData) => post<ExpenseApiModel>("/Expenses", data);
export const updateExpense = (id: string, data: ExpenseWriteData) => put<void>(`/Expenses/${id}`, { ...data, id });
export const deleteExpense = (id: string) => del(`/Expenses/${id}`);