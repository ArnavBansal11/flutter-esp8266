import { readdir } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifySchema,
  FastifyTypeProvider,
  HTTPMethods,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
  RouteShorthandOptionsWithHandler,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

type FastifyZod = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

type RouteZod = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  RouteGenericInterface,
  ContextConfigDefault,
  FastifySchema,
  ZodTypeProvider,
  FastifyBaseLogger
>;

export const createRoute = <
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends
    RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends
    RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = ZodTypeProvider,
>(
  opts: RouteShorthandOptionsWithHandler<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig,
    SchemaCompiler,
    TypeProvider
  >
): RouteShorthandOptionsWithHandler<
  RawServer,
  RawRequest,
  RawReply,
  RouteGeneric,
  ContextConfig,
  SchemaCompiler,
  TypeProvider
> => opts;

function pathToUrl(path: string) {
  // Remove extension
  let extIndex = path.lastIndexOf(".");
  if (extIndex === -1) extIndex = path.length;
  path = path.substring(0, extIndex);

  // Replace [...slug] with *
  path = path.replace(/\[\.\.\.(.*?)\]/g, "*");

  // Replace [slug] with :slug
  path = path.replace(/\[(.*?)\]/g, ":$1");

  // Remove /index
  path = path.replace("/index", "");
  path = path.replace("index", "");

  return "/" + path;
}

export type RouterOptions = {
  dir: string;
  prefix?: string;
};

export const fileRouter = async (
  fastify: FastifyZod,
  opts: RouterOptions,
  done: (err?: Error) => void
) => {
  fastify.log.debug("Loading routes");
  const routeFiles = await readdir(opts.dir, { recursive: true });

  const httpMethods = new Set([
    "DELETE",
    "GET",
    "HEAD",
    "PATCH",
    "POST",
    "PUT",
    "OPTIONS",
  ]);

  for (const file of routeFiles) {
    if (file.endsWith(".js")) {
      const importedFile = await import(opts.dir + "/" + file);
      // @ts-ignore
      const url = pathToUrl(file).replaceAll("\\", "/");

      for (const method in importedFile) {
        if (httpMethods.has(method)) {
          fastify.route({
            method: method as HTTPMethods,
            url,
            ...(importedFile[method] as RouteZod),
          });
          fastify.log.debug(`Loaded ${method}: ${url}`);
        }
      }
    }
  }
  fastify.log.debug(`Loaded all routes`);
  done();
};