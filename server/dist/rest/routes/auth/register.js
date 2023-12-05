"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const fileRouter_1 = require("../../fileRouter");
const prisma_1 = require("../../../client/prisma");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../../../utils/auth");
exports.POST = (0, fileRouter_1.createRoute)({
    schema: {
        body: zod_1.default.object({
            email: zod_1.default.string(),
            password: zod_1.default.string(),
            name: zod_1.default.string(),
        }),
    },
    handler: async ({ body }, reply) => {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (existingUser)
            return reply.send({ success: false, message: "User already exists" });
        const hashedPassword = await bcrypt_1.default.hash(body.password, 15);
        const user = await prisma_1.prisma.user.create({
            data: {
                ...body,
                password: hashedPassword,
            },
        });
        const accessToken = await (0, auth_1.tokenSigner)({ userId: user.id });
        reply
            .setCookie("at", accessToken, auth_1.accessCookieConfig)
            .send({ success: true });
    },
});
