"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the LearningPathProps
type LearningPathProps = {
  studentId: string;
};

// Define the type for the topics array (if each topic is an object, adjust the type accordingly)
type Topic = {
  name: string;  // Adjust this depending on the actual structure of each topic
};

const LearningPath: React.FC<LearningPathProps> = ({ studentId }) => {
  const [topics, setTopics] = useState<Topic[]>([]); // Define topics as an array of Topic objects

  useEffect(() => {
    axios.get(`http://localhost:5000/learning-path/${studentId}`)
      .then((res) => setTopics(res.data)) // Assuming the response is an array of topics
      .catch((error) => console.error("Error fetching learning path:", error)); // Add error handling
  }, [studentId]);

  return (
    <div>
      <h2>🎯 Personalized Learning Path</h2>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>📌 {topic.name}</li> 
        ))} {/* <-- Added the closing parenthesis for the map */}
      </ul>
    </div>
  );
};

export default LearningPath;
