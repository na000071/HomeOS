import { expenseCategories, type Expense, type ExpenseCategory } from "../types/expense";

export type ExpenseCategorySummary = {
  category: ExpenseCategory;
  total: number;
  count: number;
};

export const getExpenseCategorySummary = (
  expenses: Expense[],
): ExpenseCategorySummary[] => {
  const totals = new Map<ExpenseCategory, ExpenseCategorySummary>(
    expenseCategories.map((category) => [
      category,
      { category, total: 0, count: 0 },
    ]),
  );

  expenses.forEach((expense) => {
    const current = totals.get(expense.category);

    if (current) {
      current.total += expense.amount;
      current.count += 1;
    }
  });

  return Array.from(totals.values());
};