import type { PrismaClient } from "@prisma/client";
import type { BranchAvailability, BranchSummary } from "@appointment/shared";

import { AppError } from "../../lib/errors.js";
import {
  formatDateKeyInTimeZone,
  formatMonthWindow,
  formatTimeLabelInTimeZone,
} from "../../lib/datetime.js";

const EARTH_RADIUS_KM = 6371;

const haversineDistance = (
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(destinationLatitude - originLatitude);
  const deltaLongitude = toRadians(destinationLongitude - originLongitude);
  const latitudeA = toRadians(originLatitude);
  const latitudeB = toRadians(destinationLatitude);
  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

const formatAddress = (branch: {
  city: string;
  postalCode: string;
  province: string;
  streetAddress: string;
}) =>
  `${branch.streetAddress}, ${branch.city}, ${branch.province} ${branch.postalCode}`;

const buildDirectionsUrl = (latitude: number, longitude: number) =>
  `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

const buildOperatingSummary = (
  businessHours: Array<{
    closesAt: string;
    dayOfWeek: number;
    isClosed: boolean;
    opensAt: string;
  }>,
) => {
  const currentDay = new Date().getDay();
  const todayWindow = businessHours.find((window) => window.dayOfWeek === currentDay);

  if (!todayWindow || todayWindow.isClosed) {
    return "Closed today";
  }

  return `Open today · ${todayWindow.opensAt} - ${todayWindow.closesAt}`;
};

const mapBranchSummary = (
  branch: {
    businessHours: Array<{
      closesAt: string;
      dayOfWeek: number;
      isClosed: boolean;
      opensAt: string;
    }>;
    city: string;
    latitude: number;
    longitude: number;
    name: string;
    phone: string;
    postalCode: string;
    province: string;
    streetAddress: string;
    timezone: string;
    id: string;
    slots: Array<{ startsAt: Date }>;
  },
  coordinates?: {
    latitude: number;
    longitude: number;
  },
): BranchSummary => ({
  address: formatAddress(branch),
  city: branch.city,
  directionsUrl: buildDirectionsUrl(branch.latitude, branch.longitude),
  distanceKm: coordinates
    ? Number(
        haversineDistance(
          coordinates.latitude,
          coordinates.longitude,
          branch.latitude,
          branch.longitude,
        ).toFixed(1),
      )
    : null,
  id: branch.id,
  latitude: branch.latitude,
  longitude: branch.longitude,
  name: branch.name,
  nextAvailableDate: branch.slots[0]
    ? formatDateKeyInTimeZone(branch.slots[0].startsAt, branch.timezone)
    : null,
  operatingSummary: buildOperatingSummary(branch.businessHours),
  phone: branch.phone,
  postalCode: branch.postalCode,
  province: branch.province,
  timezone: branch.timezone,
});

export const listBranches = async (
  prisma: PrismaClient,
  coordinates?: {
    latitude: number;
    longitude: number;
  },
) => {
  const branches: Array<Parameters<typeof mapBranchSummary>[0]> =
    await prisma.branch.findMany({
    include: {
      businessHours: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      slots: {
        orderBy: {
          startsAt: "asc",
        },
        take: 1,
        where: {
          startsAt: {
            gte: new Date(),
          },
          status: "AVAILABLE",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    where: {
      isActive: true,
    },
    });

  return branches
    .map((branch): BranchSummary => mapBranchSummary(branch, coordinates))
    .sort((left: BranchSummary, right: BranchSummary) => {
      if (left.distanceKm === null && right.distanceKm === null) {
        return left.name.localeCompare(right.name);
      }

      if (left.distanceKm === null) {
        return 1;
      }

      if (right.distanceKm === null) {
        return -1;
      }

      return left.distanceKm - right.distanceKm;
    });
};

export const getBranchAvailability = async (
  prisma: PrismaClient,
  branchId: string,
  month: string,
): Promise<BranchAvailability> => {
  const branch = await prisma.branch.findUnique({
    where: {
      id: branchId,
    },
  });

  if (!branch) {
    throw new AppError({
      code: "branch_not_found",
      message: "The selected branch could not be found.",
      statusCode: 404,
    });
  }

  const { end, start } = formatMonthWindow(month);

  const slots = await prisma.appointmentSlot.findMany({
    orderBy: {
      startsAt: "asc",
    },
    where: {
      branchId,
      startsAt: {
        gte: start,
        lt: end,
      },
    },
  });

  const daysMap = new Map<
    string,
    {
      date: string;
      slots: BranchAvailability["days"][number]["slots"];
    }
  >();

  for (const slot of slots) {
    const dateKey = formatDateKeyInTimeZone(slot.startsAt, branch.timezone);
    const existingDay = daysMap.get(dateKey) ?? {
      date: dateKey,
      slots: [],
    };

    existingDay.slots.push({
      endsAt: slot.endsAt.toISOString(),
      id: slot.id,
      isAvailable: slot.status === "AVAILABLE",
      label: formatTimeLabelInTimeZone(slot.startsAt, branch.timezone),
      startsAt: slot.startsAt.toISOString(),
    });

    daysMap.set(dateKey, existingDay);
  }

  return {
    branchId,
    days: [...daysMap.values()],
    month,
    timezone: branch.timezone,
  };
};

export const getBranchSummaryById = async (prisma: PrismaClient, branchId: string) => {
  const branch = await prisma.branch.findUnique({
    include: {
      businessHours: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      slots: {
        orderBy: {
          startsAt: "asc",
        },
        take: 1,
        where: {
          startsAt: {
            gte: new Date(),
          },
          status: "AVAILABLE",
        },
      },
    },
    where: {
      id: branchId,
    },
  });

  if (!branch) {
    throw new AppError({
      code: "branch_not_found",
      message: "The selected branch could not be found.",
      statusCode: 404,
    });
  }

  return mapBranchSummary(branch);
};
