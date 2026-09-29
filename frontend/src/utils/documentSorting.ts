import type { Document } from "../types/document";

export type DocumentSortOption =
  | "newest"
  | "oldest"
  | "nameAsc"
  | "nameDesc"
  | "categoryAsc";

const getDocumentDateValue = (dateAdded: string): number => {
  const timestamp = Date.parse(dateAdded);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortDocuments = (
  documents: Document[],
  sortOption: DocumentSortOption,
): Document[] => [...documents].sort((firstDocument, secondDocument) => {
  switch (sortOption) {
    case "oldest":
      return getDocumentDateValue(firstDocument.dateAdded) - getDocumentDateValue(secondDocument.dateAdded);
    case "nameAsc":
      return firstDocument.name.localeCompare(secondDocument.name);
    case "nameDesc":
      return secondDocument.name.localeCompare(firstDocument.name);
    case "categoryAsc":
      return firstDocument.category.localeCompare(secondDocument.category);
    case "newest":
    default:
      return getDocumentDateValue(secondDocument.dateAdded) - getDocumentDateValue(firstDocument.dateAdded);
  }
});