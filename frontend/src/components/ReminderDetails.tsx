import { formatMaintenanceDate } from "../services/maintenanceDateService";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import type { Reminder } from "../types/reminder";
import {
  getReminderAppliance,
  getReminderExpense,
  getReminderMaintenanceTask,
  getReminderWarranty,
} from "../utils/reminderRelations";
import { getReminderStatus } from "../utils/reminderStatus";
import { formatExpenseAmount } from "../utils/expenseFormatting";
import Card from "./Card";
import ReminderPriorityBadge from "./ReminderPriorityBadge";
import ReminderStatusBadge from "./ReminderStatusBadge";
import type { Appliance } from "../utils/applianceUtils";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Warranty } from "../types/warranty";

type ReminderDetailsProps = {
  reminder: Reminder;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkCompleted: () => void;
  appliances?: Appliance[];
  maintenanceTasks?: MaintenanceTask[];
  warranties?: Warranty[];
  expenses?: Expense[];
};

type RelationshipEmptyStateProps = {
  title: string;
  description: string;
};

function RelationshipEmptyState({ title, description }: RelationshipEmptyStateProps) {
  return (
    <Card className="mt-1 border-dashed bg-stone-50 p-3">
      <p className="text-sm font-medium text-stone-600">{title}</p>
      <p className="mt-1 text-xs text-stone-500">{description}</p>
    </Card>
  );
}

function ReminderDetails({ reminder, onClose, onEdit, onDelete, onMarkCompleted, appliances, maintenanceTasks, warranties, expenses }: ReminderDetailsProps) {
  const dialogRef = useModalAccessibility(onClose);
  const appliance = getReminderAppliance(reminder, appliances);
  const maintenanceTask = getReminderMaintenanceTask(reminder, maintenanceTasks);
  const warranty = getReminderWarranty(reminder, warranties);
  const expense = getReminderExpense(reminder, expenses);
  const hasUnavailableAppliance = reminder.applianceId !== undefined && !appliance;
  const hasUnavailableMaintenanceTask = reminder.maintenanceTaskId !== undefined && !maintenanceTask;
  const hasUnavailableWarranty = reminder.warrantyId !== undefined && !warranty;
  const hasUnavailableExpense = reminder.expenseId !== undefined && !expense;
  const currentStatus = getReminderStatus(reminder);
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${reminder.title || "this reminder"}"? This action cannot be undone.`,
    );

    if (confirmed) onDelete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="reminder-details-title" aria-describedby="reminder-details-description" tabIndex={-1} className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home planning</p>
            <h2 id="reminder-details-title" className="mt-1 text-2xl font-semibold text-sky-950">Reminder details</h2>
            <p id="reminder-details-description" className="mt-2 text-sm text-stone-600">Full information for {reminder.title}.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close reminder details" className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">×</button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Title</p>
            <p className="mt-1 text-lg font-semibold text-stone-900">{reminder.title}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Description</p>
            <p className="mt-1 leading-6 text-stone-800">{reminder.description || "No description"}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Type</p>
            <p className="mt-1 text-stone-800">{reminder.type}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Due date</p>
            <p className="mt-1 text-stone-800">{formatMaintenanceDate(reminder.dueDate, "long")}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Priority</p>
            <div className="mt-1"><ReminderPriorityBadge priority={reminder.priority} /></div>
          </div>
          <div>
            <p className="text-sm text-stone-500">Status</p>
            <div className="mt-1"><ReminderStatusBadge status={currentStatus} /></div>
          </div>
          <div>
            <p className="text-sm text-stone-500">Related appliance</p>
            {appliance ? <p className="mt-1 text-stone-800">{appliance.name} · {appliance.brand}</p> : <RelationshipEmptyState title={hasUnavailableAppliance ? "Appliance unavailable" : "No appliance linked"} description={hasUnavailableAppliance ? "This reminder references an appliance that could not be found." : "This reminder is not associated with an appliance."} />}
          </div>
          <div>
            <p className="text-sm text-stone-500">Related maintenance task</p>
            {maintenanceTask ? <p className="mt-1 text-stone-800">{maintenanceTask.title}</p> : <RelationshipEmptyState title={hasUnavailableMaintenanceTask ? "Maintenance task unavailable" : "No maintenance task linked"} description={hasUnavailableMaintenanceTask ? "This reminder references a task that could not be found." : "This reminder is not associated with a maintenance task."} />}
          </div>
          <div>
            <p className="text-sm text-stone-500">Related warranty</p>
            {warranty ? <p className="mt-1 text-stone-800">{warranty.provider} · {warranty.warrantyType}</p> : <RelationshipEmptyState title={hasUnavailableWarranty ? "Warranty unavailable" : "No warranty linked"} description={hasUnavailableWarranty ? "This reminder references a warranty that could not be found." : "This reminder is not associated with a warranty."} />}
          </div>
          <div>
            <p className="text-sm text-stone-500">Related expense</p>
            {expense ? <p className="mt-1 text-stone-800">{expense.description} · {formatExpenseAmount(expense.amount)}</p> : <RelationshipEmptyState title={hasUnavailableExpense ? "Expense unavailable" : "No expense linked"} description={hasUnavailableExpense ? "This reminder references an expense that could not be found." : "This reminder is not associated with an expense."} />}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-5 sm:flex-row">
          {currentStatus !== "Completed" && (
            <button type="button" onClick={onMarkCompleted} className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">Mark as Completed</button>
          )}
          <button type="button" onClick={onEdit} className="rounded-lg border border-[#1677B8] bg-white px-5 py-3 text-sm font-medium text-[#1677B8] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Edit Reminder</button>
          <button type="button" onClick={handleDelete} className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">Delete Reminder</button>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Close</button>
        </div>
      </div>
    </div>
  );
}

export default ReminderDetails;