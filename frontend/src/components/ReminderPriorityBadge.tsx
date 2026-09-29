import type { ReminderPriority } from "../types/reminder";

type ReminderPriorityBadgeProps = {
  priority: ReminderPriority;
};

const priorityClasses: Record<ReminderPriority, string> = {
  Low: "bg-stone-100 text-stone-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

function ReminderPriorityBadge({ priority }: ReminderPriorityBadgeProps) {
  return (
    <span
      aria-label={`Reminder priority: ${priority}`}
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityClasses[priority]}`}
    >
      {priority} priority
    </span>
  );
}

export default ReminderPriorityBadge;