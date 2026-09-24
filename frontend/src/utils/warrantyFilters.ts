import type { Warranty, WarrantyStatus } from "../types/warranty.ts";
import { getApplianceById } from "./applianceUtils";

export type WarrantyFilterValue = string | "all";

export type WarrantyFilters = {
  searchQuery: string;
  status: WarrantyFilterValue;
  applianceId: number | "all";
  warrantyType: WarrantyFilterValue;
  provider: WarrantyFilterValue;
};

export type WarrantySortOption = "expirationAsc" | "expirationDesc" | "provider" | "status";

const statusRank: Record<WarrantyStatus, number> = {
  Expired: 1,
  "Expiring Soon": 2,
  Active: 3,
};

export const filterAndSortWarranties = (
  warranties: Warranty[],
  filters: WarrantyFilters,
  sortOption: WarrantySortOption,
): Warranty[] => {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();
  const filteredWarranties = warranties.filter((warranty) => {
    const appliance = getApplianceById(warranty.applianceId);
    const searchableText = [
      warranty.provider,
      warranty.warrantyType,
      appliance?.name,
      appliance?.brand,
    ].filter(Boolean).join(" ").toLowerCase();

    return (
      (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
      (filters.status === "all" || warranty.status === filters.status) &&
      (filters.applianceId === "all" || warranty.applianceId === filters.applianceId) &&
      (filters.warrantyType === "all" || warranty.warrantyType === filters.warrantyType) &&
      (filters.provider === "all" || warranty.provider === filters.provider)
    );
  });

  return [...filteredWarranties].sort((firstWarranty, secondWarranty) => {
    if (sortOption === "provider") {
      return firstWarranty.provider.localeCompare(secondWarranty.provider);
    }

    if (sortOption === "status") {
      return statusRank[firstWarranty.status] - statusRank[secondWarranty.status];
    }

    const expirationDifference = firstWarranty.endDate.localeCompare(secondWarranty.endDate);
    return sortOption === "expirationDesc" ? -expirationDifference : expirationDifference;
  });
};