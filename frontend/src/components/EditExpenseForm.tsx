import AddExpenseForm, { type ExpenseDraft } from "./AddExpenseForm";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Appliance } from "../utils/applianceUtils";

type EditExpenseFormProps = {
  expense: Expense;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  applianceOptions: Appliance[];
  maintenanceTaskOptions: MaintenanceTask[];
};

function EditExpenseForm({
  expense,
  onClose,
  onSave,
  applianceOptions,
  maintenanceTaskOptions,
}: EditExpenseFormProps) {
  const initialValues: ExpenseDraft = {
    description: expense.description,
    category: expense.category,
    amount: expense.amount.toString(),
    date: expense.date,
    applianceId: expense.applianceId,
    maintenanceTaskId: expense.maintenanceTaskId,
    notes: expense.notes,
  };

  return (
    <AddExpenseForm
      onClose={onClose}
      onSave={(updatedDraft) =>
        onSave({
          ...expense,
          ...updatedDraft,
          amount: Number(updatedDraft.amount),
        })
      }
      initialValues={initialValues}
      applianceOptions={applianceOptions}
      maintenanceTaskOptions={maintenanceTaskOptions}
      title="Edit Expense"
      description="Update the expense details and relationships."
      submitLabel="Save Changes"
    />
  );
}

export default EditExpenseForm;