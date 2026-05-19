import type { FastifyInstance } from "fastify";
import {
  bookingConfirmationSchema,
  createBookingRequestSchema,
} from "@appointment/shared";
import { z } from "zod";

import { createBooking, getBookingByConfirmationCode } from "../modules/bookings/booking.service.js";

const bookingParamsSchema = z.object({
  confirmationCode: z.string().min(1),
});

export const registerBookingRoutes = async (app: FastifyInstance) => {
  app.post("/bookings", async (request, reply) => {
    const payload = createBookingRequestSchema.parse(request.body);
    const booking = await createBooking(app.prisma, payload);

    reply.status(201);

    return bookingConfirmationSchema.parse(booking);
  });

  app.get("/bookings/:confirmationCode", async (request) => {
    const { confirmationCode } = bookingParamsSchema.parse(request.params);
    const booking = await getBookingByConfirmationCode(app.prisma, confirmationCode);

    return bookingConfirmationSchema.parse(booking);
  });
};
