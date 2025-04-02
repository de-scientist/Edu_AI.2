import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";  // Updated import path

export async function getSessionUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("❌ Error fetching session:", error);
    return null;
  }
}
