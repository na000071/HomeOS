import type { Appliance } from "./applianceUtils";
import type { Room } from "../types/room";

export type RoomApplianceCount = {
  room: Room;
  applianceCount: number;
};

export type RoomSummary = {
  totalRooms: number;
  totalAppliances: number;
  assignedAppliances: number;
  unassignedAppliances: number;
  roomApplianceCounts: RoomApplianceCount[];
};

export const getRoomSummary = (
  rooms: Room[],
  appliances: Appliance[],
): RoomSummary => {
  const roomIds = new Set(rooms.map((room) => room.id.toString()));
  const assignedAppliances = appliances.filter(
    (appliance) => appliance.roomId !== undefined && roomIds.has(appliance.roomId),
  ).length;

  return {
    totalRooms: rooms.length,
    totalAppliances: appliances.length,
    assignedAppliances,
    unassignedAppliances: appliances.length - assignedAppliances,
    roomApplianceCounts: rooms.map((room) => ({
      room,
      applianceCount: appliances.filter((appliance) => appliance.roomId === room.id.toString()).length,
    })),
  };
};