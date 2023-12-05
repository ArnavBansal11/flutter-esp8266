"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const fileRouter_1 = require("../../fileRouter");
const requireAuth_1 = require("../../middleware/requireAuth");
exports.GET = (0, fileRouter_1.createRoute)({
    preHandler: [requireAuth_1.requireAuth],
    handler: async (req, reply) => {
        return reply.send({ success: true, user: req.user });
    },
});
