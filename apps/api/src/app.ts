import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";

import { corsOrigins, env } from "./config/env.js";
import { AppError } from "./lib/errors.js";
import { prisma } from "./lib/prisma.js";
import { registerBookingRoutes } from "./routes/bookings.js";
import { registerBranchRoutes } from "./routes/branches.js";
import { registerHealthRoutes } from "./routes/health.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

export const buildApp = () => {
  const app = fastify({
    logger: env.NODE_ENV !== "test",
  });

  app.decorate("prisma", prisma);

  app.register(cors, {
    origin: corsOrigins,
  });
  app.register(helmet);
  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send({
        code: "validation_error",
        message: error.issues[0]?.message ?? "Request validation failed.",
      });
      return;
    }

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
      });
      return;
    }

    app.log.error(error);
    reply.status(500).send({
      code: "internal_error",
      message: "Something went wrong while processing the request.",
    });
  });

  app.register(registerHealthRoutes, { prefix: "/api" });
  app.register(registerBranchRoutes, { prefix: "/api" });
  app.register(registerBookingRoutes, { prefix: "/api" });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
};
