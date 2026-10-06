import { del, get, post, put } from "./api";

export type MaintenanceTaskApiModel = {
  id: string;
  title: string;
  description: string | null;
  applianceId: string | null;
  room: string;
  dueDate: string;
  frequency: string;
  status: string;
  lastCompletedDate: string | null;
  nextDueDate: string;
  priority: string;
};

export type MaintenanceTaskWriteData = {
  title: string;
  description: string;
  applianceId: string | null;
  room: string;
  dueDate: string;
  frequency: string;
  lastCompletedDate: string | null;
  nextDueDate: string;
  priority: string;
  status?: string;
};

export const getMaintenanceTasks = () => get<MaintenanceTaskApiModel[]>("/MaintenanceTasks");
export const getMaintenanceTask = (id: string) => get<MaintenanceTaskApiModel>(`/MaintenanceTasks/${id}`);
export const createMaintenanceTask = (data: MaintenanceTaskWriteData) => post<MaintenanceTaskApiModel>("/MaintenanceTasks", data);
export const updateMaintenanceTask = (id: string, data: MaintenanceTaskWriteData) => put<void>(`/MaintenanceTasks/${id}`, { ...data, id });
export const deleteMaintenanceTask = (id: string) => del(`/MaintenanceTasks/${id}`);