import type { MaintenanceTask } from "../types/maintenance";

export type MaintenanceDashboardData = {
  total: number;
  upcoming: number;
  overdue: number;
  upcomingTasks: MaintenanceTask[];
};

export const getMaintenanceDashboardData = (
  tasks: MaintenanceTask[],
): MaintenanceDashboardData => {
  const upcomingTasks = tasks
    .filter((task) => task.status === "Upcoming" || task.status === "Due Soon")
    .sort((firstTask, secondTask) => firstTask.dueDate.localeCompare(secondTask.dueDate));

  return {
    total: tasks.length,
    upcoming: upcomingTasks.length,
    overdue: tasks.filter((task) => task.status === "Overdue").length,
    upcomingTasks,
  };
};