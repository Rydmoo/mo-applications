import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds guilds.members.read'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discord = {
          id: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: profile.avatar,
          banner: profile.banner,
          accentColor: profile.accent_color,
          verified: profile.verified,
          email: profile.email,
          createdAt: new Date(Number(BigInt(profile.id) >> 22n) + 1420070400000).toISOString(),
        }
      }
      return token
    },
    async session({ session, token }) {
      session.discord = token.discord as {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
        banner: string;
        accentColor: number | null;
        verified: boolean;
        email: string;
        createdAt: string;
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

