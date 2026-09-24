import type { MaintenanceTask } from "../types/maintenance";
import { formatMaintenanceDate } from "../services/maintenanceDateService";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import { getApplianceById } from "../utils/applianceUtils";
import { useModalAccessibility } from "../hooks/useModalAccessibility";

type MaintenanceDetailsProps = {
  task: MaintenanceTask;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkCompleted: () => void;
};

function MaintenanceDetails({
  task,
  onClose,
  onEdit,
  onDelete,
  onMarkCompleted,
}: MaintenanceDetailsProps) {
  const dialogRef = useModalAccessibility(onClose);

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete "${task.title}"? This action cannot be undone.`);

    if (confirmed) {
      onDelete();
    }
  };

  const appliance = getApplianceById(task.applianceId);

  const formattedDate = (value: string | null) => {
    return value ? formatMaintenanceDate(value, "long") : "Not completed yet";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-details-title"
        aria-describedby="maintenance-details-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home care</p>
            <h2 id="maintenance-details-title" className="mt-1 text-2xl font-semibold text-[#20211F]">
              {task.title}
            </h2>
            <p id="maintenance-details-description" className="mt-2 text-sm text-stone-600">
              Maintenance task details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close maintenance details"
            className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
              <p className="text-sm text-stone-500">Description</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-stone-500">Appliance</p>
              {appliance ? (
                <p className="mt-1 text-stone-700">
                  {appliance.name} · {appliance.brand}
                </p>
              ) : (
                <div className="mt-1 rounded-lg border border-dashed border-stone-200 bg-stone-50 px-3 py-2">
                  <p className="text-sm font-medium text-stone-600">No appliance linked</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    This task applies to the home rather than a specific appliance.
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-stone-500">Room</p>
              <p className="mt-1 text-stone-700">{task.room}</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Due Date</p>
              <p className="mt-1 text-stone-700">
                {formatMaintenanceDate(task.dueDate, "long")}
              </p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Frequency</p>
              <p className="mt-1 text-stone-700">{task.frequency}</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Status</p>
              <div className="mt-1">
                <MaintenanceStatusBadge status={task.status} />
              </div>
            </div>

            <div>
              <p className="text-sm text-stone-500">Priority</p>
              <p className="mt-1 text-stone-700">{task.priority}</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Last Completed Date</p>
              <p className="mt-1 text-stone-700">{formattedDate(task.lastCompletedDate)}</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Next Due Date</p>
              <p className="mt-1 text-stone-700">
                {formatMaintenanceDate(task.nextDueDate, "long")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          {task.status !== "Completed" && (
            <button
              type="button"
              onClick={onMarkCompleted}
              className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
            >
              Mark as Completed
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-[#5E7563] bg-white px-5 py-3 text-sm font-medium text-[#5E7563] transition hover:bg-[#F2F6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceDetails;
