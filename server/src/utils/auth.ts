import { CookieSerializeOptions } from "@fastify/cookie";
import { createSigner, createVerifier } from "fast-jwt";
import { env } from "./env";

const jwtKey = env("JWT_KEY");
export const accessTokenExpiry = 2592000 * 6; // 180 days

export const tokenSigner = createSigner({
  key: async () => jwtKey,
  expiresIn: accessTokenExpiry * 1000,
});
export const tokenVerifier = createVerifier({ key: async () => jwtKey });

export const defaultCookieConfig: CookieSerializeOptions = {
  // domain: env("DOMAIN"),
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const accessCookieConfig = {
  ...defaultCookieConfig,
  maxAge: accessTokenExpiry,
  path: "/",
};
