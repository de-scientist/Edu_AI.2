"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StudentPerformanceChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      const response = await fetch("http://localhost:5000/performance");
      const data = await response.json();

      const labels = data.map((entry) => entry.date);
      const scores = data.map((entry) => entry.score);

      setChartData({
        labels,
        datasets: [
          {
            label: "Quiz Scores",
            data: scores,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });
    };

    fetchPerformance();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-2">Student Performance</h2>
      {chartData ? <Bar data={chartData} /> : <p>Loading...</p>}
    </div>
  );
}

