import { createRoute } from "../../fileRouter";
import { requireAuth } from "../../middleware/requireAuth";

export const GET = createRoute({
  preHandler: [requireAuth],
  handler: async (req, reply) => {},
});
