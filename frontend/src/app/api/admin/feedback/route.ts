import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock feedback data for development
const mockFeedback = [
  {
    id: "1",
    type: "suggestion",
    status: "pending",
    priority: "high",
    title: "Add Dark Mode Support",
    description: "Please add a dark mode option for better visibility in low-light conditions.",
    user: {
      id: "101",
      name: "John Doe",
      email: "john@example.com"
    },
    votes: {
      up: 15,
      down: 2
    },
    comments: 5,
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z"
  },
  {
    id: "2",
    type: "bug",
    status: "in_review",
    priority: "medium",
    title: "Course Progress Not Saving",
    description: "The course progress is not being saved properly after completing a section.",
    user: {
      id: "102",
      name: "Jane Smith",
      email: "jane@example.com"
    },
    votes: {
      up: 8,
      down: 1
    },
    comments: 3,
    createdAt: "2024-04-02T15:30:00Z",
    updatedAt: "2024-04-02T16:00:00Z"
  },
  {
    id: "3",
    type: "feature",
    status: "implemented",
    priority: "low",
    title: "Add Export to PDF",
    description: "Allow users to export their course notes and progress to PDF format.",
    user: {
      id: "103",
      name: "Mike Wilson",
      email: "mike@example.com"
    },
    votes: {
      up: 12,
      down: 0
    },
    comments: 4,
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
    
    // In a real application, you would fetch feedback from a database
    // For now, we'll return mock data
    return NextResponse.json(mockFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
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
    
    const { feedbackId, status } = await request.json();
    
    if (!feedbackId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // In a real application, you would update the feedback status in a database
    // For now, we'll return a success response
    return NextResponse.json({ message: "Feedback status updated successfully" });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 