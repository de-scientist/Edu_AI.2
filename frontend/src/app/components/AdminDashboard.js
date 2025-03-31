"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const AdminDashboard = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/student-performance").then((res) => {
      const topics = res.data.map((entry) => entry.topic);
      const scores = res.data.map((entry) => entry.score);

      setChartData({
        labels: topics,
        datasets: [{ label: "Student Performance", data: scores, backgroundColor: "blue" }],
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
