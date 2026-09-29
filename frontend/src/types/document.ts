export type DocumentCategory =
  | "Receipt"
  | "Warranty"
  | "Manual"
  | "Invoice"
  | "Insurance"
  | "Lease"
  | "Other";

export type DocumentFileType = "PDF" | "JPG" | "PNG" | "DOCX";

export const documentCategories = [
  "Receipt",
  "Warranty",
  "Manual",
  "Invoice",
  "Insurance",
  "Lease",
  "Other",
] as const satisfies readonly DocumentCategory[];

export const documentFileTypes = ["PDF", "JPG", "PNG", "DOCX"] as const satisfies readonly DocumentFileType[];

export interface Document {
  id: number;
  name: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  fileName: string;
  dateAdded: string;
  description: string;
  applianceId?: number;
  expenseId?: number;
  notes: string;
}