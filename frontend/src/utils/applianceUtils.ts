import { appliancesData } from "../data/appliancesData";

export type Appliance = (typeof appliancesData)[number];
export type ApplianceSummary = Pick<Appliance, "id" | "name" | "brand">;
export type ApplianceFormValues = Omit<Appliance, "id"> & { id?: number };

export type ApplianceFilters = {
  searchQuery: string;
  room: string;
  category: string;
};

export const getApplianceById = (applianceId: number | null): Appliance | undefined => {
  if (applianceId === null) {
    return undefined;
  }

  return appliancesData.find((appliance) => appliance.id === applianceId);
};

export const filterAppliances = (
  appliances: Appliance[],
  { searchQuery, room, category }: ApplianceFilters,
): Appliance[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return appliances.filter((appliance) => {
    const searchableText = [
      appliance.name,
      appliance.brand,
      appliance.model,
      appliance.room,
      appliance.category,
    ].join(" ").toLowerCase();
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesRoom = room === "all" || appliance.room === room;
    const matchesCategory = category === "all" || appliance.category === category;

    return matchesSearch && matchesRoom && matchesCategory;
  });
};