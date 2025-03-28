import { config } from "@/config";
import { createUser } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

interface Props {
  user: User | AdapterUser;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }: Props) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: user.email as string,
        },
      });
      if (!dbUser) {
        await createUser(user);
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
