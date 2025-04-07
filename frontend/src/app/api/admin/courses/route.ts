import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock course data for development
const mockCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "A comprehensive introduction to machine learning concepts and algorithms",
    instructor: "Dr. Sarah Johnson",
    status: "published",
    modules: [
      {
        id: "1",
        title: "Introduction to ML",
        type: "video",
        content: "Introduction video content",
        duration: 45,
        order: 1
      },
      {
        id: "2",
        title: "Basic Concepts Quiz",
        type: "quiz",
        content: "Quiz content",
        duration: 30,
        order: 2
      }
    ],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-15T14:30:00Z"
  },
  {
    id: "2",
    title: "Advanced Data Structures",
    description: "Deep dive into advanced data structures and algorithms",
    instructor: "Prof. Michael Chen",
    status: "draft",
    modules: [
      {
        id: "1",
        title: "Binary Trees",
        type: "text",
        content: "Text content about binary trees",
        duration: 60,
        order: 1
      },
      {
        id: "2",
        title: "Graph Algorithms",
        type: "video",
        content: "Video content about graph algorithms",
        duration: 90,
        order: 2
      }
    ],
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-03-20T11:20:00Z"
  },
  {
    id: "3",
    title: "Web Development Bootcamp",
    description: "Complete guide to modern web development",
    instructor: "Alex Thompson",
    status: "archived",
    modules: [
      {
        id: "1",
        title: "HTML & CSS Basics",
        type: "video",
        content: "Video content about HTML and CSS",
        duration: 120,
        order: 1
      },
      {
        id: "2",
        title: "JavaScript Fundamentals",
        type: "text",
        content: "Text content about JavaScript",
        duration: 90,
        order: 2
      }
    ],
    createdAt: "2024-02-15T08:00:00Z",
    updatedAt: "2024-03-01T16:45:00Z"
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
    
    // In a real application, you would fetch courses from a database
    // For now, we'll return mock data
    return NextResponse.json(mockCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
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
    
    // Get course ID from URL
    const url = new URL(request.url);
    const courseId = url.pathname.split("/").pop();
    
    // In a real application, you would delete the course from a database
    // For now, we'll just return a success response
    return NextResponse.json({ success: true, message: `Course ${courseId} deleted successfully` });
  } catch (error) {
    console.error("Error deleting course:", error);
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
    
    // Get course ID and status from URL and body
    const url = new URL(request.url);
    const courseId = url.pathname.split("/")[3]; // /api/admin/courses/{id}/status
    const { status } = await request.json();
    
    // In a real application, you would update the course status in a database
    // For now, we'll just return a success response
    return NextResponse.json({ 
      success: true, 
      message: `Course ${courseId} status updated to ${status} successfully` 
    });
  } catch (error) {
    console.error("Error updating course status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 