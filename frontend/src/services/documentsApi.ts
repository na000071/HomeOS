import { del, get, getBlob, post, put } from "./api";

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
  contentType: string | null;
  fileSize: number | null;
  hasFile: boolean;
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

export type DocumentUploadData = Omit<DocumentWriteData, "fileName" | "fileType" | "dateAdded"> & {
  file: File;
};

export const uploadDocument = (data: DocumentUploadData) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("category", data.category);
  formData.append("description", data.description ?? "");
  formData.append("applianceId", data.applianceId ?? "");
  formData.append("expenseId", data.expenseId ?? "");
  formData.append("notes", data.notes ?? "");
  formData.append("file", data.file);
  return post<DocumentApiModel>("/Documents/upload", formData);
};

export const downloadDocument = (id: string) => getBlob(`/Documents/${id}/download`);