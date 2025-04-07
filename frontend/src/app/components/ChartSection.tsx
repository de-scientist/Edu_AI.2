"use client";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartSectionProps {
  data: any;
}

const ChartSection = ({ data }: ChartSectionProps) => {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      // Transform the data for the chart
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      // Use the monthly progress data from the API
      const progressData = data.monthlyProgress || Array(12).fill(0);
      
      setChartData({
        labels: months,
        datasets: [
          {
            label: "Student Progress",
            data: progressData,
            fill: true,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
          }
        ]
      });
      setIsLoading(false);
    }
  }, [data]);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" suppressHydrationWarning>
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" suppressHydrationWarning></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4" suppressHydrationWarning>
        Error loading chart: {error}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center text-gray-500 p-4" suppressHydrationWarning>
        No data available for the chart
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      suppressHydrationWarning
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white" suppressHydrationWarning>Progress Overview</h2>
      <div className="h-64" suppressHydrationWarning>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Monthly Learning Progress'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default ChartSection;
