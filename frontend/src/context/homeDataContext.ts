import { createContext } from "react";
import type { MaintenanceTask } from "../types/maintenance";
import type { Expense } from "../types/expense";
import type { Warranty } from "../types/warranty.ts";
import type { Appliance } from "../utils/applianceUtils";

export type HomeDataContextValue = {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
  maintenanceTasks: MaintenanceTask[];
  setMaintenanceTasks: React.Dispatch<React.SetStateAction<MaintenanceTask[]>>;
  warranties: Warranty[];
  setWarranties: React.Dispatch<React.SetStateAction<Warranty[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
};

export const HomeDataContext = createContext<HomeDataContextValue | null>(null);