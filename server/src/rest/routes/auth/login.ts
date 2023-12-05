import { createRoute } from "../../fileRouter";
import { prisma } from "../../../client/prisma";
import z from "zod";
import bcrypt from "bcrypt";
import { accessCookieConfig, tokenSigner } from "../../../utils/auth";

export const POST = createRoute({
  schema: {
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
  },
  handler: async ({ body }, reply) => {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user)
      return reply.send({ success: false, message: "User does not exist" });

    const match = await bcrypt.compare(body.password, user.password);
    if (!match)
      return reply.send({ success: false, message: "Incorrect Password" });

    const accessToken = await tokenSigner({ userId: user.id });
    reply.cookie("at", accessToken, accessCookieConfig).send({ success: true });
  },
});
