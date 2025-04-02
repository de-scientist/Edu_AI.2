"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HomePage() {
  const [userData, setUserData] = useState<any>([]);
  const [statsData, setStatsData] = useState<any>(null);

  // Fetching data using useEffect for both user and statistics data
  useEffect(() => {
    fetch("http://localhost:5000/eduai/stats")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch((err) => console.error("Failed to fetch stats", err));

    fetch("http://localhost:5000/eduai/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error("Failed to fetch user data", err));
  }, []); // Empty array means this effect runs once when the component mounts

  // Example chart data
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Student Progress',
        data: [20, 40, 60, 80, 90, 100],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6 bg-background text-foreground transition-all">
      {/* Hero Section */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-shadow">Welcome to the Edu_AI Dashboard</h1>
      </div>

{/* Edu_AI Features Section */}
<div className="mt-10">
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
    {/* Left Section */}
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-shadow text-center">What is Edu_AI?</h2>
      <p className="mt-4 text-lg text-center">
        Edu_AI is an AI-powered educational system designed to enhance student-teacher interactions and
        create personalized learning experiences.
      </p>
    </div>

    {/* Center Section */}
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-semibold mt-6 text-center">Core Features</h3>
      <ul className="list-disc pl-6 text-lg mt-2 space-y-2 text-center">
        <li><span className="font-bold">Personalized Learning Paths:</span> Edu_AI creates tailored educational journeys.</li>
        <li><span className="font-bold">AI-Powered Q&A:</span> Students receive real-time AI-generated answers.</li>
        <li><span className="font-bold">Progress Tracking:</span> Monitor learning progress and improvement areas.</li>
        <li><span className="font-bold">Feedback & Adaptation:</span> Learning adapts based on student feedback.</li>
        <li><span className="font-bold">Gamification:</span> Upcoming features will make learning more interactive.</li>
      </ul>
    </div>

    {/* Right Section */}
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-semibold mt-6 text-center">How Does Edu_AI Work?</h3>
      <p className="text-lg mt-2 leading-relaxed text-center">
        Edu_AI leverages AI models to predict optimal learning paths, using NLP for real-time Q&A.
        It continuously refines content based on student performance data.
      </p>
    </div>
  </section>
</div>


      {/* Chart Section */}
      <section className="mt-8">
        <h2 className="text-3xl font-semibold text-shadow text-center">Edu_AI Analytics</h2>
        <p className="text-lg mt-2 text-center">
          Track student progress over time with real-time analytics.
        </p>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      </section>

      {/* Stats Section */}
{statsData && (
  <section className="mt-8 text-center">
    <h2 className="text-3xl font-semibold text-shadow">Edu_AI Statistics</h2>
    <div className="mt-4 bg-gray-100 p-6 rounded-lg shadow-md inline-block">
      <p className="text-lg font-semibold">📚 Total Active Students: {statsData.totalStudents}</p>
      <p className="text-lg font-semibold">📝 Questions Answered: {statsData.totalQuestions}</p>
      <p className="text-lg font-semibold">📈 Completion Rate: {statsData.avgCompletionRate}%</p>
    </div>
  </section>
)}


      {/* About Us Section */}
      <section className="mt-8">
        <h2 className="text-3xl font-semibold text-shadow text-center">About Us</h2>
        <p className="text-lg mt-2 leading-relaxed text-center">
          Edu_AI is built by a passionate team of educators and developers, aiming to revolutionize education
          through AI-driven learning.
        </p>
      </section>

      {/* Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button className="btn btn-primary">Get Started</button>
        <button className="btn btn-secondary">Learn More</button>
      </div>
    </div>
  );
}
