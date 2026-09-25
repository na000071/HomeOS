import { useState } from "react";
import { appliancesData } from "../data/appliancesData";
import { maintenanceData } from "../data/maintenanceData";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { expenseCategories, type Expense, type ExpenseCategory } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Appliance } from "../utils/applianceUtils";

export type ExpenseDraft = Omit<Expense, "id" | "amount"> & { amount: string };

type AddExpenseFormProps = {
  onClose: () => void;
  onSave: (expense: ExpenseDraft) => void;
  initialValues?: Partial<ExpenseDraft>;
  applianceOptions?: Appliance[];
  maintenanceTaskOptions?: MaintenanceTask[];
  title?: string;
  description?: string;
  submitLabel?: string;
};

const defaultFormValues: ExpenseDraft = {
  category: "Other",
  description: "",
  amount: "",
  date: "",
  applianceId: undefined,
  maintenanceTaskId: undefined,
  notes: "",
};

function AddExpenseForm({
  onClose,
  onSave,
  initialValues,
  applianceOptions = appliancesData,
  maintenanceTaskOptions = maintenanceData,
  title = "Add Expense",
  description = "Record a home-related expense and its optional connections.",
  submitLabel = "Save Expense",
}: AddExpenseFormProps) {
  const dialogRef = useModalAccessibility(onClose);
  const [formValues, setFormValues] = useState<ExpenseDraft>({
    ...defaultFormValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseDraft, string>>>({});
  const inputClass = "mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1";

  const handleFieldChange = (field: keyof ExpenseDraft, value: string | number | undefined) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof ExpenseDraft, string>> = {};
    const amount = Number(formValues.amount);

    if (!formValues.description.trim()) nextErrors.description = "Description is required.";
    if (!formValues.category) nextErrors.category = "Category is required.";
    if (!formValues.amount.trim() || !Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = "Amount must be a positive number.";
    }
    if (!formValues.date) nextErrors.date = "Date is required.";

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      ...formValues,
      description: formValues.description.trim(),
      amount: formValues.amount.trim(),
      notes: formValues.notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="add-expense-title" aria-describedby="add-expense-description" tabIndex={-1} className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home finances</p>
            <h2 id="add-expense-title" className="mt-1 text-2xl font-semibold text-sky-950">{title}</h2>
            <p id="add-expense-description" className="mt-2 text-sm text-stone-600">{description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close expense form" className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">×</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="expense-description" className="text-sm font-medium text-stone-700">Description</label>
              <input id="expense-description" value={formValues.description} onChange={(event) => handleFieldChange("description", event.target.value)} className={inputClass} placeholder="e.g. Refrigerator filter replacement" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "expense-description-error" : undefined} />
              {errors.description && <p id="expense-description-error" role="alert" className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>
            <div>
              <label htmlFor="expense-category" className="text-sm font-medium text-stone-700">Category</label>
              <select id="expense-category" value={formValues.category} onChange={(event) => handleFieldChange("category", event.target.value as ExpenseCategory)} className={inputClass} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "expense-category-error" : undefined}>{expenseCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
              {errors.category && <p id="expense-category-error" role="alert" className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="expense-amount" className="text-sm font-medium text-stone-700">Amount</label>
              <input id="expense-amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={formValues.amount} onChange={(event) => handleFieldChange("amount", event.target.value)} className={inputClass} placeholder="0.00" aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? "expense-amount-error" : undefined} />
              {errors.amount && <p id="expense-amount-error" role="alert" className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>
            <div>
              <label htmlFor="expense-date" className="text-sm font-medium text-stone-700">Date</label>
              <input id="expense-date" type="date" value={formValues.date} onChange={(event) => handleFieldChange("date", event.target.value)} className={inputClass} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "expense-date-error" : undefined} />
              {errors.date && <p id="expense-date-error" role="alert" className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="expense-appliance" className="text-sm font-medium text-stone-700">Related appliance <span className="font-normal text-stone-400">(optional)</span></label>
              <select id="expense-appliance" value={formValues.applianceId ?? ""} onChange={(event) => handleFieldChange("applianceId", event.target.value ? Number(event.target.value) : undefined)} className={inputClass}><option value="">No appliance</option>{applianceOptions.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}</select>
            </div>
            <div>
              <label htmlFor="expense-maintenance-task" className="text-sm font-medium text-stone-700">Related maintenance task <span className="font-normal text-stone-400">(optional)</span></label>
              <select id="expense-maintenance-task" value={formValues.maintenanceTaskId ?? ""} onChange={(event) => handleFieldChange("maintenanceTaskId", event.target.value ? Number(event.target.value) : undefined)} className={inputClass}><option value="">No maintenance task</option>{maintenanceTaskOptions.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="expense-notes" className="text-sm font-medium text-stone-700">Notes</label>
              <textarea id="expense-notes" rows={3} value={formValues.notes} onChange={(event) => handleFieldChange("notes", event.target.value)} className={`${inputClass} resize-none`} placeholder="Add receipt or context notes." />
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

export default AddExpenseForm;