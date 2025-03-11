import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const PerformanceDashboard = ({ studentId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/student-progress/${studentId}`)
      .then((res) => {
        const labels = Object.keys(res.data);
        const data = Object.values(res.data);
        
        setChartData({
          labels,
          datasets: [{ label: "Performance", data, backgroundColor: "rgba(75,192,192,0.6)" }]
        });
      });
  }, [studentId]);

  return (
    <div>
      <h2>📊 Student Performance Dashboard</h2>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default PerformanceDashboard;
