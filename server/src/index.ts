import "dotenv/config";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fileRouter } from "./rest/fileRouter";
import { join } from "path";
import { env } from "./utils/env";
import { requireAuth } from "./rest/middleware/requireAuth";

const main = async () => {
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.decorate("requireAuth", requireAuth)

  await app.register(cors, {
    origin: [env("CORS_ORIGIN", env("FRONTEND_URL")), "http://127.0.0.1:5000"],
    methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
    allowedHeaders: ["Origin", "Content-Type", "Accept"],
    credentials: true,
  });

  await app.register(cookie, {
    hook: "onRequest",
  });

  console.log("registering routes");
  await app.register(fileRouter, {
    dir: join(__dirname, "rest", "routes"),
  });

  const host = env("HOST", "127.0.0.1");
  const port = parseInt(env("PORT", "8000"));

  try {
    await app.listen({ port });
    app.log.info(`Server listening on ${host}:${port}`);
  } catch (e) {
    app.log.error(e);
  }
};

main();
