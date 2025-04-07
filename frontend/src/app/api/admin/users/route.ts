import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-04-01T12:00:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "lecturer",
    status: "active",
    lastActive: "2023-04-02T10:30:00Z"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "student",
    status: "inactive",
    lastActive: "2023-03-28T15:45:00Z"
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "student",
    status: "pending",
    lastActive: "2023-03-25T09:15:00Z"
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "lecturer",
    status: "active",
    lastActive: "2023-04-03T14:20:00Z"
  }
];

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // In a real application, you would fetch users from a database
    // For now, we'll return mock data
    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Get user ID from URL
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();
    
    // In a real application, you would delete the user from a database
    // For now, we'll just return a success response
    return NextResponse.json({ success: true, message: `User ${userId} deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 