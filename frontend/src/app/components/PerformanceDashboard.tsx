"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

// Define types for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface PerformanceDashboardProps {
  id: string | number; // Changed to 'id' instead of 'studentId'
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ id }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null); // Explicitly typing state

  useEffect(() => {
    axios.get(`http://localhost:5000/student-progress/${id}`)
      .then((res) => {
        const labels = Object.keys(res.data);
        // Explicitly cast the values to number[]
        const data = Object.values(res.data) as number[];

        setChartData({
          labels,
          datasets: [{
            label: "Performance",
            data, // Now the data is correctly typed as number[]
            backgroundColor: "rgba(75,192,192,0.6)"
          }]
        });
      });
  }, [id]);

  return (
    <div>
      <h2>📊 Student Performance Dashboard</h2>
      {chartData ? <Bar data={chartData} /> : <p>Loading data...</p>}
    </div>
  );
};

export default PerformanceDashboard;
