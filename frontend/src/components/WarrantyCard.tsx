import { getWarrantyExpirationInfo } from "../services/warrantyDateService";
import type { Warranty } from "../types/warranty.ts";
import { getApplianceById } from "../utils/applianceUtils";
import Card from "./Card";
import WarrantyEmptyState from "./WarrantyEmptyState";
import WarrantyStatusBadge from "./WarrantyStatusBadge";

type WarrantyCardProps = {
  warranty: Warranty;
  onViewWarranty: (warranty: Warranty) => void;
};

function WarrantyCard({ warranty, onViewWarranty }: WarrantyCardProps) {
  const appliance = getApplianceById(warranty.applianceId);
  const expirationInfo = getWarrantyExpirationInfo(warranty.endDate);
  const applianceLabel = appliance
    ? `${appliance.brand} ${appliance.name}`
    : "Appliance unavailable";
  const hasMissingInformation = !warranty.provider || !warranty.warrantyType || !warranty.endDate;

  if (!appliance || hasMissingInformation) {
    return (
      <Card className="p-5">
        <WarrantyEmptyState
          title={!appliance ? "Appliance unavailable" : "Warranty information incomplete"}
          description={!appliance
            ? "This warranty points to an appliance that is no longer available. Review the warranty record to repair the relationship."
            : "Some warranty details are missing, so this coverage cannot be fully displayed."}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-sky-950">{applianceLabel}</h2>
            <WarrantyStatusBadge status={warranty.status} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-stone-100 pt-4 text-sm sm:grid-cols-3 sm:gap-6">
            <div className="min-w-0">
              <p className="text-stone-500">Provider</p>
              <p className="mt-1 font-medium text-stone-800">{warranty.provider}</p>
            </div>
            <div className="min-w-0">
              <p className="text-stone-500">Warranty type</p>
              <p className="mt-1 font-medium text-stone-800">{warranty.warrantyType}</p>
            </div>
            <div className="min-w-0">
              <p className="text-stone-500">Expiration</p>
              <p className="mt-1 break-words font-medium text-stone-800">
                {!expirationInfo.isValid
                  ? "Expiration unavailable"
                  : expirationInfo.daysRemaining !== null && expirationInfo.daysRemaining >= 0
                    ? `${expirationInfo.daysRemaining} days remaining`
                    : "Expired"}
              </p>
              <p className="mt-1 break-words text-xs text-stone-500">{expirationInfo.expirationDateLabel}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewWarranty(warranty)}
            className="mt-5 rounded-md text-left text-sm font-medium text-[#1677B8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            View warranty
          </button>
        </div>
      </div>
    </Card>
  );
}

export default WarrantyCard;