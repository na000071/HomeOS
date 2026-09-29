import type { Document } from "../types/document";

export const getMissingDocumentFields = (document: Document): string[] => [
  !document.name.trim() && "document name",
  !document.category && "category",
  !document.fileType && "file type",
  !document.fileName.trim() && "file name",
  !document.dateAdded && "date added",
].filter((field): field is string => Boolean(field));