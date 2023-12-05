"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const auth_1 = require("../../utils/auth");
const prisma_1 = require("../../client/prisma");
async function requireAuth(req, reply) {
    const token = req.cookies["at"];
    if (!token)
        return reply.send({ success: false, message: "Unauthorised" });
    try {
        const { userId } = await (0, auth_1.tokenVerifier)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true },
        });
        console.log(user);
        if (!user)
            return reply.send({ success: false, message: "Unauthorised" });
        req.user = user;
    }
    catch (e) {
        return reply.send({ success: false, message: "Unauthorised" });
    }
}
exports.requireAuth = requireAuth;
