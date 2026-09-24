export type WarrantyStatus = "Active" | "Expiring Soon" | "Expired";

export const warrantyStatuses = [
  "Active",
  "Expiring Soon",
  "Expired",
] as const satisfies readonly WarrantyStatus[];

export interface Warranty {
  id: number;
  applianceId: number;
  provider: string;
  warrantyType: string;
  startDate: string;
  endDate: string;
  coverage: string;
  notes: string;
  status: WarrantyStatus;
}