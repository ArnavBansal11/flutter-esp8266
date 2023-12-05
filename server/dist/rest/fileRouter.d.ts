/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { FastifyBaseLogger, FastifyInstance, FastifySchema, FastifyTypeProvider, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RawServerDefault, RouteGenericInterface, RouteShorthandOptionsWithHandler } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
type FastifyZod = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, ZodTypeProvider>;
export declare const createRoute: <RawServer extends RawServerBase = RawServerDefault, RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>, RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>, RouteGeneric extends RouteGenericInterface = RouteGenericInterface, ContextConfig = unknown, SchemaCompiler extends FastifySchema = FastifySchema, TypeProvider extends FastifyTypeProvider = ZodTypeProvider>(opts: RouteShorthandOptionsWithHandler<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler, TypeProvider, FastifyBaseLogger>) => RouteShorthandOptionsWithHandler<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler, TypeProvider, FastifyBaseLogger>;
export type RouterOptions = {
    dir: string;
    prefix?: string;
};
export declare const fileRouter: (fastify: FastifyZod, opts: RouterOptions, done: (err?: Error) => void) => Promise<void>;
export {};
