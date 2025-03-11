import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = ({ studentId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/recommendations/${studentId}`)
      .then((res) => setRecommendations(res.data))
      .catch((err) => console.error(err));
  }, [studentId]);

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
