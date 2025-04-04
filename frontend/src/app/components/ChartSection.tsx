"use client";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartSection() {
  const chartData = {
    labels: [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Student Progress",
        data: [20, 40, 60, 80, 90, 100, 110, 120, 130, 140, 150, 160], // Data corresponding to each month
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-semibold text-shadow text-center">Edu_AI Analytics</h2>
      <p className="text-lg mt-2 text-center">Track student progress over time with real-time analytics.</p>

      <motion.div
        className="mt-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Line data={chartData} options={{ responsive: true }} />
      </motion.div>
    </section>
  );
}
