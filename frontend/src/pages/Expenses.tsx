import { useState } from "react";
import AddExpenseForm, { type ExpenseDraft } from "../components/AddExpenseForm";
import ExpenseDetails from "../components/ExpenseDetails";
import ExpenseEmptyState from "../components/ExpenseEmptyState";
import EditExpenseForm from "../components/EditExpenseForm";
import Card from "../components/Card";
import ExpenseCard from "../components/ExpenseCard";
import { useHomeData } from "../context/useHomeData";
import type { Expense } from "../types/expense";
import { getExpenseSummary } from "../utils/expenseSummary.ts";
import { getExpenseCategorySummary } from "../utils/expenseCategorySummary.ts";
import { expenseCategories, type ExpenseCategory } from "../types/expense";
import {
  filterAndSortExpenses,
  type ExpenseFilters,
  type ExpenseSortOption,
} from "../utils/expenseFilters";
import { formatExpenseAmount } from "../utils/expenseFormatting";

function Expenses() {
    const { appliances, maintenanceTasks, expenses, setExpenses } = useHomeData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [filters, setFilters] = useState<ExpenseFilters>({
      searchQuery: "",
      category: "all",
      applianceId: "all",
      startDate: "",
      endDate: "",
    });
    const [sortOption, setSortOption] = useState<ExpenseSortOption>("newest");
    const summary = getExpenseSummary(expenses);
    const visibleExpenses = filterAndSortExpenses(expenses, filters, sortOption);
    const categorySummary = getExpenseCategorySummary(expenses);

    const clearFilters = () => {
      setFilters({
        searchQuery: "",
        category: "all",
        applianceId: "all",
        startDate: "",
        endDate: "",
      });
      setSortOption("newest");
    };

    const handleSaveExpense = (expenseDraft: ExpenseDraft) => {
      const expense: Expense = {
        ...expenseDraft,
        id: Date.now(),
        amount: Number(expenseDraft.amount),
      };

      setExpenses((currentExpenses) => [expense, ...currentExpenses]);
      setIsFormOpen(false);
    };

    const handleUpdateExpense = (updatedExpense: Expense) => {
      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense,
        ),
      );
      setEditingExpense(null);
      setSelectedExpense(null);
    };

    const handleDeleteExpense = (expenseId: number) => {
      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== expenseId),
      );
      setSelectedExpense(null);
      setEditingExpense((currentEditingExpense) =>
        currentEditingExpense?.id === expenseId ? null : currentEditingExpense,
      );
    };

    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Home finances</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Expenses
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep track of what you spend on your home.
            </p>
          </div>
  
          <button type="button" onClick={() => setIsFormOpen(true)} className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Expense
          </button>
        </div>

        <section className="mt-8 rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-sky-950">Expenses by Category</h2>
            <p className="mt-1 text-sm text-stone-600">
              See how your home spending is distributed across categories.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categorySummary.map((item) => (
              <div key={item.category} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-medium text-stone-600">{item.category}</p>
                <p className="mt-2 text-xl font-semibold text-sky-950">
                  {formatExpenseAmount(item.total)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  {item.count} {item.count === 1 ? "expense" : "expenses"}
                </p>
              </div>
            ))}
          </div>
        </section>
  
        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total Expenses", summary.total, "All tracked expenses"],
            ["This Month", summary.thisMonth, "Current calendar month"],
            ["This Year", summary.thisYear, "Current calendar year"],
            ["Average Expense", summary.average, "Across all expenses"],
          ].map(([label, amount, description]) => (
            <Card key={label} className="p-5">
              <p className="text-sm font-medium text-stone-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#20211F]">
                {formatExpenseAmount(Number(amount))}
              </p>
              <p className="mt-2 text-sm text-stone-500">{description}</p>
            </Card>
          ))}
        </div>
  
        {/* Filters */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6" role="group" aria-label="Expense filters and sorting">
          <input
            type="text"
            placeholder="Search expenses..."
            aria-label="Search expenses"
            value={filters.searchQuery}
            onChange={(event) => setFilters((current) => ({ ...current, searchQuery: event.target.value }))}
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#5E7563]"
          />
  
          <select aria-label="Filter expenses by category" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as ExpenseCategory | "all" }))} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option value="all">All Categories</option>
            {expenseCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
  
          <select aria-label="Filter expenses by appliance" value={filters.applianceId} onChange={(event) => setFilters((current) => ({ ...current, applianceId: event.target.value === "all" ? "all" : Number(event.target.value) }))} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option value="all">All Appliances</option>
            {appliances.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}
          </select>

          <label className="sr-only" htmlFor="expense-start-date">Expenses from date</label>
          <input id="expense-start-date" type="date" aria-label="Expenses from date" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]" />

          <label className="sr-only" htmlFor="expense-end-date">Expenses through date</label>
          <input id="expense-end-date" type="date" aria-label="Expenses through date" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]" />

          <label className="sr-only" htmlFor="expense-sort">Sort expenses</label>
          <select id="expense-sort" aria-label="Sort expenses" value={sortOption} onChange={(event) => setSortOption(event.target.value as ExpenseSortOption)} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amountHigh">Highest amount</option>
            <option value="amountLow">Lowest amount</option>
            <option value="description">Description A-Z</option>
          </select>

          <button type="button" onClick={clearFilters} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1 sm:col-span-2 xl:col-span-1">
            Clear Filters
          </button>
        </div>
  
        {/* Expense List */}
        <section className="mt-6">
         <div className="mt-6 space-y-4" aria-live="polite">
            {expenses.length === 0 ? (
              <ExpenseEmptyState
                title="No expenses yet"
                description="Add your first expense to start tracking home spending and category totals."
                actionLabel="Add Expense"
                onAction={() => setIsFormOpen(true)}
              />
            ) : visibleExpenses.length === 0 ? (
              <ExpenseEmptyState
                title="No expenses match these filters"
                description="Try adjusting your category, appliance, or date range to see more expenses."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            ) : visibleExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} maintenanceTasks={maintenanceTasks} onViewExpense={setSelectedExpense} />
            ))}
         </div>
        </section>

        {isFormOpen && (
          <AddExpenseForm
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveExpense}
            applianceOptions={appliances}
            maintenanceTaskOptions={maintenanceTasks}
          />
        )}

        {selectedExpense && !isFormOpen && !editingExpense && (
          <ExpenseDetails
            expense={selectedExpense}
            appliances={appliances}
            maintenanceTasks={maintenanceTasks}
            onClose={() => setSelectedExpense(null)}
            onEdit={() => {
              setEditingExpense(selectedExpense);
              setSelectedExpense(null);
            }}
            onDelete={() => handleDeleteExpense(selectedExpense.id)}
          />
        )}

        {editingExpense && (
          <EditExpenseForm
            expense={editingExpense}
            applianceOptions={appliances}
            maintenanceTaskOptions={maintenanceTasks}
            onClose={() => setEditingExpense(null)}
            onSave={handleUpdateExpense}
          />
        )}
      </div>
    );
  }
  
  export default Expenses;