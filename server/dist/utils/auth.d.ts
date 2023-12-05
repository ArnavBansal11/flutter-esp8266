import { CookieSerializeOptions } from "@fastify/cookie";
export declare const accessTokenExpiry: number;
export declare const tokenSigner: typeof import("fast-jwt").SignerAsync;
export declare const tokenVerifier: typeof import("fast-jwt").VerifierAsync;
export declare const defaultCookieConfig: CookieSerializeOptions;
export declare const accessCookieConfig: {
    maxAge: number;
    path: string;
    secure?: boolean | "auto" | undefined;
    signed?: boolean | undefined;
    domain?: string | undefined;
    encode?: ((val: string) => string) | undefined;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    partitioned?: boolean | undefined;
    sameSite?: boolean | "none" | "lax" | "strict" | undefined;
};
