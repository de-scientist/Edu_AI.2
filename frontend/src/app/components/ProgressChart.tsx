"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeeklyProgressChartProps {
  id: string;  // Single prop for both studentId and courseId
}

interface WeeklyProgressData {
  week: string;
  avg_progress: number;
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ id }) => {
  // Use `id` for both studentId and courseId
  const studentId = id;
  const courseId = id;

  const [weeklyData, setWeeklyData] = useState<WeeklyProgressData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/weekly-progress", {
          params: { studentId, courseId },
        });
        setWeeklyData(response.data);
      } catch (error) {
        console.error("Error fetching weekly progress:", error);
      }
    }

    fetchData();
  }, [studentId, courseId]); // Dependency array now just listens for `id`

  const chartData = {
    labels: weeklyData.map((entry) => new Date(entry.week).toLocaleDateString()),
    datasets: [
      {
        label: "Average Weekly Progress (%)",
        data: weeklyData.map((entry) => entry.avg_progress),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Student Progress" },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>📅 Weekly Progress Trends</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeeklyProgressChart;
