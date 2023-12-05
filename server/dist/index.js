"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const fileRouter_1 = require("./rest/fileRouter");
const path_1 = require("path");
const env_1 = require("./utils/env");
const requireAuth_1 = require("./rest/middleware/requireAuth");
const http = require("http");
const main = async () => {
    const app = (0, fastify_1.default)({ logger: true }).withTypeProvider();
    app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    app.decorate("requireAuth", requireAuth_1.requireAuth);
    await app.register(cors_1.default, {
        origin: [(0, env_1.env)("CORS_ORIGIN", (0, env_1.env)("FRONTEND_URL")), "http://127.0.0.1:5000"],
        methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
        allowedHeaders: ["Origin", "Content-Type", "Accept"],
        credentials: true,
    });
    await app.register(cookie_1.default, {
        hook: "onRequest",
    });
    console.log("registering routes");
    await app.register(fileRouter_1.fileRouter, {
        dir: (0, path_1.join)(__dirname, "rest", "routes"),
    });
    const host = (0, env_1.env)("HOST", "127.0.0.1");
    const port = parseInt((0, env_1.env)("PORT", "8000"));
    try {
        await app.listen({ port, host });
        app.log.info(`Server listening on ${host}:${port}`);
    }
    catch (e) {
        app.log.error(e);
    }
};
main();
