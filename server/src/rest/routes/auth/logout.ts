import { accessCookieConfig } from "../../../utils/auth";
import { createRoute } from "../../fileRouter";

export const POST = createRoute({
  handler: async (req, reply) => {
    reply.clearCookie("at", accessCookieConfig).send({ success: true });
  },
});
