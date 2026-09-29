import { expensesData } from "../data/expensesData";
import type { Document } from "../types/document";
import { getApplianceById } from "./applianceUtils";

export const getDocumentAppliance = (document: Document) => (
  document.applianceId === undefined ? undefined : getApplianceById(document.applianceId)
);

export const getDocumentExpense = (document: Document) => (
  document.expenseId === undefined
    ? undefined
    : expensesData.find((expense) => expense.id === document.expenseId)
);