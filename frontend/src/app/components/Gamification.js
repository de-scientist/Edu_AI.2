import React, { useState, useEffect } from "react";
import axios from "axios";

const Gamification = ({ studentId }) => {
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/gamification/${studentId}`)
      .then((res) => {
        setXp(res.data.xpPoints);
        setBadges(res.data.badges);
      });
  }, [studentId]);

  return (
    <div>
      <h2>🏆 Gamification Dashboard</h2>
      <p>🔥 XP Points: {xp}</p>
      <h3>🎖 Badges:</h3>
      <ul>
        {badges.map((badge, index) => (
          <li key={index}>🏅 {badge}</li>
        ))}
      </ul>
    </div>
  );
};

export default Gamification;
