import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddRoomForm, { type RoomDraft } from "../components/AddRoomForm";
import Card from "../components/Card";
import EditRoomForm from "../components/EditRoomForm";
import RoomEmptyState from "../components/RoomEmptyState";
import RoomCard from "../components/RoomCard";
import RoomDetails from "../components/RoomDetails";
import { useHomeData } from "../context/useHomeData";
import { roomTypes, type Room, type RoomType } from "../types/room";
import { filterRooms, type RoomFilters } from "../utils/roomFilters";
import { getRoomSummary } from "../utils/roomSummary";
import { sortRoomApplianceCounts, type RoomSortOption } from "../utils/roomSorting";
import type { SearchNavigationState } from "../types/search";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
  type RoomApiModel,
  type RoomWriteData,
} from "../services/roomsApi";

type ApiBackedRoom = Room & { apiId: string };

const toRoomType = (type: string): RoomType =>
  roomTypes.includes(type as RoomType) ? type as RoomType : "Other";

const toNumericId = (id: string): number => {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash) || 1;
};

const toUiRoom = (room: RoomApiModel): ApiBackedRoom => ({
  apiId: room.id,
  id: toNumericId(room.id),
  name: room.name,
  description: room.description ?? "",
  type: toRoomType(room.type),
  icon: room.icon ?? "room",
});

const toApiRoom = (room: Omit<Room, "id">): RoomWriteData => ({
  name: room.name,
  description: room.description,
  type: room.type,
  icon: room.icon,
});

const defaultRoomFilters: RoomFilters = {
  searchQuery: "",
  type: "all",
};

