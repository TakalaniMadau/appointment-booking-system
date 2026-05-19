import type { PrismaClient } from "@prisma/client";

export const markConfirmationEmailAsSent = async (
  prisma: PrismaClient,
  bookingId: string,
) => {
  const pendingRecord = await prisma.emailOutbox.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      bookingId,
      status: "PENDING",
    },
  });

  if (!pendingRecord) {
    return;
  }

  console.info("Simulated confirmation email", {
    payload: pendingRecord.payloadJson,
    toEmail: pendingRecord.toEmail,
  });

  await prisma.emailOutbox.update({
    data: {
      sentAt: new Date(),
      status: "SENT",
    },
    where: {
      id: pendingRecord.id,
    },
  });
};
