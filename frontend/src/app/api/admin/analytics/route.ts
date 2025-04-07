import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mock analytics data for development
const generateMockData = (range: string) => {
  // Generate dates based on range
  const getDates = () => {
    const today = new Date();
    const dates = [];
    let days;
    
    switch (range) {
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      case "1y":
        days = 365;
        break;
      default:
        days = 7;
    }
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };
  
  const dates = getDates();
  
  // Generate user growth data
  const userGrowth = dates.map((date, index) => {
    const baseUsers = 1000;
    const growth = Math.floor(Math.random() * 50);
    return {
      date,
      users: baseUsers + (growth * index)
    };
  });
  
  // Generate course engagement data
  const courseEngagement = [
    {
      course: "Introduction to Machine Learning",
      students: Math.floor(Math.random() * 500) + 200,
      completion: Math.floor(Math.random() * 300) + 100
    },
    {
      course: "Web Development Bootcamp",
      students: Math.floor(Math.random() * 600) + 300,
      completion: Math.floor(Math.random() * 400) + 200
    },
    {
      course: "Data Science Fundamentals",
      students: Math.floor(Math.random() * 400) + 150,
      completion: Math.floor(Math.random() * 250) + 80
    },
    {
      course: "Mobile App Development",
      students: Math.floor(Math.random() * 450) + 180,
      completion: Math.floor(Math.random() * 280) + 90
    },
    {
      course: "Cybersecurity Basics",
      students: Math.floor(Math.random() * 350) + 120,
      completion: Math.floor(Math.random() * 220) + 70
    }
  ];
  
  // Generate activity distribution data
  const activityDistribution = [
    {
      name: "Video Lectures",
      value: Math.floor(Math.random() * 40) + 30
    },
    {
      name: "Assignments",
      value: Math.floor(Math.random() * 25) + 15
    },
    {
      name: "Quizzes",
      value: Math.floor(Math.random() * 20) + 10
    },
    {
      name: "Discussion Forums",
      value: Math.floor(Math.random() * 15) + 5
    }
  ];
  
  // Generate performance metrics
  const performanceMetrics = [
    {
      metric: "Active Users",
      value: Math.floor(Math.random() * 5000) + 3000,
      change: Math.floor(Math.random() * 20) - 5
    },
    {
      metric: "Course Completion Rate",
      value: Math.floor(Math.random() * 40) + 60,
      change: Math.floor(Math.random() * 10) - 2
    },
    {
      metric: "Average Engagement Time",
      value: Math.floor(Math.random() * 30) + 20,
      change: Math.floor(Math.random() * 15) - 5
    },
    {
      metric: "User Satisfaction",
      value: Math.floor(Math.random() * 20) + 80,
      change: Math.floor(Math.random() * 10) - 3
    }
  ];
  
  return {
    userGrowth,
    courseEngagement,
    activityDistribution,
    performanceMetrics
  };
};

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
    
    // Get date range from query parameters
    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "7d";
    
    // In a real application, you would fetch analytics data from a database
    // For now, we'll return mock data
    const mockData = generateMockData(range);
    
    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET_EXPORT(request: Request) {
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
    
    // Get date range from query parameters
    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "7d";
    
    // In a real application, you would generate a CSV file from analytics data
    // For now, we'll return a simple CSV with mock data
    const mockData = generateMockData(range);
    
    // Create CSV content
    let csvContent = "Date,Users\n";
    mockData.userGrowth.forEach(item => {
      csvContent += `${item.date},${item.users}\n`;
    });
    
    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="analytics-report-${range}.csv"`
      }
    });
  } catch (error) {
    console.error("Error exporting analytics data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 