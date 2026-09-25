import type { Expense } from "../types/expense";
import { getExpenseCategorySummary } from "./expenseCategorySummary";
import { getExpenseSummary } from "./expenseSummary";

export type ExpenseDashboardData = {
  total: number;
  thisMonth: number;
  thisYear: number;
  byCategory: Array<{ category: string; amount: number; percentage: number }>;
  recentExpenses: Expense[];
  topCategories: Array<{ category: string; amount: number; count: number }>;
};

export const getExpenseDashboardData = (expenses: Expense[]): ExpenseDashboardData => {
  const summary = getExpenseSummary(expenses);
  const categories = getExpenseCategorySummary(expenses);
  const byCategory = categories
    .filter((category) => category.total > 0)
    .map((category) => ({
      category: category.category,
      amount: category.total,
      percentage: summary.total === 0 ? 0 : Math.round((category.total / summary.total) * 100),
    }))
    .sort((first, second) => second.amount - first.amount);

  return {
    total: summary.total,
    thisMonth: summary.thisMonth,
    thisYear: summary.thisYear,
    byCategory,
    recentExpenses: [...expenses]
      .sort((first, second) => second.date.localeCompare(first.date))
      .slice(0, 3),
    topCategories: categories
      .filter((category) => category.total > 0)
      .sort((first, second) => second.total - first.total)
      .slice(0, 3)
      .map((category) => ({
        category: category.category,
        amount: category.total,
        count: category.count,
      })),
  };
};