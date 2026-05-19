import type { FastifyInstance } from "fastify";
import { branchesResponseSchema, branchAvailabilitySchema } from "@appointment/shared";
import { z } from "zod";

import { getBranchAvailability, listBranches } from "../modules/branches/branch.service.js";

const branchListQuerySchema = z.object({
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

const availabilityParamsSchema = z.object({
  branchId: z.string().min(1),
});

const availabilityQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
});

export const registerBranchRoutes = async (app: FastifyInstance) => {
  app.get("/branches", async (request) => {
    const { latitude, longitude } = branchListQuerySchema.parse(request.query);
    const coordinates =
      latitude !== undefined && longitude !== undefined
        ? { latitude, longitude }
        : undefined;
    const response = {
      items: await listBranches(app.prisma, coordinates),
    };

    return branchesResponseSchema.parse(response);
  });

  app.get("/branches/:branchId/availability", async (request) => {
    const { branchId } = availabilityParamsSchema.parse(request.params);
    const { month } = availabilityQuerySchema.parse(request.query);
    const response = await getBranchAvailability(app.prisma, branchId, month);

    return branchAvailabilitySchema.parse(response);
  });
};
