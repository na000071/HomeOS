import { expensesData } from "../data/expensesData";
import type { Document } from "../types/document";
import { getApplianceById, type Appliance } from "./applianceUtils";
import type { Expense } from "../types/expense";

export const getDocumentAppliance = (document: Document, appliances?: Appliance[]) => (
  document.applianceId === undefined ? undefined : getApplianceById(document.applianceId, appliances)
);

export const getDocumentExpense = (document: Document, expenses: Expense[] = expensesData) => (
  document.expenseId === undefined
    ? undefined
    : expenses.find((expense) => expense.id === document.expenseId)
);