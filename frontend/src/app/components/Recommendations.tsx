"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define types for the recommendations data
interface RecommendationsProps {
  id: string | number; // Changed to 'id' instead of 'studentId'
}

const Recommendations: React.FC<RecommendationsProps> = ({ id }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]); // Explicitly typing recommendations as an array of strings

  useEffect(() => {
    axios.get(`http://localhost:5000/recommendations/${id}`)
      .then((res) => setRecommendations(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <h2>📚 Personalized Study Recommendations</h2>
      <ul>
        {recommendations.map((rec, idx) => (
          <li key={idx}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
