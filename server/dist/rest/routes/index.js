"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const fileRouter_1 = require("../fileRouter");
exports.GET = (0, fileRouter_1.createRoute)({
    handler: async (req, reply) => {
        reply.send("Hello World");
    },
});
