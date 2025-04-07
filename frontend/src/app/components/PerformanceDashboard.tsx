"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { motion } from "framer-motion";
import { BarChart, LineChart } from "lucide-react";
import DashboardCard from "./DashboardCard";
import ProgressChart from "./ProgressChart";
import { ChartSection } from "./ChartSection";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <DashboardCard
        title="Overall Progress"
        icon={<BarChart className="w-6 h-6" />}
      >
        <ProgressChart />
      </DashboardCard>

      <DashboardCard
        title="Performance Trends"
        icon={<LineChart className="w-6 h-6" />}
      >
        <ChartSection />
      </DashboardCard>

      <DashboardCard
        title="Learning Analytics"
        className="lg:col-span-2"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-600 dark:text-blue-300">Completion Rate</h4>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">85%</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-600 dark:text-green-300">Average Score</h4>
              <p className="text-2xl font-bold text-green-700 dark:text-green-200">92%</p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </motion.div>
  );
};

export default PerformanceDashboard;
