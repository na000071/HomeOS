import { del, get, post, put } from "./api";

export type WarrantyApiModel = {
  id: string;
  applianceId: string | null;
  provider: string;
  warrantyType: string;
  startDate: string;
  endDate: string;
  coverage: string;
  notes: string | null;
  status: string;
};

export type WarrantyWriteData = {
  applianceId: string | null;
  provider: string;
  warrantyType: string;
  startDate: string;
  endDate: string;
  coverage: string;
  notes: string | null;
  status?: string;
};

export const getWarranties = () => get<WarrantyApiModel[]>("/Warranties");
export const getWarranty = (id: string) => get<WarrantyApiModel>(`/Warranties/${id}`);
export const createWarranty = (data: WarrantyWriteData) => post<WarrantyApiModel>("/Warranties", data);
export const updateWarranty = (id: string, data: WarrantyWriteData) => put<void>(`/Warranties/${id}`, { ...data, id });
export const deleteWarranty = (id: string) => del(`/Warranties/${id}`);