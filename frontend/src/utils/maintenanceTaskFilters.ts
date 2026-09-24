import type {
  MaintenanceFrequency,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceTask,
} from "../types/maintenance";

export type MaintenanceFilterValue<T> = T | "all";

export type MaintenanceTaskFilters = {
  status: MaintenanceFilterValue<MaintenanceStatus>;
  priority: MaintenanceFilterValue<MaintenancePriority>;
  applianceId: number | "all";
  room: string | "all";
  frequency: MaintenanceFilterValue<MaintenanceFrequency>;
};

export type MaintenanceSortOption =
  | "dueDateAsc"
  | "dueDateDesc"
  | "priorityDesc"
  | "priorityAsc";

const priorityRank: Record<MaintenancePriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

export const filterAndSortMaintenanceTasks = (
  tasks: MaintenanceTask[],
  filters: MaintenanceTaskFilters,
  sortOption: MaintenanceSortOption,
): MaintenanceTask[] => {
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filters.status === "all" || task.status === filters.status;
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
    const matchesAppliance =
      filters.applianceId === "all" || task.applianceId === filters.applianceId;
    const matchesRoom = filters.room === "all" || task.room === filters.room;
    const matchesFrequency =
      filters.frequency === "all" || task.frequency === filters.frequency;

    return matchesStatus && matchesPriority && matchesAppliance && matchesRoom && matchesFrequency;
  });

  return [...filteredTasks].sort((firstTask, secondTask) => {
    if (sortOption === "priorityDesc" || sortOption === "priorityAsc") {
      const priorityDifference =
        priorityRank[firstTask.priority] - priorityRank[secondTask.priority];
      return sortOption === "priorityDesc" ? -priorityDifference : priorityDifference;
    }

    const dueDateDifference = firstTask.dueDate.localeCompare(secondTask.dueDate);
    return sortOption === "dueDateDesc" ? -dueDateDifference : dueDateDifference;
  });
};