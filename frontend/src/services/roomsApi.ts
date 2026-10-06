import type { RoomDraft } from "../components/AddRoomForm";
import { del, get, post, put } from "./api";

export type RoomApiModel = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  icon: string | null;
};

export type RoomWriteData = RoomDraft;

export const getRooms = () => get<RoomApiModel[]>("/Rooms");

export const getRoom = (id: string) => get<RoomApiModel>(`/Rooms/${id}`);

export const createRoom = (data: RoomWriteData) =>
  post<RoomApiModel>("/Rooms", data);

export const updateRoom = (id: string, data: RoomWriteData) =>
  put<void>(`/Rooms/${id}`, { ...data, id });

export const deleteRoom = (id: string) => del(`/Rooms/${id}`);