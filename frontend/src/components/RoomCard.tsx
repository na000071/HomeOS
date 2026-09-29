import type { Room } from "../types/room";
import Card from "./Card";

type RoomCardProps = {
  room: Room;
  applianceCount?: number;
  onViewRoom: (room: Room) => void;
};

function RoomCard({ room, applianceCount = 0, onViewRoom }: RoomCardProps) {
  return (
    <Card className="p-6 transition hover:border-stone-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium text-[#20211F]">{room.name}</h3>
          <p className="mt-1 text-sm text-stone-500">{room.type}</p>
          <p className="mt-2 text-sm text-stone-500">
            {applianceCount} {applianceCount === 1 ? "appliance" : "appliances"}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">{room.description}</p>
        </div>

        <span
          aria-label={`${room.name} room icon`}
          className="shrink-0 rounded-lg bg-stone-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-stone-500"
        >
          {room.icon}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onViewRoom(room)}
        aria-label={`View room: ${room.name}`}
        className="mt-6 rounded-md text-sm font-medium text-[#5E7563] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
      >
        View Room →
      </button>
    </Card>
  );
}

export default RoomCard;