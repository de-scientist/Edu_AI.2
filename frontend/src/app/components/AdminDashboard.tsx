"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

// Define the structure of the API response data
interface StudentPerformanceData {
  topic: string;
  score: number;
}

const AdminDashboard = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  }>({ labels: [], datasets: [] });  // Set initial state with the correct shape

  useEffect(() => {
    axios.get("http://localhost:5000/student-performance").then((res) => {
      // Define the response data shape
      const data: StudentPerformanceData[] = res.data;

      const topics = data.map((entry) => entry.topic);  // Explicitly typed entry
      const scores = data.map((entry) => entry.score);  // Explicitly typed entry

      setChartData({
        labels: topics,
        datasets: [
          {
            label: "Student Performance",
            data: scores,
            backgroundColor: "blue",
          },
        ],
      });
    });
  }, []);

  return (
    <div>
      <h2>📊 Student Performance Analytics</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default AdminDashboard;
