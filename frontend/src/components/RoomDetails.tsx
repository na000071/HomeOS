import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { maintenanceData } from "../data/maintenanceData";
import { appliancesData } from "../data/appliancesData";
import type { Room } from "../types/room";
import type { Appliance } from "../utils/applianceUtils";
import Card from "./Card";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";

type RoomDetailsProps = {
  room: Room;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  appliances?: Appliance[];
};

function RoomDetails({ room, onClose, onEdit, onDelete, appliances = appliancesData }: RoomDetailsProps) {
  const dialogRef = useModalAccessibility(onClose);
  const roomAppliances = appliances.filter((appliance) => appliance.roomId === room.id.toString());
  const roomApplianceIds = new Set(roomAppliances.map((appliance) => appliance.id));
  const roomMaintenanceTasks = maintenanceData.filter(
    (task) => task.applianceId !== null && roomApplianceIds.has(task.applianceId),
  );
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${room.name || "this room"}"? Appliances will remain in your home. This action cannot be undone.`,
    );

    if (confirmed) onDelete();
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="room-details-title" aria-describedby="room-details-description" tabIndex={-1} className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home profile</p>
            <h2 id="room-details-title" className="mt-1 text-2xl font-semibold text-sky-950">{room.name}</h2>
            <p id="room-details-description" className="mt-2 text-sm text-stone-600">Room details and related home records.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close room details" className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">×</button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-stone-500">Room type</p>
            <p className="mt-1 text-stone-800">{room.type}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Icon</p>
            <p className="mt-1 text-stone-800">{room.icon}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Description</p>
            <p className="mt-1 leading-6 text-stone-800">{room.description || "No description"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Appliances</p>
            <p className="mt-1 text-stone-800">{roomAppliances.length} {roomAppliances.length === 1 ? "appliance" : "appliances"}</p>
          </div>
        </div>

        <section className="mt-8" aria-labelledby="room-appliances-title">
          <h3 id="room-appliances-title" className="text-lg font-semibold text-[#20211F]">Room appliances</h3>
          {roomAppliances.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {roomAppliances.map((appliance) => (
                <Card key={appliance.id} className="p-4">
                  <p className="font-medium text-stone-800">{appliance.name}</p>
                  <p className="mt-1 text-sm text-stone-500">{appliance.brand} · {appliance.model}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mt-4 border-dashed bg-stone-50 p-5">
              <p className="font-medium text-stone-700">No appliances in this room</p>
              <p className="mt-1 text-sm text-stone-500">Assign an appliance to this room from the Appliance form to see it here.</p>
            </Card>
          )}
        </section>

        <section className="mt-8" aria-labelledby="room-maintenance-title">
          <h3 id="room-maintenance-title" className="text-lg font-semibold text-[#20211F]">Room maintenance</h3>
          {roomMaintenanceTasks.length > 0 ? (
            <div className="mt-4 space-y-3">
              {roomMaintenanceTasks.map((task) => (
                <Card key={task.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{task.title}</p>
                    <p className="mt-1 text-sm text-stone-500">Due {task.dueDate}</p>
                  </div>
                  <MaintenanceStatusBadge status={task.status} />
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mt-4 border-dashed bg-stone-50 p-5">
              <p className="font-medium text-stone-700">No maintenance items linked</p>
              <p className="mt-1 text-sm text-stone-500">Maintenance for appliances in this room will appear here.</p>
            </Card>
          )}
        </section>

        </div>

        <div className="mt-8 flex shrink-0 flex-col-reverse justify-end gap-3 border-t border-stone-100 bg-white pt-5 sm:flex-row">
          <button type="button" onClick={onEdit} className="rounded-lg border border-[#1677B8] bg-white px-5 py-3 text-sm font-medium text-[#1677B8] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Edit Room</button>
          <button type="button" onClick={handleDelete} className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">Delete Room</button>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Close</button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;