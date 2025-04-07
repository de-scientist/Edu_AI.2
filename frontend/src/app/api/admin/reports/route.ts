import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock reports data for development
const mockReports = [
  {
    id: "1",
    type: "content",
    status: "pending",
    priority: "high",
    content: {
      id: "101",
      title: "Inappropriate Course Content",
      description: "Contains offensive material",
      author: "John Doe",
      createdAt: "2024-04-01T10:00:00Z"
    },
    reporter: {
      id: "201",
      name: "Alice Smith",
      email: "alice@example.com"
    },
    reason: "Inappropriate Content",
    details: "The course material contains offensive language and discriminatory content.",
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z"
  },
  {
    id: "2",
    type: "user",
    status: "reviewed",
    priority: "medium",
    content: {
      id: "102",
      title: "User Behavior Report",
      description: "Harassment in comments",
      author: "Jane Smith",
      createdAt: "2024-04-02T15:30:00Z"
    },
    reporter: {
      id: "202",
      name: "Bob Johnson",
      email: "bob@example.com"
    },
    reason: "User Harassment",
    details: "User has been harassing other students in course comments.",
    createdAt: "2024-04-02T15:30:00Z",
    updatedAt: "2024-04-02T16:00:00Z"
  },
  {
    id: "3",
    type: "comment",
    status: "resolved",
    priority: "low",
    content: {
      id: "103",
      title: "Spam Comment",
      description: "Multiple spam comments",
      author: "Mike Wilson",
      createdAt: "2024-04-03T09:15:00Z"
    },
    reporter: {
      id: "203",
      name: "Carol White",
      email: "carol@example.com"
    },
    reason: "Spam",
    details: "User posting multiple spam comments promoting external products.",
    createdAt: "2024-04-03T09:15:00Z",
    updatedAt: "2024-04-03T10:00:00Z"
  }
];

export async function GET(request: Request) {
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
    
    // In a real application, you would fetch reports from a database
    // For now, we'll return mock data
    return NextResponse.json(mockReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
    
    const { reportId, status } = await request.json();
    
    if (!reportId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // In a real application, you would update the report status in a database
    // For now, we'll return a success response
    return NextResponse.json({ message: "Report status updated successfully" });
  } catch (error) {
    console.error("Error updating report status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 