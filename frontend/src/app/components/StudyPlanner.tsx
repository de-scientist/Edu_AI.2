"use client";

import React, { useState } from "react";
import axios from "axios";

const StudyPlanner = ({ id }: { id: string }) => {  // Accept `id` instead of `studentId`
  const [studyPlan, setStudyPlan] = useState<any[]>([]);  // Typing as any[] assuming the data structure

  const generateStudyPlan = () => {
    axios.post("http://localhost:5000/generate-study-plan", { studentId: id, studyHours: 2 })  // Use `id` here
      .then((res) => setStudyPlan(res.data.studyPlan));
  };

  return (
    <div>
      <h2>📅 AI Study Planner</h2>
      <button onClick={generateStudyPlan}>📝 Generate Study Plan</button>
      <ul>
        {studyPlan.map((item, index) => (
          <li key={index}>{item.topic} - {new Date(item.date).toDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudyPlanner;
