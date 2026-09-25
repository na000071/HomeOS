import { useState } from "react";
import { useLocation } from "react-router-dom";
import AddMaintenanceForm, { type MaintenanceTaskDraft } from "../components/AddMaintenanceForm";
import Button from "../components/Button";
import EditMaintenanceForm from "../components/EditMaintenanceForm";
import MaintenanceDetails from "../components/MaintenanceDetails";
import MaintenanceEmptyState from "../components/MaintenanceEmptyState";
import MaintenanceSummaryCard from "../components/MaintenanceSummaryCard";
import MaintenanceTaskCard from "../components/MaintenanceTaskCard";
import { useHomeData } from "../context/useHomeData";
import {
  completeMaintenanceTask,
  createMaintenanceTask,
  updateMaintenanceTaskSchedule,
} from "../services/maintenanceDateService";
import {
  maintenanceFrequencies,
  maintenancePriorities,
  maintenanceStatuses,
} from "../types/maintenance";
import type { MaintenanceTask } from "../types/maintenance";
import {
  filterAndSortMaintenanceTasks,
  type MaintenanceSortOption,
  type MaintenanceTaskFilters,
} from "../utils/maintenanceTaskFilters.ts";

function Maintenance() {
  const { maintenanceTasks: tasks, setMaintenanceTasks: setTasks, appliances } = useHomeData();
  const location = useLocation();
  const maintenanceNavigationState = location.state as {
    applianceId?: number;
    room?: string;
  } | null;
  const [isFormOpen, setIsFormOpen] = useState(
    Boolean(maintenanceNavigationState?.applianceId),
  );
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [filters, setFilters] = useState<MaintenanceTaskFilters>({
    status: "all",
    priority: "all",
    applianceId: "all",
    room: "all",
    frequency: "all",
  });
  const [sortOption, setSortOption] = useState<MaintenanceSortOption>("dueDateAsc");

  const handleSaveTask = (taskDraft: MaintenanceTaskDraft) => {
    const nextTask = createMaintenanceTask(taskDraft);

    setTasks((currentTasks) => [nextTask, ...currentTasks]);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (updatedTask: MaintenanceTask) => {
    const taskWithUpdatedSchedule = updateMaintenanceTaskSchedule(updatedTask);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskWithUpdatedSchedule.id ? taskWithUpdatedSchedule : task,
      ),
    );

    setEditingTask(null);
    setSelectedTask(taskWithUpdatedSchedule);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    setSelectedTask(null);
    setEditingTask((currentEditingTask) =>
      currentEditingTask && currentEditingTask.id === taskId ? null : currentEditingTask,
    );
  };

  const handleMarkCompleted = (taskId: number) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    const completedTask = completeMaintenanceTask(task);

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === taskId ? completedTask : currentTask,
      ),
    );
    setSelectedTask(completedTask);
  };

  const totalTasks = tasks.length;
  const dueSoonCount = tasks.filter((task) => task.status === "Due Soon").length;
  const overdueCount = tasks.filter((task) => task.status === "Overdue").length;
  const completedCount = tasks.filter((task) => task.status === "Completed").length;
  const visibleTasks = filterAndSortMaintenanceTasks(tasks, filters, sortOption);
  const roomOptions = Array.from(new Set(tasks.map((task) => task.room))).sort();
  const resetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      applianceId: "all",
      room: "all",
      frequency: "all",
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 pb-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">Home care</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-[#20211F]">
            Maintenance
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500">
            Stay ahead of routine care, seasonal upkeep, and appliance servicing across your home.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>+ Add Task</Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MaintenanceSummaryCard
          label="Total Tasks"
          value={totalTasks}
          description="Across all rooms"
          tone="default"
        />
        <MaintenanceSummaryCard
          label="Due Soon"
          value={dueSoonCount}
          description="Scheduled in the next 14 days"
          tone="warning"
        />
        <MaintenanceSummaryCard
          label="Overdue"
          value={overdueCount}
          description="Requires attention"
          tone="danger"
        />
        <MaintenanceSummaryCard
          label="Completed"
          value={completedCount}
          description="Finished this cycle"
          tone="success"
        />
      </section>

      <section className="rounded-3xl border border-stone-200/80 bg-white/90 p-4 shadow-[0_14px_40px_rgba(72,66,52,0.07)] backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#20211F]">Task List</h2>
            <p className="mt-1 text-sm text-stone-500">Prioritized routines for home upkeep</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            <label className="sr-only" htmlFor="task-status-filter">
              Filter by status
            </label>
            <select
              id="task-status-filter"
              value={filters.status}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  status: event.target.value as MaintenanceTaskFilters["status"],
                }))
              }
              className="rounded-xl border border-stone-200 bg-[#FAFAF8] px-3.5 py-2.5 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              aria-label="Filter tasks by status"
            >
              <option value="all">All Statuses</option>
              {maintenanceStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="task-priority-filter">
              Filter by priority
            </label>
            <select
              id="task-priority-filter"
              value={filters.priority}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  priority: event.target.value as MaintenanceTaskFilters["priority"],
                }))
              }
              className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              aria-label="Filter tasks by priority"
            >
              <option value="all">All Priorities</option>
              {maintenancePriorities.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="task-appliance-filter">
              Filter by appliance
            </label>
            <select
              id="task-appliance-filter"
              value={filters.applianceId}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  applianceId: event.target.value === "all" ? "all" : Number(event.target.value),
                }))
              }
              className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              aria-label="Filter tasks by appliance"
            >
              <option value="all">All Appliances</option>
              {appliances.map((appliance) => (
                <option key={appliance.id} value={appliance.id}>
                  {appliance.name} · {appliance.brand}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="task-room-filter">
              Filter by room
            </label>
            <select
              id="task-room-filter"
              value={filters.room}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  room: event.target.value,
                }))
              }
              className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              aria-label="Filter tasks by room"
            >
              <option value="all">All Rooms</option>
              {roomOptions.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="task-frequency-filter">
              Filter by frequency
            </label>
            <select
              id="task-frequency-filter"
              value={filters.frequency}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  frequency: event.target.value as MaintenanceTaskFilters["frequency"],
                }))
              }
              className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              aria-label="Filter tasks by frequency"
            >
              <option value="all">All Frequencies</option>
              {maintenanceFrequencies.map((frequency) => (
                <option key={frequency} value={frequency}>{frequency}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="task-sort">
              Sort tasks
            </label>
            <select
              id="task-sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as MaintenanceSortOption)}
              className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
              aria-label="Sort maintenance tasks"
            >
              <option value="dueDateAsc">Due date: soonest first</option>
              <option value="dueDateDesc">Due date: latest first</option>
              <option value="priorityDesc">Priority: highest first</option>
              <option value="priorityAsc">Priority: lowest first</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {tasks.length === 0 ? (
            <MaintenanceEmptyState
              title="No maintenance tasks yet"
              description="Create your first maintenance task to start organizing routine care for your home."
              actionLabel="Add maintenance task"
              onAction={() => setIsFormOpen(true)}
            />
          ) : visibleTasks.length === 0 ? (
            <MaintenanceEmptyState
              title="No tasks match these filters"
              description="Try adjusting your filters or clear them to see every maintenance task."
              actionLabel="Clear filters"
              onAction={resetFilters}
            />
          ) : (
            visibleTasks.map((task) => (
              <MaintenanceTaskCard
                key={task.id}
                task={task}
                onViewTask={(taskToView) => setSelectedTask(taskToView)}
              />
            ))
          )}
        </div>
      </section>

      {isFormOpen && (
        <AddMaintenanceForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveTask}
          initialValues={{
            applianceId: maintenanceNavigationState?.applianceId ?? null,
            room: maintenanceNavigationState?.room ?? "",
          }}
        />
      )}

      {selectedTask && !editingTask && (
        <MaintenanceDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => {
            setEditingTask(selectedTask);
            setSelectedTask(null);
          }}
          onDelete={() => handleDeleteTask(selectedTask.id)}
          onMarkCompleted={() => handleMarkCompleted(selectedTask.id)}
        />
      )}

      {editingTask && (
        <EditMaintenanceForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}
    </div>
  );
}

export default Maintenance;