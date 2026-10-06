import { del, get, post, put } from "./api";

export type DocumentApiModel = {
  id: string;
  name: string;
  category: string;
  fileType: string;
  fileName: string;
  dateAdded: string;
  description: string | null;
  applianceId: string | null;
  expenseId: string | null;
  notes: string | null;
};

export type DocumentWriteData = {
  name: string;
  category: string;
  fileType: string;
  fileName: string;
  dateAdded: string;
  description: string | null;
  applianceId: string | null;
  expenseId: string | null;
  notes: string | null;
};

export const getDocuments = () => get<DocumentApiModel[]>("/Documents");
export const getDocument = (id: string) => get<DocumentApiModel>(`/Documents/${id}`);
export const createDocument = (data: DocumentWriteData) => post<DocumentApiModel>("/Documents", data);
export const updateDocument = (id: string, data: DocumentWriteData) => put<void>(`/Documents/${id}`, { ...data, id });
export const deleteDocument = (id: string) => del(`/Documents/${id}`);