function MyHome() {
  const location = useLocation();
  const { appliances, setAppliances } = useHomeData();
  const [rooms, setRooms] = useState<ApiBackedRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const navigationState = location.state as SearchNavigationState | null;
  const selectedRoomId = navigationState?.roomId;
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(() =>
    selectedRoomId === undefined
      ? null
        : null,
  );
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<RoomFilters>(defaultRoomFilters);
  const [sortOption, setSortOption] = useState<RoomSortOption>("nameAsc");

  useEffect(() => {
    let isCurrent = true;

    const loadRooms = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const apiRooms = await getRooms();
        if (isCurrent) {
          setRooms(apiRooms.map((room) => toUiRoom(room)));
        }
      } catch {
        if (isCurrent) {
          setErrorMessage("We couldn't load your rooms. Please try again.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    void loadRooms();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    setSelectedRoom(
      selectedRoomId === undefined
        ? null
        : rooms.find((room) => room.id === selectedRoomId) ?? null,
    );
  }, [location.key, rooms, selectedRoomId]);
  const roomSummary = getRoomSummary(rooms, appliances);
  const visibleRoomSummaries = sortRoomApplianceCounts(
    filterRooms(rooms, filters).map((room) => roomSummary.roomApplianceCounts.find((item) => item.room.id === room.id)).filter(
      (item): item is NonNullable<typeof item> => Boolean(item),
    ),
    sortOption,
  );
  const hasActiveFilters = Boolean(filters.searchQuery.trim()) || filters.type !== "all";

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">Home profile</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
            My Home
          </h1>

          <p className="mt-2 text-stone-500">
            Manage your home information and rooms.
          </p>
        </div>

        <button type="button" onClick={() => setIsRoomFormOpen(true)} className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">
          + Add Room
        </button>
      </div>

      {/* Home Information */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#20211F]">
          Home Information
        </h2>

        <Card className="mt-4 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-stone-500">Home Name</p>
              <p className="mt-2 font-medium text-[#20211F]">My Home</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Home Type</p>
              <p className="mt-2 font-medium text-[#20211F]">Apartment</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Address</p>
              <p className="mt-2 font-medium text-[#20211F]">Not added yet</p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Year Added</p>
              <p className="mt-2 font-medium text-[#20211F]">2026</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Home Overview */}
      <section className="mt-8" aria-labelledby="home-overview-title">
        <h2 id="home-overview-title" className="text-xl font-semibold text-[#20211F]">Home Overview</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total rooms", roomSummary.totalRooms, "Rooms in your home"],
            ["Total appliances", roomSummary.totalAppliances, "All tracked appliances"],
            ["Assigned to rooms", roomSummary.assignedAppliances, "Organized by room"],
            ["Unassigned appliances", roomSummary.unassignedAppliances, "Need a room assignment"],
          ].map(([label, value, description]) => (
            <Card key={label} className="p-5">
              <p className="text-sm text-stone-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#20211F]">{value}</p>
              <p className="mt-1 text-xs text-stone-500">{description}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-4 p-5">
          <h3 className="font-semibold text-[#20211F]">Appliances by room</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roomSummary.roomApplianceCounts.map(({ room, applianceCount }) => (
              <div key={room.id} className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
                <span className="text-sm text-stone-600">{room.name}</span>
                <span className="font-semibold text-[#20211F]">{applianceCount}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Rooms */}
      <section className="mt-8">
        <div>
          <h2 className="text-xl font-semibold text-[#20211F]">Rooms</h2>
          <p className="mt-1 text-sm text-stone-500">
            Organize appliances and maintenance by room.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-medium text-stone-700 sm:col-span-2 lg:col-span-2">
            Search rooms
            <input
              type="search"
              value={filters.searchQuery}
              onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, searchQuery: event.target.value }))}
              placeholder="Search by room name or description..."
              aria-label="Search rooms"
              className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
            />
          </label>

          <label className="text-sm font-medium text-stone-700">
            Room type
            <select
              value={filters.type}
              onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, type: event.target.value as RoomType | "all" }))}
              aria-label="Filter rooms by type"
              className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
            >
              <option value="all">All room types</option>
              {roomTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setFilters(defaultRoomFilters)}
            disabled={!hasActiveFilters}
            className="justify-self-start rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>

          <label className="text-sm font-medium text-stone-700">
            Sort rooms
            <select aria-label="Sort rooms" value={sortOption} onChange={(event) => setSortOption(event.target.value as RoomSortOption)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1">
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
              <option value="appliancesDesc">Most appliances</option>
              <option value="appliancesAsc">Fewest appliances</option>
            </select>
          </label>
        </div>

        {errorMessage && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-500">
            Loading rooms...
          </div>
        ) : errorMessage ? null : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.length === 0 ? (
            <RoomEmptyState
              title="No rooms yet"
              description="Rooms help organize your appliances and home information in one place."
              actionLabel="Add Room"
              onAction={() => setIsRoomFormOpen(true)}
            />
          ) : visibleRoomSummaries.length > 0 ? visibleRoomSummaries.map(({ room, applianceCount }) => (
            <RoomCard key={room.id} room={room} applianceCount={applianceCount} onViewRoom={setSelectedRoom} />
          )) : (
            <RoomEmptyState
              title="No rooms match these filters"
              description="Try clearing one or more filters to see more rooms."
              actionLabel="Clear Filters"
              onAction={() => setFilters(defaultRoomFilters)}
            />
          )}
        </div>
        )}
      </section>

      {isRoomFormOpen && (
        <AddRoomForm
          onClose={() => setIsRoomFormOpen(false)}
          onSave={async (room: RoomDraft) => {
            try {
              setErrorMessage(null);
              const createdRoom = await createRoom(toApiRoom(room));
              setRooms((currentRooms) => [
                ...currentRooms,
                toUiRoom(createdRoom),
              ]);
              setIsRoomFormOpen(false);
            } catch {
              setErrorMessage("We couldn't save this room. Please try again.");
            }
          }}
        />
      )}

      {selectedRoom && (
        <RoomDetails
          room={selectedRoom}
          appliances={appliances}
          onClose={() => setSelectedRoom(null)}
          onDelete={async () => {
            const room = rooms.find((currentRoom) => currentRoom.id === selectedRoom.id);
            if (!room) return;

            try {
              setErrorMessage(null);
              await deleteRoom(room.apiId);
              setRooms((currentRooms) =>
                currentRooms.filter((currentRoom) => currentRoom.apiId !== room.apiId),
              );
              setAppliances((currentAppliances) =>
                currentAppliances.map((appliance) =>
                  appliance.roomId === selectedRoom.id.toString()
                    ? { ...appliance, room: "Whole Home", roomId: undefined }
                    : appliance,
                ),
              );
              setSelectedRoom(null);
            } catch {
              setErrorMessage("We couldn't delete this room. Please try again.");
            }
          }}
          onEdit={() => {
            setEditingRoom(selectedRoom);
            setSelectedRoom(null);
          }}
        />
      )}

      {editingRoom && (
        <EditRoomForm
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={async (updatedRoom) => {
            const room = rooms.find((currentRoom) => currentRoom.id === updatedRoom.id);
            if (!room) return;

            try {
              setErrorMessage(null);
              await updateRoom(room.apiId, toApiRoom(updatedRoom));
              setRooms((currentRooms) =>
                currentRooms.map((currentRoom) =>
                  currentRoom.apiId === room.apiId
                    ? { ...updatedRoom, apiId: room.apiId }
                    : currentRoom,
                ),
              );
              setEditingRoom(null);
            } catch {
              setErrorMessage("We couldn't update this room. Please try again.");
            }
          }}
        />
      )}
    </div>
  );
}

export default MyHome;
