import AddReminderForm, { type ReminderDraft } from "./AddReminderForm";
import type { Reminder } from "../types/reminder";

type EditReminderFormProps = {
  reminder: Reminder;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
};

function EditReminderForm({ reminder, onClose, onSave }: EditReminderFormProps) {
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
    />
  );
}

export default EditReminderForm;