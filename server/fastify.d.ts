import { FastifyRequest as FastifyBaseRequest } from "fastify";
import { User } from "@prisma/client";
import fastify from "fastify";

declare module "fastify" {
  export interface FastifyRequest extends FastifyBaseRequest {
    user: Omit<User, "password">;
  }
}
