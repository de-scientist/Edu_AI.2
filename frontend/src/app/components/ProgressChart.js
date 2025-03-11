import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import socket from "../socket";
import axios from "axios";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressChart = () => {
  const [progressData, setProgressData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [progressRes, studentsRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:5000/progress"),
          axios.get("http://localhost:5000/students"),
          axios.get("http://localhost:5000/courses"),
        ]);

        setProgressData(progressRes.data);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

    socket.on("progress_broadcast", (data) => {
      setProgressData((prevData) => [...prevData, data]);
    });

    return () => socket.off("progress_broadcast");
  }, []);

  // Handle Filter Change
  const fetchFilteredProgress = async () => {
    try {
      const response = await axios.get("http://localhost:5000/progress", {
        params: {
          studentId: selectedStudent || undefined,
          courseId: selectedCourse || undefined,
        },
      });

      setProgressData(response.data);
    } catch (error) {
      console.error("Error fetching filtered progress:", error);
    }
  };

  const chartData = {
    labels: progressData.map((entry) => new Date(entry.updatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: "Student Progress (%)",
        data: progressData.map((entry) => entry.progress),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Real-Time Student Progress" },
    },
  };

  return (
    <div>
      <h2>📊 Student Progress Over Time</h2>

      {/* Filters */}
      <div>
        <label>Filter by Student:</label>
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">All Students</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <label>Filter by Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <button onClick={fetchFilteredProgress}>Apply Filters</button>
      </div>

      {/* Chart */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;
