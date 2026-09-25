import type { Expense, ExpenseCategory } from "../types/expense";

export type ExpenseFilters = {
  searchQuery: string;
  category: ExpenseCategory | "all";
  applianceId: number | "all";
  startDate: string;
  endDate: string;
};

export const filterExpenses = (
  expenses: Expense[],
  filters: ExpenseFilters,
): Expense[] => {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  return expenses.filter((expense) => {
    const matchesSearch = !normalizedQuery ||
      expense.description.toLowerCase().includes(normalizedQuery) ||
      expense.category.toLowerCase().includes(normalizedQuery);
    const matchesCategory = filters.category === "all" || expense.category === filters.category;
    const matchesAppliance =
      filters.applianceId === "all" || expense.applianceId === filters.applianceId;
    const matchesStartDate = !filters.startDate || expense.date >= filters.startDate;
    const matchesEndDate = !filters.endDate || expense.date <= filters.endDate;

    return matchesSearch && matchesCategory && matchesAppliance && matchesStartDate && matchesEndDate;
  });
};

export type ExpenseSortOption =
  | "newest"
  | "oldest"
  | "amountHigh"
  | "amountLow"
  | "description";

export const filterAndSortExpenses = (
  expenses: Expense[],
  filters: ExpenseFilters,
  sortOption: ExpenseSortOption,
): Expense[] => {
  const filteredExpenses = filterExpenses(expenses, filters);

  return [...filteredExpenses].sort((firstExpense, secondExpense) => {
    if (sortOption === "amountHigh") {
      return secondExpense.amount - firstExpense.amount;
    }

    if (sortOption === "amountLow") {
      return firstExpense.amount - secondExpense.amount;
    }

    if (sortOption === "description") {
      return firstExpense.description.localeCompare(secondExpense.description);
    }

    const dateDifference = firstExpense.date.localeCompare(secondExpense.date);
    return sortOption === "newest" ? -dateDifference : dateDifference;
  });
};