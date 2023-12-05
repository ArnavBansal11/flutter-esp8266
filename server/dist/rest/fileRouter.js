"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRouter = exports.createRoute = void 0;
const promises_1 = require("fs/promises");
const createRoute = (opts) => opts;
exports.createRoute = createRoute;
function pathToUrl(path) {
    // Remove extension
    let extIndex = path.lastIndexOf(".");
    if (extIndex === -1)
        extIndex = path.length;
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
const fileRouter = async (fastify, opts, done) => {
    fastify.log.debug("Loading routes");
    const routeFiles = await (0, promises_1.readdir)(opts.dir, { recursive: true });
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
            const importedFile = await Promise.resolve(`${opts.dir + "/" + file}`).then(s => __importStar(require(s)));
            // @ts-ignore
            const url = pathToUrl(file).replaceAll("\\", "/");
            for (const method in importedFile) {
                if (httpMethods.has(method)) {
                    fastify.route({
                        method: method,
                        url,
                        ...importedFile[method],
                    });
                    fastify.log.debug(`Loaded ${method}: ${url}`);
                }
            }
        }
    }
    fastify.log.debug(`Loaded all routes`);
    done();
};
exports.fileRouter = fileRouter;
