import Card from "./Card";
import ExpenseEmptyState from "./ExpenseEmptyState";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import { getApplianceById } from "../utils/applianceUtils";
import { formatExpenseAmount } from "../utils/expenseFormatting";

type ExpenseCardProps = {
  expense: Expense;
  onViewExpense: (expense: Expense) => void;
  maintenanceTasks?: MaintenanceTask[];
};

function ExpenseCard({ expense, onViewExpense, maintenanceTasks = [] }: ExpenseCardProps) {
  const appliance = expense.applianceId !== undefined
    ? getApplianceById(expense.applianceId)
    : undefined;
  const maintenanceTask = expense.maintenanceTaskId === undefined
    ? undefined
    : maintenanceTasks.find((task) => task.id === expense.maintenanceTaskId);
  const hasInvalidInformation = !expense.description.trim() || !expense.date || !Number.isFinite(expense.amount);

  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-sky-950">
            {expense.description}
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
            <span>{expense.category}</span>
            <span>{expense.date}</span>
          </div>
          {appliance && (
            <p className="mt-2 text-sm text-stone-600">
              Appliance: {appliance.name} · {appliance.brand}
            </p>
          )}
          {!appliance && expense.applianceId !== undefined && (
            <p className="mt-2 text-sm text-amber-700">Linked appliance unavailable</p>
          )}
          {appliance === undefined && expense.applianceId === undefined && (
            <p className="mt-2 text-sm text-stone-500">No appliance linked</p>
          )}
          {maintenanceTask ? (
            <p className="mt-1 text-sm text-stone-600">Maintenance: {maintenanceTask.title}</p>
          ) : expense.maintenanceTaskId !== undefined ? (
            <p className="mt-1 text-sm text-amber-700">Linked maintenance task unavailable</p>
          ) : (
            <p className="mt-1 text-sm text-stone-500">No maintenance task linked</p>
          )}
          {hasInvalidInformation && (
            <div className="mt-3">
              <ExpenseEmptyState
                title="Expense information incomplete"
                description="Some expense details are missing or invalid. Review this record before relying on its summary."
              />
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-5 sm:flex-col sm:items-end sm:gap-2">
          <p className="text-lg font-semibold text-stone-900">
            {formatExpenseAmount(expense.amount)}
          </p>
          <button
            type="button"
            onClick={() => onViewExpense(expense)}
            aria-label={`View expense: ${expense.description}`}
            className="rounded-md text-sm font-medium text-[#1677B8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            View Expense →
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ExpenseCard;