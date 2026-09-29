import { useState } from "react";
import { appliancesData } from "../data/appliancesData";
import { expensesData } from "../data/expensesData";
import { maintenanceTasksData } from "../data/maintenanceTasksData";
import { warrantiesData } from "../data/warrantiesData";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import {
  reminderPriorities,
  reminderTypes,
  type Reminder,
  type ReminderPriority,
  type ReminderType,
} from "../types/reminder";

export type ReminderDraft = Omit<Reminder, "id" | "status">;

type ReminderFormValues = Omit<ReminderDraft, "type" | "priority"> & {
  type: ReminderType | "";
  priority: ReminderPriority | "";
};

type AddReminderFormProps = {
  onClose: () => void;
  onSave: (reminder: ReminderDraft) => void;
  initialReminder?: Reminder;
  title?: string;
  description?: string;
  submitLabel?: string;
};

const defaultFormValues: ReminderFormValues = {
  title: "",
  description: "",
  type: "",
  dueDate: "",
  priority: "",
  applianceId: undefined,
  maintenanceTaskId: undefined,
  warrantyId: undefined,
  expenseId: undefined,
};

const getInitialFormValues = (reminder?: Reminder): ReminderFormValues => reminder
  ? {
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      dueDate: reminder.dueDate,
      priority: reminder.priority,
      applianceId: reminder.applianceId,
      maintenanceTaskId: reminder.maintenanceTaskId,
      warrantyId: reminder.warrantyId,
      expenseId: reminder.expenseId,
    }
  : defaultFormValues;

function AddReminderForm({
  onClose,
  onSave,
  initialReminder,
  title = "Add Reminder",
  description = "Add an important date or task to your home reminders.",
  submitLabel = "Save Reminder",
}: AddReminderFormProps) {
  const dialogRef = useModalAccessibility(onClose);
  const [formValues, setFormValues] = useState<ReminderFormValues>(() => getInitialFormValues(initialReminder));
  const [errors, setErrors] = useState<Partial<Record<keyof ReminderFormValues, string>>>({});
  const inputClass = "mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1";

  const updateField = <Field extends keyof ReminderFormValues>(
    field: Field,
    value: ReminderFormValues[Field],
  ) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof ReminderFormValues, string>> = {};

    if (!formValues.title.trim()) nextErrors.title = "Title is required.";
    if (!formValues.type) nextErrors.type = "Type is required.";
    if (!formValues.dueDate) nextErrors.dueDate = "Due date is required.";
    if (!formValues.priority) nextErrors.priority = "Priority is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !formValues.type || !formValues.priority) return;

    onSave({
      ...formValues,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      type: formValues.type,
      priority: formValues.priority,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="add-reminder-title" aria-describedby="add-reminder-description" tabIndex={-1} className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home planning</p>
            <h2 id="add-reminder-title" className="mt-1 text-2xl font-semibold text-[#20211F]">{title}</h2>
            <p id="add-reminder-description" className="mt-2 text-sm text-stone-600">{description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close reminder form" className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">×</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="reminder-title" className="text-sm font-medium text-stone-700">Title</label>
              <input id="reminder-title" value={formValues.title} onChange={(event) => updateField("title", event.target.value)} className={inputClass} placeholder="e.g. Replace HVAC filter" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "reminder-title-error" : undefined} />
              {errors.title && <p id="reminder-title-error" role="alert" className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="reminder-description" className="text-sm font-medium text-stone-700">Description</label>
              <textarea id="reminder-description" rows={3} value={formValues.description} onChange={(event) => updateField("description", event.target.value)} className={`${inputClass} resize-none`} placeholder="Add details about this reminder." />
            </div>
            <div>
              <label htmlFor="reminder-type" className="text-sm font-medium text-stone-700">Type</label>
              <select id="reminder-type" value={formValues.type} onChange={(event) => updateField("type", event.target.value as ReminderType | "")} className={inputClass} aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? "reminder-type-error" : undefined}><option value="">Select a type</option>{reminderTypes.map((type) => <option key={type}>{type}</option>)}</select>
              {errors.type && <p id="reminder-type-error" role="alert" className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>
            <div>
              <label htmlFor="reminder-due-date" className="text-sm font-medium text-stone-700">Due date</label>
              <input id="reminder-due-date" type="date" value={formValues.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} className={inputClass} aria-invalid={Boolean(errors.dueDate)} aria-describedby={errors.dueDate ? "reminder-due-date-error" : undefined} />
              {errors.dueDate && <p id="reminder-due-date-error" role="alert" className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
            </div>
            <div>
              <label htmlFor="reminder-priority" className="text-sm font-medium text-stone-700">Priority</label>
              <select id="reminder-priority" value={formValues.priority} onChange={(event) => updateField("priority", event.target.value as ReminderPriority | "")} className={inputClass} aria-invalid={Boolean(errors.priority)} aria-describedby={errors.priority ? "reminder-priority-error" : undefined}><option value="">Select a priority</option>{reminderPriorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
              {errors.priority && <p id="reminder-priority-error" role="alert" className="mt-1 text-xs text-red-600">{errors.priority}</p>}
            </div>
            <div>
              <label htmlFor="reminder-appliance" className="text-sm font-medium text-stone-700">Related appliance <span className="font-normal text-stone-400">(optional)</span></label>
              <select id="reminder-appliance" value={formValues.applianceId ?? ""} onChange={(event) => updateField("applianceId", event.target.value ? Number(event.target.value) : undefined)} className={inputClass}><option value="">No appliance</option>{appliancesData.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}</select>
            </div>
            <div>
              <label htmlFor="reminder-maintenance" className="text-sm font-medium text-stone-700">Related maintenance task <span className="font-normal text-stone-400">(optional)</span></label>
              <select id="reminder-maintenance" value={formValues.maintenanceTaskId ?? ""} onChange={(event) => updateField("maintenanceTaskId", event.target.value ? Number(event.target.value) : undefined)} className={inputClass}><option value="">No maintenance task</option>{maintenanceTasksData.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select>
            </div>
            <div>
              <label htmlFor="reminder-warranty" className="text-sm font-medium text-stone-700">Related warranty <span className="font-normal text-stone-400">(optional)</span></label>
              <select id="reminder-warranty" value={formValues.warrantyId ?? ""} onChange={(event) => updateField("warrantyId", event.target.value ? Number(event.target.value) : undefined)} className={inputClass}><option value="">No warranty</option>{warrantiesData.map((warranty) => <option key={warranty.id} value={warranty.id}>{warranty.provider} · {warranty.warrantyType}</option>)}</select>
            </div>
            <div>
              <label htmlFor="reminder-expense" className="text-sm font-medium text-stone-700">Related expense <span className="font-normal text-stone-400">(optional)</span></label>
              <select id="reminder-expense" value={formValues.expenseId ?? ""} onChange={(event) => updateField("expenseId", event.target.value ? Number(event.target.value) : undefined)} className={inputClass}><option value="">No expense</option>{expensesData.map((expense) => <option key={expense.id} value={expense.id}>{expense.description} · {expense.date}</option>)}</select>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-lg px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Cancel</button>
            <button type="submit" className="homeos-primary-button rounded-lg px-5 py-3 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReminderForm;