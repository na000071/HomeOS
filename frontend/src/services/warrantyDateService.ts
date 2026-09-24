import type { Warranty, WarrantyStatus } from "../types/warranty.ts";

const EXPIRING_SOON_DAYS = 90;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const parseDate = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    !value ||
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return new Date(Number.NaN);
  }

  return date;
};

export type WarrantyExpirationInfo = {
  isValid: boolean;
  daysRemaining: number | null;
  expirationDateLabel: string;
};

export const getWarrantyExpirationInfo = (
  endDate: string,
  referenceDate = new Date(),
): WarrantyExpirationInfo => {
  const expirationDate = parseDate(endDate);

  if (Number.isNaN(expirationDate.getTime())) {
    return {
      isValid: false,
      daysRemaining: null,
      expirationDateLabel: "Expiration date unavailable",
    };
  }

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const daysRemaining = Math.ceil(
    (expirationDate.getTime() - today.getTime()) / MILLISECONDS_PER_DAY,
  );

  return {
    isValid: true,
    daysRemaining,
    expirationDateLabel: expirationDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
};

export const determineWarrantyStatus = (
  endDate: string,
  referenceDate = new Date(),
): WarrantyStatus => {
  const { daysRemaining } = getWarrantyExpirationInfo(endDate, referenceDate);

  if (daysRemaining === null) {
    return "Expired";
  }

  if (daysRemaining < 0) {
    return "Expired";
  }

  if (daysRemaining <= EXPIRING_SOON_DAYS) {
    return "Expiring Soon";
  }

  return "Active";
};

export const withCalculatedWarrantyStatus = (
  warranty: Warranty,
  referenceDate?: Date,
): Warranty => ({
  ...warranty,
  status: determineWarrantyStatus(warranty.endDate, referenceDate),
});

export const createWarranty = (
  warrantyInput: Omit<Warranty, "id" | "status">,
  id = Date.now(),
): Warranty => ({
  ...warrantyInput,
  id,
  status: determineWarrantyStatus(warrantyInput.endDate),
});