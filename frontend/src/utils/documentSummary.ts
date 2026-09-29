import { documentCategories, type Document, type DocumentCategory } from "../types/document";

export type DocumentSummary = {
  total: number;
  receipts: number;
  manuals: number;
  warranties: number;
  otherDocuments: number;
};

export type DocumentCategoryBreakdown = {
  category: DocumentCategory;
  count: number;
};

export const getDocumentCategoryBreakdown = (
  documents: Document[],
): DocumentCategoryBreakdown[] => documentCategories.map((category) => ({
  category,
  count: documents.filter((document) => document.category === category).length,
}));

export const getDocumentSummary = (documents: Document[]): DocumentSummary => {
  const categoryBreakdown = getDocumentCategoryBreakdown(documents);
  const getCategoryCount = (category: DocumentCategory) =>
    categoryBreakdown.find((item) => item.category === category)?.count ?? 0;

  return {
    total: documents.length,
    receipts: getCategoryCount("Receipt"),
    manuals: getCategoryCount("Manual"),
    warranties: getCategoryCount("Warranty"),
    otherDocuments: getCategoryCount("Other"),
  };
};