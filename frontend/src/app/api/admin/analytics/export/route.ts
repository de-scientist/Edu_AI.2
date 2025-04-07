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
  
  return userGrowth;
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
    
    // In a real application, you would generate a CSV file from analytics data
    // For now, we'll return a simple CSV with mock data
    const mockData = generateMockData(range);
    
    // Create CSV content
    let csvContent = "Date,Users\n";
    mockData.forEach(item => {
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