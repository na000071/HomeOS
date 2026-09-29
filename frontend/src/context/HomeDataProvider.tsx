import { useMemo, useState } from "react";
import { appliancesData } from "../data/appliancesData";
import { maintenanceData } from "../data/maintenanceData";
import { warrantiesData } from "../data/warrantiesData";
import { expensesData } from "../data/expensesData";
import { documentsData } from "../data/documentsData";
import { remindersData } from "../data/remindersData";
import type { MaintenanceTask } from "../types/maintenance";
import type { Expense } from "../types/expense";
import type { Warranty } from "../types/warranty.ts";
import type { Document } from "../types/document";
import type { Reminder } from "../types/reminder";
import type { Appliance } from "../utils/applianceUtils";
import { HomeDataContext } from "./homeDataContext";

export function HomeDataProvider({ children }: { children: React.ReactNode }) {
  const [appliances, setAppliances] = useState<Appliance[]>(appliancesData);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(maintenanceData);
  const [warranties, setWarranties] = useState<Warranty[]>(warrantiesData);
  const [expenses, setExpenses] = useState<Expense[]>(expensesData);
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [reminders, setReminders] = useState<Reminder[]>(remindersData);

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
      reminders,
      setReminders,
    }),
    [appliances, maintenanceTasks, warranties, expenses, documents, reminders],
  );

  return <HomeDataContext.Provider value={value}>{children}</HomeDataContext.Provider>;
}