import { useState } from "react";
import { appliancesData } from "../data/appliancesData";
import { maintenanceFrequencies } from "../types/maintenance";
import type { MaintenanceTask } from "../types/maintenance";
import type { ApplianceSummary } from "../utils/applianceUtils";
import type {
  MaintenanceFrequency,
  MaintenancePriority,
} from "../types/maintenance";
import { useModalAccessibility } from "../hooks/useModalAccessibility";

export type MaintenanceTaskDraft = {
  title: string;
  description: string;
  applianceId: number | null;
  room: string;
  dueDate: string;
  frequency: MaintenanceFrequency;
  priority: MaintenancePriority;
};

type EditMaintenanceFormProps = {
  task: MaintenanceTask;
  onClose: () => void;
  onSave: (task: MaintenanceTask) => void;
  applianceOptions?: ApplianceSummary[];
};

const defaultApplianceOptions: ApplianceSummary[] = appliancesData.map((appliance) => ({
  id: appliance.id,
  name: appliance.name,
  brand: appliance.brand,
}));

function EditMaintenanceForm({
  task,
  onClose,
  onSave,
  applianceOptions = defaultApplianceOptions,
}: EditMaintenanceFormProps) {
  const dialogRef = useModalAccessibility(onClose);
  const [formValues, setFormValues] = useState<MaintenanceTaskDraft>({
    title: task.title,
    description: task.description,
    applianceId: task.applianceId,
    room: task.room,
    dueDate: task.dueDate,
    frequency: task.frequency,
    priority: task.priority,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceTaskDraft, string>>>({});

  const handleFieldChange = (
    field: keyof MaintenanceTaskDraft,
    value: string | number | null,
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value as MaintenanceTaskDraft[keyof MaintenanceTaskDraft],
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof MaintenanceTaskDraft, string>> = {};

    if (!formValues.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formValues.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!formValues.room.trim()) {
      nextErrors.room = "Room is required.";
    }

    if (!formValues.dueDate) {
      nextErrors.dueDate = "Due date is required.";
    }

    if (!formValues.frequency) {
      nextErrors.frequency = "Frequency is required.";
    }

    if (!formValues.priority) {
      nextErrors.priority = "Priority is required.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSave({
      ...task,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      applianceId: formValues.applianceId ?? null,
      room: formValues.room.trim(),
      dueDate: formValues.dueDate,
      frequency: formValues.frequency,
      priority: formValues.priority,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-maintenance-title"
        aria-describedby="edit-maintenance-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home care</p>
            <h2 id="edit-maintenance-title" className="mt-1 text-2xl font-semibold text-[#20211F]">
              Edit Maintenance Task
            </h2>
            <p id="edit-maintenance-description" className="mt-2 text-sm text-stone-600">
              Update the maintenance task details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close maintenance form"
            className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="maintenance-edit-title" className="text-sm font-medium text-stone-700">
                Task Title
              </label>
              <input
                id="maintenance-edit-title"
                type="text"
                value={formValues.title}
                onChange={(event) => handleFieldChange("title", event.target.value)}
                className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "maintenance-edit-title-error" : undefined}
              />
              {errors.title && (
                <p id="maintenance-edit-title-error" className="mt-1 text-xs text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="maintenance-edit-description"
                className="text-sm font-medium text-stone-700"
              >
                Description
              </label>
              <textarea
                id="maintenance-edit-description"
                rows={4}
                value={formValues.description}
                onChange={(event) => handleFieldChange("description", event.target.value)}
                className="mt-2 w-full resize-none rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "maintenance-edit-description-error" : undefined}
              />
              {errors.description && (
                <p id="maintenance-edit-description-error" className="mt-1 text-xs text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="maintenance-edit-appliance" className="text-sm font-medium text-stone-700">
                Appliance
              </label>
              <select
                id="maintenance-edit-appliance"
                value={formValues.applianceId ?? ""}
                onChange={(event) =>
                  handleFieldChange("applianceId", event.target.value === "" ? null : Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              >
                <option value="">Not linked to an appliance</option>
                {applianceOptions.map((appliance) => (
                  <option key={appliance.id} value={appliance.id}>
                    {appliance.name} · {appliance.brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="maintenance-edit-room" className="text-sm font-medium text-stone-700">
                Room
              </label>
              <select
                id="maintenance-edit-room"
                value={formValues.room}
                onChange={(event) => handleFieldChange("room", event.target.value)}
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
                aria-invalid={Boolean(errors.room)}
                aria-describedby={errors.room ? "maintenance-edit-room-error" : undefined}
              >
                <option value="">Select a room</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Laundry">Laundry</option>
                <option value="Whole Home">Whole Home</option>
                <option value="Garage">Garage</option>
                <option value="Office">Office</option>
              </select>
              {errors.room && (
                <p id="maintenance-edit-room-error" className="mt-1 text-xs text-red-600">
                  {errors.room}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="maintenance-edit-due-date" className="text-sm font-medium text-stone-700">
                Due Date
              </label>
              <input
                id="maintenance-edit-due-date"
                type="date"
                value={formValues.dueDate}
                onChange={(event) => handleFieldChange("dueDate", event.target.value)}
                className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? "maintenance-edit-due-date-error" : undefined}
              />
              {errors.dueDate && (
                <p id="maintenance-edit-due-date-error" className="mt-1 text-xs text-red-600">
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="maintenance-edit-frequency" className="text-sm font-medium text-stone-700">
                Frequency
              </label>
              <select
                id="maintenance-edit-frequency"
                value={formValues.frequency}
                onChange={(event) =>
                  handleFieldChange("frequency", event.target.value as MaintenanceFrequency)
                }
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
                aria-invalid={Boolean(errors.frequency)}
                aria-describedby={errors.frequency ? "maintenance-edit-frequency-error" : undefined}
              >
                {maintenanceFrequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <p id="maintenance-edit-frequency-error" className="mt-1 text-xs text-red-600">
                  {errors.frequency}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="maintenance-edit-priority" className="text-sm font-medium text-stone-700">
                Priority
              </label>
              <select
                id="maintenance-edit-priority"
                value={formValues.priority}
                onChange={(event) => handleFieldChange("priority", event.target.value as MaintenancePriority)}
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
                aria-invalid={Boolean(errors.priority)}
                aria-describedby={errors.priority ? "maintenance-edit-priority-error" : undefined}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.priority && (
                <p id="maintenance-edit-priority-error" className="mt-1 text-xs text-red-600">
                  {errors.priority}
                </p>
              )}
            </div>

          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMaintenanceForm;
