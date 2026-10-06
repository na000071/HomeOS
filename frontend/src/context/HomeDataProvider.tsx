import { useEffect, useMemo, useState } from "react";
import type { MaintenanceTask } from "../types/maintenance";
import type { Expense } from "../types/expense";
import type { Warranty } from "../types/warranty.ts";
import type { Document } from "../types/document";
import type { Reminder } from "../types/reminder";
import type { Appliance } from "../utils/applianceUtils";
import type { Room, RoomType } from "../types/room";
import { HomeDataContext, type ApiBacked } from "./homeDataContext";
import { getAppliances } from "../services/appliancesApi";
import { getMaintenanceTasks } from "../services/maintenanceApi";
import { getWarranties } from "../services/warrantiesApi";
import { getExpenses } from "../services/expensesApi";
import { getDocuments } from "../services/documentsApi";
import { getReminders } from "../services/remindersApi";
import { getRooms } from "../services/roomsApi";
import type { MaintenanceFrequency, MaintenancePriority, MaintenanceStatus } from "../types/maintenance";
import type { WarrantyStatus } from "../types/warranty";
import type { ExpenseCategory } from "../types/expense";
import type { DocumentCategory, DocumentFileType } from "../types/document";
import type { ReminderPriority, ReminderStatus, ReminderType } from "../types/reminder";

const toNumericId = (id: string): number => {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash) || 1;
};

const dateOnly = (value: string | null): string => value?.split("T")[0] ?? "";

export function HomeDataProvider({ children }: { children: React.ReactNode }) {
  const [appliances, setAppliances] = useState<ApiBacked<Appliance>[]>([]);
  const [rooms, setRooms] = useState<ApiBacked<Room>[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<ApiBacked<MaintenanceTask>[]>([]);
  const [warranties, setWarranties] = useState<ApiBacked<Warranty>[]>([]);
  const [expenses, setExpenses] = useState<ApiBacked<Expense>[]>([]);
  const [documents, setDocuments] = useState<ApiBacked<Document>[]>([]);
  const [reminders, setReminders] = useState<ApiBacked<Reminder>[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadData = async () => {
      setDataLoadError(null);
      setIsDataLoading(true);

      try {
        const [apiAppliances, apiRooms, apiTasks, apiWarranties, apiExpenses, apiDocuments, apiReminders] = await Promise.all([
          getAppliances(),
          getRooms(),
          getMaintenanceTasks(),
          getWarranties(),
          getExpenses(),
          getDocuments(),
          getReminders(),
        ]);

        if (!isCurrent) return;

        setDataLoadError(null);

        setAppliances(apiAppliances.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          name: item.name,
          brand: item.brand,
          room: "",
          roomId: item.roomId ? toNumericId(item.roomId).toString() : undefined,
          warranty: item.warranty,
          model: item.model ?? "",
          purchaseDate: dateOnly(item.purchaseDate),
          category: item.category,
          serialNumber: item.serialNumber ?? "",
          purchasePrice: item.purchasePrice.toString(),
          notes: item.notes ?? "",
        })));
        setRooms(apiRooms.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          name: item.name,
          description: item.description ?? "",
          type: item.type as RoomType,
          icon: item.icon ?? "room",
        })));
        setMaintenanceTasks(apiTasks.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          title: item.title,
          description: item.description ?? "",
          applianceId: item.applianceId ? toNumericId(item.applianceId) : null,
          room: item.room,
          dueDate: dateOnly(item.dueDate),
          frequency: item.frequency as MaintenanceFrequency,
          status: item.status as MaintenanceStatus,
          lastCompletedDate: dateOnly(item.lastCompletedDate),
          nextDueDate: dateOnly(item.nextDueDate),
          priority: item.priority as MaintenancePriority,
        })));
        setWarranties(apiWarranties.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          applianceId: item.applianceId ? toNumericId(item.applianceId) : 0,
          provider: item.provider,
          warrantyType: item.warrantyType,
          startDate: dateOnly(item.startDate),
          endDate: dateOnly(item.endDate),
          coverage: item.coverage,
          notes: item.notes ?? "",
          status: item.status as WarrantyStatus,
        })));
        setExpenses(apiExpenses.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          category: item.category as ExpenseCategory,
          description: item.description,
          amount: item.amount,
          date: dateOnly(item.date),
          applianceId: item.applianceId ? toNumericId(item.applianceId) : undefined,
          maintenanceTaskId: item.maintenanceTaskId ? toNumericId(item.maintenanceTaskId) : undefined,
          notes: item.notes ?? "",
        })));
        setDocuments(apiDocuments.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          name: item.name,
          category: item.category as DocumentCategory,
          fileType: item.fileType as DocumentFileType,
          fileName: item.fileName,
          dateAdded: dateOnly(item.dateAdded),
          description: item.description ?? "",
          applianceId: item.applianceId ? toNumericId(item.applianceId) : undefined,
          expenseId: item.expenseId ? toNumericId(item.expenseId) : undefined,
          notes: item.notes ?? "",
        })));
        setReminders(apiReminders.map((item) => ({
          apiId: item.id,
          id: toNumericId(item.id),
          title: item.title,
          description: item.description ?? "",
          type: item.type as ReminderType,
          dueDate: dateOnly(item.dueDate),
          priority: item.priority as ReminderPriority,
          status: item.status as ReminderStatus,
          applianceId: item.applianceId ? toNumericId(item.applianceId) : undefined,
          maintenanceTaskId: item.maintenanceTaskId ? toNumericId(item.maintenanceTaskId) : undefined,
          warrantyId: item.warrantyId ? toNumericId(item.warrantyId) : undefined,
          expenseId: item.expenseId ? toNumericId(item.expenseId) : undefined,
        })));
      } catch {
        if (isCurrent) setDataLoadError("We couldn't load your HomeOS data. Please try again.");
      } finally {
        if (isCurrent) setIsDataLoading(false);
      }
    };

    void loadData();
    return () => { isCurrent = false; };
  }, []);

  const value = useMemo(
    () => ({
      appliances,
      setAppliances,
      rooms,
      setRooms,
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
      isDataLoading,
      dataLoadError,
    }),
    [appliances, rooms, maintenanceTasks, warranties, expenses, documents, reminders, isDataLoading, dataLoadError],
  );

  return <HomeDataContext.Provider value={value}>{children}</HomeDataContext.Provider>;
}