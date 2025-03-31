"use client";
import React, { useState } from "react";
import axios from "axios";

const StudyRecommendations = ({ studentId }) => {
  const [recommendations, setRecommendations] = useState("");

  const getRecommendations = () => {
    axios.post("http://localhost:5000/recommend-study", { studentId })
      .then((res) => setRecommendations(res.data.recommendations));
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
