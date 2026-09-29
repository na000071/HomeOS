import { useMemo, useState } from "react";
import { appliancesData } from "../data/appliancesData";
import { maintenanceData } from "../data/maintenanceData";
import { warrantiesData } from "../data/warrantiesData";
import { expensesData } from "../data/expensesData";
import { documentsData } from "../data/documentsData";
import type { MaintenanceTask } from "../types/maintenance";
import type { Expense } from "../types/expense";
import type { Warranty } from "../types/warranty.ts";
import type { Document } from "../types/document";
import type { Appliance } from "../utils/applianceUtils";
import { HomeDataContext } from "./homeDataContext";

export function HomeDataProvider({ children }: { children: React.ReactNode }) {
  const [appliances, setAppliances] = useState<Appliance[]>(appliancesData);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(maintenanceData);
  const [warranties, setWarranties] = useState<Warranty[]>(warrantiesData);
  const [expenses, setExpenses] = useState<Expense[]>(expensesData);
  const [documents, setDocuments] = useState<Document[]>(documentsData);

  const value = useMemo(
    () => ({
      appliances,
      setAppliances,
      maintenanceTasks,
      setMaintenanceTasks,
      warranties,
      setWarranties,
      expenses,
      setExpenses,
      documents,
      setDocuments,
    }),
    [appliances, maintenanceTasks, warranties, expenses, documents],
  );

  return <HomeDataContext.Provider value={value}>{children}</HomeDataContext.Provider>;
}