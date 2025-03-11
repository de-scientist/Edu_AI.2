import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyProgressChart = ({ studentId, courseId }) => {
  const [weeklyData, setWeeklyData] = useState([]);

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
  }, [studentId, courseId]);

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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Student Progress" },
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
