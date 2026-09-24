import { maintenanceData } from "../data/maintenanceData";
import { warrantiesData } from "../data/warrantiesData";
import { formatMaintenanceDate } from "../services/maintenanceDateService";
import {
  getWarrantyExpirationInfo,
  withCalculatedWarrantyStatus,
} from "../services/warrantyDateService";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import WarrantyStatusBadge from "./WarrantyStatusBadge";
import WarrantyEmptyState from "./WarrantyEmptyState.tsx";
import type { Appliance } from "../utils/applianceUtils";

type ApplianceDetailsProps = {
  appliance: Appliance;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
  onAddMaintenance: () => void;
    onViewWarranty: (warrantyId: number) => void;
  onAddWarranty: () => void;
  };
  
  function ApplianceDetails({
    appliance,
    onClose,
    onEdit,
    onDelete,
    onAddMaintenance,
    onViewWarranty,
    onAddWarranty,
  }: ApplianceDetailsProps) {
    const maintenanceTasks = maintenanceData.filter(
      (task) => task.applianceId === appliance.id,
    );
    const applianceWarrantyRecord = warrantiesData.find(
      (warranty) => warranty.applianceId === appliance.id,
    );
    const applianceWarranty = applianceWarrantyRecord
      ? withCalculatedWarrantyStatus(applianceWarrantyRecord)
      : null;
    const warrantyExpiration = applianceWarranty
      ? getWarrantyExpirationInfo(applianceWarranty.endDate)
      : null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-stone-400">
                {appliance.category}
              </p>
  
              <h2 className="mt-1 text-2xl font-semibold text-[#20211F]">
                {appliance.name}
              </h2>
  
              <p className="mt-1 text-stone-500">
                {appliance.brand}
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="text-2xl text-stone-400 hover:text-stone-700"
            >
              ×
            </button>
          </div>
  
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-stone-400">Model</p>
              <p className="mt-1 text-stone-700">
                {appliance.model}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Serial Number</p>
              <p className="mt-1 text-stone-700">
                {appliance.serialNumber}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Room</p>
              <p className="mt-1 text-stone-700">
                {appliance.room}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Purchase Date</p>
              <p className="mt-1 text-stone-700">
                {appliance.purchaseDate}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Purchase Price</p>
              <p className="mt-1 text-stone-700">
                ${appliance.purchasePrice}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Warranty</p>
              <p className="mt-1 text-stone-700">
                {appliance.warranty}
              </p>
            </div>
          </div>
  
          <div className="mt-6 border-t border-stone-100 pt-6">
            <p className="text-sm text-stone-400">Notes</p>
            <p className="mt-1 text-stone-700">
              {appliance.notes || "No notes"}
            </p>
          </div>

          <div className="mt-8 border-t border-stone-100 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-stone-400">Maintenance</p>
                <h3 className="mt-1 text-lg font-semibold text-[#20211F]">
                  Appliance maintenance
                </h3>
              </div>

              <span className="text-sm text-stone-500">
                {maintenanceTasks.length} {maintenanceTasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            {maintenanceTasks.length > 0 ? (
              <div className="mt-4 space-y-3">
                {maintenanceTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-stone-800">{task.title}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        Next due {formatMaintenanceDate(task.nextDueDate)} · {task.frequency}
                      </p>
                    </div>

                    <MaintenanceStatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5">
                <p className="font-medium text-stone-700">No maintenance tasks yet</p>
                <p className="mt-1 text-sm text-stone-500">
                  Add a routine to keep this appliance in good working order.
                </p>
                <button
                  type="button"
                  onClick={onAddMaintenance}
                  className="mt-4 rounded-lg bg-[#5E7563] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F6655]"
                >
                  Add maintenance task
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-stone-100 pt-6">
            <p className="text-sm text-stone-500">Warranty</p>
            <h3 className="mt-1 text-lg font-semibold text-[#20211F]">Appliance warranty</h3>

            {applianceWarranty && warrantyExpiration ? (
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{applianceWarranty.provider}</p>
                    <p className="mt-1 text-sm text-stone-500">{applianceWarranty.warrantyType}</p>
                  </div>
                  <WarrantyStatusBadge status={applianceWarranty.status} />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-stone-500">End date</p>
                    <p className="mt-1 text-stone-800">{warrantyExpiration.expirationDateLabel}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Expiration</p>
                    <p className="mt-1 text-stone-800">
                      {!warrantyExpiration.isValid
                        ? "Expiration unavailable"
                        : warrantyExpiration.daysRemaining !== null && warrantyExpiration.daysRemaining >= 0
                          ? `${warrantyExpiration.daysRemaining} days remaining`
                          : "Expired"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewWarranty(applianceWarranty.id)}
                  className="mt-4 rounded-md text-sm font-medium text-[#1677B8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
                >
                  View warranty details
                </button>
              </div>
            ) : (
              <WarrantyEmptyState
                title="No warranty linked"
                description="Warranty coverage for this appliance has not been added yet."
                actionLabel="Add warranty"
                onAction={onAddWarranty}
              />
            )}
          </div>
  
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onDelete}
              className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Delete Appliance
            </button>

            <button
              onClick={onEdit}
              className="rounded-lg border border-[#5E7563] bg-white px-5 py-3 text-sm font-medium text-[#5E7563] hover:bg-[#F2F6F2]"
            >
              Edit
            </button>

            <button
              onClick={onClose}
              className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white hover:bg-[#4F6655]"
            >
              Close
            </button>
          </div>
  
        </div>
      </div>
    );
  }
  
  export default ApplianceDetails;