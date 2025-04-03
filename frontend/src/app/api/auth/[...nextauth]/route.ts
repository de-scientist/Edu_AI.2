import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const users = [
          { id: "1", email: "admin@example.com", password: "admin123", role: "admin" },
          { id: "2", email: "student@example.com", password: "student123", role: "student" },
          { id: "3", email: "lecturer@example.com", password: "lecturer123", role: "lecturer" }
        ];

        const user = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          throw new Error("Invalid email or password.");
        }

        return { id: user.id, email: user.email, role: user.role }; // Ensuring `id` and `role` are included
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ✅ Ensure `id` persists
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // ✅ Ensure `id` is available
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" // ✅ Using JWT to store sessions
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
