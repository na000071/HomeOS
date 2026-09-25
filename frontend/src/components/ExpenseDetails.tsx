import Card from "./Card";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Appliance } from "../utils/applianceUtils";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { formatExpenseAmount } from "../utils/expenseFormatting";

type ExpenseDetailsProps = {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  appliances?: Appliance[];
  maintenanceTasks?: MaintenanceTask[];
};

const formatDate = (value: string): string => {
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

function ExpenseDetails({
  expense,
  onClose,
  onEdit,
  onDelete,
  appliances = [],
  maintenanceTasks = [],
}: ExpenseDetailsProps) {
  const dialogRef = useModalAccessibility(onClose);
  const appliance = expense.applianceId === undefined
    ? undefined
    : appliances.find((item) => item.id === expense.applianceId);
  const maintenanceTask = expense.maintenanceTaskId === undefined
    ? undefined
    : maintenanceTasks.find((task) => task.id === expense.maintenanceTaskId);
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${expense.description}" for ${formatExpenseAmount(expense.amount)}? This action cannot be undone.`,
    );

    if (confirmed) onDelete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-details-title"
        aria-describedby="expense-details-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home finances</p>
            <h2 id="expense-details-title" className="mt-1 text-2xl font-semibold text-sky-950">
              Expense details
            </h2>
            <p id="expense-details-description" className="mt-2 text-sm text-stone-600">
              Full information for {expense.description}.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close expense details" className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">×</button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Description</p>
            <p className="mt-1 text-stone-800">{expense.description}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Category</p>
            <p className="mt-1 text-stone-800">{expense.category}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Amount</p>
            <p className="mt-1 text-lg font-semibold text-stone-900">{formatExpenseAmount(expense.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Date</p>
            <p className="mt-1 text-stone-800">{formatDate(expense.date)}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Related appliance</p>
            {appliance ? (
              <p className="mt-1 text-stone-800">{appliance.name} · {appliance.brand}</p>
            ) : (
              <Card className="mt-1 border-dashed bg-stone-50 p-3">
                <p className="text-sm font-medium text-stone-600">No appliance linked</p>
                <p className="mt-1 text-xs text-stone-500">This expense is not associated with an appliance.</p>
              </Card>
            )}
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Related maintenance task</p>
            {maintenanceTask ? (
              <p className="mt-1 text-stone-800">{maintenanceTask.title}</p>
            ) : (
              <Card className="mt-1 border-dashed bg-stone-50 p-3">
                <p className="text-sm font-medium text-stone-600">No maintenance task linked</p>
                <p className="mt-1 text-xs text-stone-500">This expense is not associated with a maintenance task.</p>
              </Card>
            )}
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Notes</p>
            <p className="mt-1 leading-6 text-stone-800">{expense.notes || "No notes"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-5 sm:flex-row">
          <button type="button" onClick={onEdit} className="rounded-lg border border-[#1677B8] bg-white px-5 py-3 text-sm font-medium text-[#1677B8] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Edit</button>
          <button type="button" onClick={handleDelete} className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">Delete</button>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Close</button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetails;