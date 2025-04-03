"use client";
import React, { useState } from "react";
import axios from "axios";

type StudyRecommendationsProps = {
  id: string | null; // ✅ Changed from `studentId` to `id`
};

const StudyRecommendations: React.FC<StudyRecommendationsProps> = ({ id }) => {
  const [recommendations, setRecommendations] = useState("");

  const getRecommendations = () => {
    if (!id) {
      console.error("⚠️ No ID provided for recommendations.");
      return;
    }

    axios.post("http://localhost:5000/recommend-study", { id }) // ✅ Send `id` instead of `studentId`
      .then((res) => setRecommendations(res.data.recommendations))
      .catch((err) => console.error("❌ Error fetching recommendations:", err));
  };

  return (
    <div>
      <h2>📖 AI Study Recommendations</h2>
      <button onClick={getRecommendations}>🔍 Get Study Tips</button>
      {recommendations && <p>{recommendations}</p>}
    </div>
  );
};

export default StudyRecommendations;
