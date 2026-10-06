import AddReminderForm, { type ReminderDraft } from "./AddReminderForm";
import type { Reminder } from "../types/reminder";
import type { Appliance } from "../utils/applianceUtils";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Warranty } from "../types/warranty";

type EditReminderFormProps = {
  reminder: Reminder;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  applianceOptions?: Appliance[];
  maintenanceTaskOptions?: MaintenanceTask[];
  warrantyOptions?: Warranty[];
  expenseOptions?: Expense[];
};

function EditReminderForm({ reminder, onClose, onSave, applianceOptions, maintenanceTaskOptions, warrantyOptions, expenseOptions }: EditReminderFormProps) {
  const handleSave = (draft: ReminderDraft) => {
    onSave({ ...draft, id: reminder.id, status: reminder.status });
  };

  return (
    <AddReminderForm
      initialReminder={reminder}
      onClose={onClose}
      onSave={handleSave}
      title="Edit Reminder"
      description="Update the details for this home reminder."
      submitLabel="Save Changes"
      applianceOptions={applianceOptions}
      maintenanceTaskOptions={maintenanceTaskOptions}
      warrantyOptions={warrantyOptions}
      expenseOptions={expenseOptions}
    />
  );
}

export default EditReminderForm;