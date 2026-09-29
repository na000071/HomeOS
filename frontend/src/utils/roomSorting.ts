import type { RoomApplianceCount } from "./roomSummary";

export type RoomSortOption = "nameAsc" | "nameDesc" | "appliancesDesc" | "appliancesAsc";

const compareNames = (first: RoomApplianceCount, second: RoomApplianceCount): number =>
  first.room.name.localeCompare(second.room.name);

export const sortRoomApplianceCounts = (
  rooms: RoomApplianceCount[],
  sortOption: RoomSortOption,
): RoomApplianceCount[] => [...rooms].sort((first, second) => {
  switch (sortOption) {
    case "nameDesc":
      return compareNames(second, first);
    case "appliancesDesc":
      return second.applianceCount - first.applianceCount || compareNames(first, second);
    case "appliancesAsc":
      return first.applianceCount - second.applianceCount || compareNames(first, second);
    case "nameAsc":
    default:
      return compareNames(first, second);
  }
});