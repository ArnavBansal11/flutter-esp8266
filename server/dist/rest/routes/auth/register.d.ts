/// <reference types="node" />
import z from "zod";
export declare const POST: import("fastify").RouteShorthandOptionsWithHandler<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, {
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        name: string;
        email: string;
    }, {
        password: string;
        name: string;
        email: string;
    }>;
}, import("fastify-type-provider-zod").ZodTypeProvider, import("fastify").FastifyBaseLogger>;
