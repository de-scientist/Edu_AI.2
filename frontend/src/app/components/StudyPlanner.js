import React, { useState } from "react";
import axios from "axios";

const StudyPlanner = ({ studentId }) => {
  const [studyPlan, setStudyPlan] = useState([]);

  const generateStudyPlan = () => {
    axios.post("http://localhost:5000/generate-study-plan", { studentId, studyHours: 2 })
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
