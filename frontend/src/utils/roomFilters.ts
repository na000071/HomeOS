import type { Room, RoomType } from "../types/room";

export type RoomFilters = {
  searchQuery: string;
  type: RoomType | "all";
};

export const filterRooms = (rooms: Room[], filters: RoomFilters): Room[] => {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  return rooms.filter((room) => {
    const searchableText = `${room.name} ${room.description}`.toLowerCase();
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesType = filters.type === "all" || room.type === filters.type;

    return matchesSearch && matchesType;
  });
};