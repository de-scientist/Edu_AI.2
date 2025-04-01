import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // This is the studentId
    email: string;
    role: string;
  }

  interface Session {
    user: {
      id: string; // ✅ Now session.user.id is available
      email: string;
      role: string;
    };
  }

  interface JWT {
    id: string; // ✅ Ensure JWT contains studentId
    role: string;
  }
}

type ProgressPredictionProps = {
  week: number; // Adjust the type if it's something other than `number`
  pastProgress: number; // Adjust the type if needed
};
