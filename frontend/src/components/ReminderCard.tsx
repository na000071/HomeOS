import { formatMaintenanceDate } from "../services/maintenanceDateService";
import type { Reminder } from "../types/reminder";
import { getReminderRelatedLabel } from "../utils/reminderRelations";
import { getReminderStatus } from "../utils/reminderStatus";
import Card from "./Card";
import ReminderPriorityBadge from "./ReminderPriorityBadge";
import ReminderStatusBadge from "./ReminderStatusBadge";
import type { Appliance } from "../utils/applianceUtils";
import type { Expense } from "../types/expense";
import type { MaintenanceTask } from "../types/maintenance";
import type { Warranty } from "../types/warranty";

type ReminderCardProps = {
  reminder: Reminder;
  onViewReminder: (reminder: Reminder) => void;
  appliances?: Appliance[];
  maintenanceTasks?: MaintenanceTask[];
  warranties?: Warranty[];
  expenses?: Expense[];
};

function ReminderCard({ reminder, onViewReminder, appliances, maintenanceTasks, warranties, expenses }: ReminderCardProps) {
  const relatedLabel = getReminderRelatedLabel(reminder, { appliances, maintenanceTasks, warranties, expenses });
  const currentStatus = getReminderStatus(reminder);

  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-stone-400" aria-hidden="true" />

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-[#20211F]">{reminder.title}</h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-500">
              <span>{reminder.type}</span>
              <span>Due {formatMaintenanceDate(reminder.dueDate, "long")}</span>
            </div>

            {relatedLabel && (
              <p className="mt-2 truncate text-sm text-stone-600">Related: {relatedLabel}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ReminderStatusBadge status={currentStatus} />
              <ReminderPriorityBadge priority={reminder.priority} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewReminder(reminder)}
          aria-label={`View reminder: ${reminder.title}`}
          className="shrink-0 rounded-md text-left text-sm font-medium text-[#5E7563] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 sm:text-right"
        >
          View Reminder →
        </button>
      </div>
    </Card>
  );
}

export default ReminderCard;