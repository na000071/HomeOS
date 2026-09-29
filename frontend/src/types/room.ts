export type RoomType =
  | "Kitchen"
  | "Living Room"
  | "Bedroom"
  | "Bathroom"
  | "Dining Room"
  | "Office"
  | "Garage"
  | "Basement"
  | "Laundry Room"
  | "Other";

export const roomTypes = [
  "Kitchen",
  "Living Room",
  "Bedroom",
  "Bathroom",
  "Dining Room",
  "Office",
  "Garage",
  "Basement",
  "Laundry Room",
  "Other",
] as const satisfies readonly RoomType[];

export interface Room {
  id: number;
  name: string;
  description: string;
  type: RoomType;
  icon: string;
}