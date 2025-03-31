"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const TopStudents = () => {  // ✅ Renamed to avoid duplication
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchTopStudents() {
      try {
        const response = await axios.get("http://localhost:5000/leaderboard");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    fetchTopStudents();
  }, []);

  return (
    <div>
      <h2>🏆 Top Performing Students</h2>
      <ul>
        {students.map((student, index) => (
          <li key={student.id}>
            {index + 1}. {student.name} - {student.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/leaderboard");
        const data = await response.json();
        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4">🏆 Leaderboard</h2>
      <ul>
        {leaders.map((student, index) => (
          <motion.li
            key={student.id}
            className="flex justify-between items-center p-2 border-b"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <span className="font-bold text-gray-700">
              {index + 1}. {student.name}
            </span>
            <span className="text-blue-500 font-semibold">{student.points} pts</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
