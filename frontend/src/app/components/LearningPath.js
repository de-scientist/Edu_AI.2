"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const LearningPath: React.FC<LearningPathProps> = ({ studentId }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/learning-path/${studentId}`)
      .then((res) => setTopics(res.data));
  }, [studentId]);

  return (
    <div>
      <h2>🎯 Personalized Learning Path</h2>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>📌 {topic}</li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPath;
