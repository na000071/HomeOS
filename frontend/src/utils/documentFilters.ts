import type { Document, DocumentCategory, DocumentFileType } from "../types/document";

export type DocumentFilters = {
  category: DocumentCategory | "all";
  fileType: DocumentFileType | "all";
  applianceId: number | "all";
};

export const filterDocuments = (
  documents: Document[],
  filters: DocumentFilters,
): Document[] => documents.filter((document) => (
  (filters.category === "all" || document.category === filters.category) &&
  (filters.fileType === "all" || document.fileType === filters.fileType) &&
  (filters.applianceId === "all" || document.applianceId === filters.applianceId)
));