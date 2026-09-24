import type {
  MaintenanceFrequency,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceTask,
} from "../types/maintenance";

export type MaintenanceScheduleInput = {
  dueDate: string;
  lastCompletedDate: string | null;
  frequency: MaintenanceFrequency;
};

export type MaintenanceSchedule = {
  nextDueDate: string;
  status: MaintenanceStatus;
};

export type MaintenanceTaskInput = {
  title: string;
  description: string;
  applianceId: number | null;
  room: string;
  dueDate: string;
  frequency: MaintenanceFrequency;
  priority: MaintenancePriority;
};

const frequencyMonths: Record<Exclude<MaintenanceFrequency, "One-time">, number> = {
  Monthly: 1,
  "Every 3 Months": 3,
  "Every 6 Months": 6,
  Yearly: 12,
};

const parseDate = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getCurrentDate = (): string => formatDate(new Date());

export const formatMaintenanceDate = (
  value: string,
  month: "short" | "long" = "short",
): string =>
  parseDate(value).toLocaleDateString("en-US", {
    month,
    day: "numeric",
    year: "numeric",
  });

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDayOfMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(originalDay, lastDayOfMonth));

  return result;
};

export const calculateNextDueDate = ({
  dueDate,
  lastCompletedDate,
  frequency,
}: MaintenanceScheduleInput): string => {
  if (frequency === "One-time") {
    return dueDate;
  }

  const anchorDate = parseDate(lastCompletedDate ?? dueDate);
  return formatDate(addMonths(anchorDate, frequencyMonths[frequency]));
};

export const determineMaintenanceStatus = (
  { dueDate, lastCompletedDate, frequency }: MaintenanceScheduleInput,
  referenceDate = new Date(),
): MaintenanceStatus => {
  if (frequency === "One-time" && lastCompletedDate) {
    return "Completed";
  }

  const nextDueDate = parseDate(
    calculateNextDueDate({ dueDate, lastCompletedDate, frequency }),
  );
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const daysUntilDue = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilDue < 0) {
    return "Overdue";
  }

  if (daysUntilDue <= 14) {
    return "Due Soon";
  }

  return "Upcoming";
};

export const calculateMaintenanceSchedule = (
  input: MaintenanceScheduleInput,
  referenceDate?: Date,
): MaintenanceSchedule => ({
  nextDueDate: calculateNextDueDate(input),
  status: determineMaintenanceStatus(input, referenceDate),
});

export const createMaintenanceTask = (
  input: MaintenanceTaskInput,
  id = Date.now(),
): MaintenanceTask => {
  const schedule = calculateMaintenanceSchedule({
    dueDate: input.dueDate,
    lastCompletedDate: null,
    frequency: input.frequency,
  });

  return {
    ...input,
    id,
    status: schedule.status,
    lastCompletedDate: null,
    nextDueDate: schedule.nextDueDate,
  };
};

export const updateMaintenanceTaskSchedule = (task: MaintenanceTask): MaintenanceTask => ({
  ...task,
  ...calculateMaintenanceSchedule(task),
});

export const completeMaintenanceTask = (
  task: MaintenanceTask,
  completionDate = getCurrentDate(),
): MaintenanceTask => {
  const completedTask = {
    ...task,
    lastCompletedDate: completionDate,
  };

  return {
    ...completedTask,
    nextDueDate: calculateNextDueDate({
      dueDate: completedTask.dueDate,
      lastCompletedDate: completedTask.lastCompletedDate,
      frequency: completedTask.frequency,
    }),
    status: "Completed",
  };
};