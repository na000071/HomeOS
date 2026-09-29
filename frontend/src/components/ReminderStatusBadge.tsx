import type { ReminderStatus } from "../types/reminder";

type ReminderStatusBadgeProps = {
  status: ReminderStatus;
};

const statusClasses: Record<ReminderStatus, string> = {
  Upcoming: "bg-stone-100 text-stone-700",
  "Due Soon": "bg-amber-50 text-amber-700",
  Overdue: "bg-red-50 text-red-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

function ReminderStatusBadge({ status }: ReminderStatusBadgeProps) {
  return (
    <span
      aria-label={`Reminder status: ${status}`}
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default ReminderStatusBadge;