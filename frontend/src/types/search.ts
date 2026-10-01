export type SearchResultType =
  | "appliance"
  | "maintenance"
  | "warranty"
  | "expense"
  | "document"
  | "reminder"
  | "room";

export type SearchResultFilter = "all" | SearchResultType;

export type SearchRelatedInformation = {
  id: number;
  title: string;
  type: SearchResultType;
};

export type SearchResult = {
  id: number;
  title: string;
  type: SearchResultType;
  description: string;
  route: string;
  related?: SearchRelatedInformation[];
};

export type SearchNavigationState = {
  applianceId?: number;
  maintenanceTaskId?: number;
  warrantyId?: number;
  expenseId?: number;
  documentId?: number;
  reminderId?: number;
  roomId?: number;
};