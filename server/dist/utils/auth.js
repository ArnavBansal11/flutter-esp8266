"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessCookieConfig = exports.defaultCookieConfig = exports.tokenVerifier = exports.tokenSigner = exports.accessTokenExpiry = void 0;
const fast_jwt_1 = require("fast-jwt");
const env_1 = require("./env");
const jwtKey = (0, env_1.env)("JWT_KEY");
exports.accessTokenExpiry = 2592000 * 6; // 180 days
exports.tokenSigner = (0, fast_jwt_1.createSigner)({
    key: async () => jwtKey,
    expiresIn: exports.accessTokenExpiry * 1000,
});
exports.tokenVerifier = (0, fast_jwt_1.createVerifier)({ key: async () => jwtKey });
exports.defaultCookieConfig = {
    // domain: env("DOMAIN"),
    httpOnly: true,
    secure: true,
    sameSite: "none",
};
exports.accessCookieConfig = {
    ...exports.defaultCookieConfig,
    maxAge: exports.accessTokenExpiry,
    path: "/",
};
