import type { WarrantyStatus } from "../types/warranty.ts";

type WarrantyStatusBadgeProps = {
  status: WarrantyStatus;
};

const statusClasses: Record<WarrantyStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  "Expiring Soon": "bg-amber-50 text-amber-700",
  Expired: "bg-stone-100 text-stone-700",
};

function WarrantyStatusBadge({ status }: WarrantyStatusBadgeProps) {
  return (
    <span
      aria-label={`Warranty status: ${status}`}
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default WarrantyStatusBadge;