import { FastifyRequest, FastifyReply } from "fastify";
import { tokenVerifier } from "../../utils/auth";
import { prisma } from "../../client/prisma";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies["at"];

  if (!token) return reply.send({ success: false, message: "Unauthorised" });

  try {
    const { userId } = await tokenVerifier(token);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    console.log(user);

    if (!user) return reply.send({ success: false, message: "Unauthorised" });

    req.user = user;
  } catch (e) {
    return reply.send({ success: false, message: "Unauthorised" });
  }
}
