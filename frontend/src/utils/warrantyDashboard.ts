import { warrantiesData } from "../data/warrantiesData";
import {
  getWarrantyExpirationInfo,
  withCalculatedWarrantyStatus,
} from "../services/warrantyDateService";
import type { Warranty } from "../types/warranty.ts";
import { getApplianceById } from "./applianceUtils";

export type DashboardWarranty = Warranty & {
  applianceName: string;
  applianceBrand: string;
  daysRemaining: number | null;
  expirationDateLabel: string;
};

export type WarrantyDashboardData = {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
  recentlyExpiring: DashboardWarranty[];
};

export const getWarrantyDashboardData = (
  warranties: Warranty[] = warrantiesData,
): WarrantyDashboardData => {
  const currentWarranties: DashboardWarranty[] = warranties.map((warranty) => {
    const calculatedWarranty = withCalculatedWarrantyStatus(warranty);
    const appliance = getApplianceById(warranty.applianceId);
    const expirationInfo = getWarrantyExpirationInfo(warranty.endDate);

    return {
      ...calculatedWarranty,
      applianceName: appliance?.name ?? "Appliance unavailable",
      applianceBrand: appliance?.brand ?? "",
      daysRemaining: expirationInfo.daysRemaining,
      expirationDateLabel: expirationInfo.expirationDateLabel,
    };
  });

  return {
    total: currentWarranties.length,
    active: currentWarranties.filter((warranty) => warranty.status === "Active").length,
    expiringSoon: currentWarranties.filter(
      (warranty) => warranty.status === "Expiring Soon",
    ).length,
    expired: currentWarranties.filter((warranty) => warranty.status === "Expired").length,
    recentlyExpiring: currentWarranties
      .filter((warranty) => warranty.status === "Expiring Soon")
      .sort((firstWarranty, secondWarranty) =>
        firstWarranty.endDate.localeCompare(secondWarranty.endDate),
      ),
  };
};