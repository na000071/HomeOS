import type { Expense } from "../types/expense";

export type ExpenseSummary = {
  total: number;
  thisMonth: number;
  thisYear: number;
  average: number;
};

const parseExpenseDate = (value: string): Date | null => {
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const getExpenseSummary = (
  expenses: Expense[],
  referenceDate = new Date(),
): ExpenseSummary => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonth = expenses.reduce((sum, expense) => {
    const date = parseExpenseDate(expense.date);

    return date &&
      date.getFullYear() === referenceDate.getFullYear() &&
      date.getMonth() === referenceDate.getMonth()
      ? sum + expense.amount
      : sum;
  }, 0);
  const thisYear = expenses.reduce((sum, expense) => {
    const date = parseExpenseDate(expense.date);

    return date && date.getFullYear() === referenceDate.getFullYear()
      ? sum + expense.amount
      : sum;
  }, 0);

  return {
    total,
    thisMonth,
    thisYear,
    average: expenses.length === 0 ? 0 : total / expenses.length,
  };
};