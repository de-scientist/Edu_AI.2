"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the LearningPathProps
type LearningPathProps = {
  id: string;  // ✅ Changed from `studentId` to `id`
};

// Define the type for the topics array
type Topic = {
  name: string;  // Adjust this if the actual structure is different
};

const LearningPath: React.FC<LearningPathProps> = ({ id }) => {  // ✅ Changed from `studentId` to `id`
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/learning-path/${id}`)  // ✅ Changed from `studentId` to `id`
      .then((res) => setTopics(res.data))
      .catch((error) => console.error("Error fetching learning path:", error));
  }, [id]);  // ✅ Updated dependency

  return (
    <div>
      <h2>🎯 Personalized Learning Path</h2>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>📌 {topic.name}</li> 
        ))}
      </ul>
    </div>
  );
};

export default LearningPath;
