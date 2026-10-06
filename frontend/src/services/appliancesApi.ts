import type { Appliance } from "../utils/applianceUtils";
import { del, get, post, put } from "./api";

export type ApplianceApiModel = Omit<
  Appliance,
  "id" | "room" | "roomId" | "purchaseDate" | "purchasePrice" | "model" | "serialNumber" | "notes"
> & {
  id: string;
  roomId: string | null;
  model: string | null;
  purchaseDate: string;
  purchasePrice: number;
  serialNumber: string | null;
  notes: string | null;
};

export type ApplianceWriteData = Omit<ApplianceApiModel, "id">;

export const getAppliances = () => get<ApplianceApiModel[]>("/Appliances");

export const getAppliance = (id: string) =>
  get<ApplianceApiModel>(`/Appliances/${id}`);

export const createAppliance = (data: ApplianceWriteData) =>
  post<ApplianceApiModel>("/Appliances", data);

export const updateAppliance = (id: string, data: ApplianceWriteData) =>
  put<void>(`/Appliances/${id}`, { ...data, id });

export const deleteAppliance = (id: string) => del(`/Appliances/${id}`);