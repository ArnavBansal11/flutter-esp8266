"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const auth_1 = require("../../../utils/auth");
const fileRouter_1 = require("../../fileRouter");
exports.POST = (0, fileRouter_1.createRoute)({
    handler: async (req, reply) => {
        reply.clearCookie("at", auth_1.accessCookieConfig).send({ success: true });
    },
});
