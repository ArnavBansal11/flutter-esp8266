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
      name: z.string(),
    }),
  },

  handler: async ({ body }, reply) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser)
      return reply.send({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(body.password, 15);
    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });

    const accessToken = await tokenSigner({ userId: user.id });
    reply
      .setCookie("at", accessToken, accessCookieConfig)
      .send({ success: true });
  },
});
