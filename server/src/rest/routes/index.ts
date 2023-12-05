import { createRoute } from "../fileRouter";

export const GET = createRoute({
  handler: async (req, reply) => {
    reply.send("Hello World");
  },
});
