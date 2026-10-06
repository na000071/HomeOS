import { createContext } from "react";
import type { MaintenanceTask } from "../types/maintenance";
import type { Expense } from "../types/expense";
import type { Warranty } from "../types/warranty.ts";
import type { Document } from "../types/document";
import type { Reminder } from "../types/reminder";
import type { Appliance } from "../utils/applianceUtils";
import type { Room } from "../types/room";

export type ApiBacked<T> = T & { apiId?: string };

export type HomeDataContextValue = {
  appliances: ApiBacked<Appliance>[];
  setAppliances: React.Dispatch<React.SetStateAction<ApiBacked<Appliance>[]>>;
  rooms: ApiBacked<Room>[];
  setRooms: React.Dispatch<React.SetStateAction<ApiBacked<Room>[]>>;
  maintenanceTasks: ApiBacked<MaintenanceTask>[];
  setMaintenanceTasks: React.Dispatch<React.SetStateAction<ApiBacked<MaintenanceTask>[]>>;
  warranties: ApiBacked<Warranty>[];
  setWarranties: React.Dispatch<React.SetStateAction<ApiBacked<Warranty>[]>>;
  expenses: ApiBacked<Expense>[];
  setExpenses: React.Dispatch<React.SetStateAction<ApiBacked<Expense>[]>>;
  documents: ApiBacked<Document>[];
  setDocuments: React.Dispatch<React.SetStateAction<ApiBacked<Document>[]>>;
  reminders: ApiBacked<Reminder>[];
  setReminders: React.Dispatch<React.SetStateAction<ApiBacked<Reminder>[]>>;
  isDataLoading: boolean;
  dataLoadError: string | null;
};

export const HomeDataContext = createContext<HomeDataContextValue | null>(null);