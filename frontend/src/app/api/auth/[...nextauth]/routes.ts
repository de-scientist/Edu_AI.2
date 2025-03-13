import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simulated database lookup
        const users = [
          { id: "1", email: "admin@example.com", password: "admin123", role: "admin" },
          { id: "2", email: "student@example.com", password: "student123", role: "student" },
          { id: "3", email: "lecturer@example.com", password: "lecturer123", role: "lecturer" }
        ];
        
        const user = users.find(
          u => u.email === credentials?.email && u.password === credentials?.password
        );

        if (user) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;  // Store role in token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;  // Store role in session
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };

export async function GET() {
  return NextResponse.json({ message: "Auth API Endpoint"});
}