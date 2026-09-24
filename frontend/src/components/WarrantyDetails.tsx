import { formatMaintenanceDate } from "../services/maintenanceDateService";
import { getWarrantyExpirationInfo } from "../services/warrantyDateService";
import type { Warranty } from "../types/warranty.ts";
import { getApplianceById } from "../utils/applianceUtils";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import WarrantyStatusBadge from "./WarrantyStatusBadge";

type WarrantyDetailsProps = {
  warranty: Warranty;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function WarrantyDetails({ warranty, onClose, onEdit, onDelete }: WarrantyDetailsProps) {
  const dialogRef = useModalAccessibility(onClose);
  const appliance = getApplianceById(warranty.applianceId);
  const expirationInfo = getWarrantyExpirationInfo(warranty.endDate);
  const applianceLabel = appliance
    ? `${appliance.brand} ${appliance.name}`
    : "this appliance";

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete the ${warranty.provider} warranty for ${applianceLabel}? This action cannot be undone.`,
    );

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="warranty-details-title"
        aria-describedby="warranty-details-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Protection & coverage</p>
            <h2 id="warranty-details-title" className="mt-1 text-2xl font-semibold text-sky-950">
              Warranty details
            </h2>
            <p id="warranty-details-description" className="mt-2 text-sm text-stone-600">
              Coverage information for {appliance ? `${appliance.brand} ${appliance.name}` : "this appliance"}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close warranty details"
            className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-stone-500">Provider</p>
            <p className="mt-1 text-stone-800">{warranty.provider}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Warranty type</p>
            <p className="mt-1 text-stone-800">{warranty.warrantyType}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Related appliance</p>
            <p className="mt-1 text-stone-800">
              {appliance ? `${appliance.brand} ${appliance.name}` : "Appliance unavailable"}
            </p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Status</p>
            <div className="mt-1">
              <WarrantyStatusBadge status={warranty.status} />
            </div>
          </div>
          <div>
            <p className="text-sm text-stone-500">Start date</p>
            <p className="mt-1 text-stone-800">{formatMaintenanceDate(warranty.startDate, "long")}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">End date</p>
            <p className="mt-1 text-stone-800">{expirationInfo.expirationDateLabel}</p>
            <p className="mt-1 text-sm text-stone-600">
              {!expirationInfo.isValid
                ? "Expiration unavailable"
                : expirationInfo.daysRemaining !== null && expirationInfo.daysRemaining >= 0
                  ? `${expirationInfo.daysRemaining} days remaining`
                  : "Expired"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Coverage</p>
            <p className="mt-1 leading-6 text-stone-800">{warranty.coverage}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Notes</p>
            <p className="mt-1 leading-6 text-stone-800">{warranty.notes || "No notes"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-[#1677B8] bg-white px-5 py-3 text-sm font-medium text-[#1677B8] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarrantyDetails;