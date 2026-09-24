import Card from "./Card";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import type { MaintenanceTask } from "../types/maintenance";
import { formatMaintenanceDate } from "../services/maintenanceDateService";
import { getApplianceById } from "../utils/applianceUtils";

type MaintenanceTaskCardProps = {
  task: MaintenanceTask;
  onViewTask: (task: MaintenanceTask) => void;
};

const priorityClasses: Record<MaintenanceTask["priority"], string> = {
  Low: "text-stone-600",
  Medium: "text-amber-700",
  High: "text-orange-700",
  Critical: "text-red-700",
};

function MaintenanceTaskCard({ task, onViewTask }: MaintenanceTaskCardProps) {
  const appliance = getApplianceById(task.applianceId);

  return (
    <Card className="p-5 transition hover:shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-[#20211F]">{task.title}</h2>
            <MaintenanceStatusBadge status={task.status} />
          </div>

          <p className="mt-2 text-sm leading-6 text-stone-600">{task.description}</p>

          {appliance ? (
            <p className="mt-2 text-sm text-stone-500">
              Appliance: {appliance.name} · {appliance.brand}
            </p>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-stone-200 bg-stone-50 px-3 py-2">
              <p className="text-sm font-medium text-stone-600">No appliance linked</p>
              <p className="mt-0.5 text-xs text-stone-400">
                This task is not associated with a specific appliance.
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-500">
            <span>{task.room}</span>
            <span>{task.frequency}</span>
            <span className={priorityClasses[task.priority]}>{task.priority} priority</span>
          </div>
        </div>

        <div className="flex min-w-[180px] flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-left lg:text-right">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-stone-500">Due date</p>
            <p className="mt-1 text-sm font-medium text-stone-700">
              {formatMaintenanceDate(task.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-stone-500">Next due</p>
            <p className="mt-1 text-sm text-stone-600">
              {formatMaintenanceDate(task.nextDueDate)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewTask(task)}
            className="mt-2 rounded-md text-left text-sm font-medium text-[#4F6655] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
          >
            View task
          </button>
        </div>
      </div>
    </Card>
  );
}

export default MaintenanceTaskCard;
