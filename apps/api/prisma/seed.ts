import { PrismaClient } from "@prisma/client";

import "../src/config/load-env.js";

const prisma = new PrismaClient();

const branches = [
  {
    city: "Johannesburg",
    latitude: -26.1076,
    longitude: 28.0567,
    name: "Sandton Branch",
    phone: "010 123 4501",
    postalCode: "2196",
    province: "Gauteng",
    slug: "sandton-branch",
    streetAddress: "144 Rivonia Road, Sandton",
    timezone: "Africa/Johannesburg",
  },
  {
    city: "Johannesburg",
    latitude: -26.2048,
    longitude: 28.0474,
    name: "Rosebank Branch",
    phone: "010 123 4502",
    postalCode: "2196",
    province: "Gauteng",
    slug: "rosebank-branch",
    streetAddress: "31 Cradock Avenue, Rosebank",
    timezone: "Africa/Johannesburg",
  },
  {
    city: "Pretoria",
    latitude: -25.7479,
    longitude: 28.2293,
    name: "Menlyn Branch",
    phone: "010 123 4503",
    postalCode: "0181",
    province: "Gauteng",
    slug: "menlyn-branch",
    streetAddress: "165 Atterbury Road, Menlyn",
    timezone: "Africa/Johannesburg",
  },
  {
    city: "Cape Town",
    latitude: -33.9181,
    longitude: 18.4231,
    name: "Foreshore Branch",
    phone: "010 123 4504",
    postalCode: "8001",
    province: "Western Cape",
    slug: "foreshore-branch",
    streetAddress: "1 Lower Burg Street, Foreshore",
    timezone: "Africa/Johannesburg",
  },
] as const;

const businessHours = [
  { closesAt: "16:30", dayOfWeek: 1, isClosed: false, opensAt: "08:00" },
  { closesAt: "16:30", dayOfWeek: 2, isClosed: false, opensAt: "08:00" },
  { closesAt: "16:30", dayOfWeek: 3, isClosed: false, opensAt: "08:00" },
  { closesAt: "16:30", dayOfWeek: 4, isClosed: false, opensAt: "08:00" },
  { closesAt: "16:30", dayOfWeek: 5, isClosed: false, opensAt: "08:00" },
  { closesAt: "13:30", dayOfWeek: 6, isClosed: false, opensAt: "09:00" },
  { closesAt: "13:30", dayOfWeek: 0, isClosed: false, opensAt: "09:00" },
] as const;

const SLOT_DURATION_MINUTES = 30;
const DAYS_TO_SEED = 28;

const dateToKey = (value: Date) =>
  [
    value.getUTCFullYear(),
    `${value.getUTCMonth() + 1}`.padStart(2, "0"),
    `${value.getUTCDate()}`.padStart(2, "0"),
  ].join("-");

const addDaysUtc = (value: Date, amount: number) => {
  const copy = new Date(value);
  copy.setUTCDate(copy.getUTCDate() + amount);
  return copy;
};

const minutesFromTime = (value: string) => {
  const [hoursToken = "0", minutesToken = "0"] = value.split(":");
  const hours = Number(hoursToken);
  const minutes = Number(minutesToken);
  return hours * 60 + minutes;
};

const southAfricaDateTimeToUtc = (dateKey: string, time: string) =>
  new Date(`${dateKey}T${time}:00+02:00`);

const buildBranchClosures = (startDate: Date) => [
  {
    endsAt: southAfricaDateTimeToUtc(dateToKey(addDaysUtc(startDate, 10)), "13:00"),
    reason: "Staff training afternoon",
    slug: "sandton-branch",
    startsAt: southAfricaDateTimeToUtc(
      dateToKey(addDaysUtc(startDate, 10)),
      "08:00",
    ),
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.appointmentSlot.deleteMany();
  await prisma.branchClosure.deleteMany();
  await prisma.branchBusinessHour.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.branch.deleteMany();

  const createdBranches = new Map<string, { id: string; timezone: string }>();

  for (const branch of branches) {
    const created = await prisma.branch.create({
      data: {
        city: branch.city,
        latitude: branch.latitude,
        longitude: branch.longitude,
        name: branch.name,
        phone: branch.phone,
        postalCode: branch.postalCode,
        province: branch.province,
        slug: branch.slug,
        streetAddress: branch.streetAddress,
        timezone: branch.timezone,
        businessHours: {
          create: businessHours.map((window) => ({
            closesAt: window.closesAt,
            dayOfWeek: window.dayOfWeek,
            isClosed: window.isClosed,
            opensAt: window.opensAt,
            slotDurationMinutes: SLOT_DURATION_MINUTES,
          })),
        },
      },
    });

    createdBranches.set(branch.slug, {
      id: created.id,
      timezone: created.timezone,
    });
  }

  const seedStartDate = new Date();
  seedStartDate.setUTCHours(0, 0, 0, 0);

  for (const closure of buildBranchClosures(seedStartDate)) {
    const branch = createdBranches.get(closure.slug);

    if (!branch) {
      continue;
    }

    await prisma.branchClosure.create({
      data: {
        branchId: branch.id,
        endsAt: closure.endsAt,
        reason: closure.reason,
        startsAt: closure.startsAt,
      },
    });
  }

  for (const branch of branches) {
    const createdBranch = createdBranches.get(branch.slug);

    if (!createdBranch) {
      continue;
    }

    const closures = await prisma.branchClosure.findMany({
      where: {
        branchId: createdBranch.id,
      },
    });

    for (let dayOffset = 0; dayOffset < DAYS_TO_SEED; dayOffset += 1) {
      const currentDate = addDaysUtc(seedStartDate, dayOffset);
      const dateKey = dateToKey(currentDate);
      const dayOfWeek = southAfricaDateTimeToUtc(dateKey, "08:30").getUTCDay();
      const window = businessHours.find((entry) => entry.dayOfWeek === dayOfWeek);

      if (!window || window.isClosed) {
        continue;
      }

      const startMinutes = minutesFromTime(window.opensAt);
      const endMinutes = minutesFromTime(window.closesAt);

      for (
        let minutes = startMinutes;
        minutes + SLOT_DURATION_MINUTES <= endMinutes;
        minutes += SLOT_DURATION_MINUTES
      ) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const slotTime = `${hours}`.padStart(2, "0") + `:${`${mins}`.padStart(2, "0")}`;
        const slotStart = southAfricaDateTimeToUtc(dateKey, slotTime);
        const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MINUTES * 60_000);
        const isClosedByException = closures.some(
          (closure: { endsAt: Date; startsAt: Date }) =>
            slotStart < closure.endsAt && slotEnd > closure.startsAt,
        );

        if (isClosedByException) {
          continue;
        }

        await prisma.appointmentSlot.create({
          data: {
            branchId: createdBranch.id,
            endsAt: slotEnd,
            startsAt: slotStart,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed database", error);
    await prisma.$disconnect();
    process.exit(1);
  });
