"use client";

import { useEffect, useState } from "react";

export default function Achievements({ studentId }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await fetch(`http://localhost:5000/achievements/${studentId}`);
      const data = await response.json();
      setAchievements(data);
    };
    fetchAchievements();
  }, [studentId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">🏅 Achievements</h2>
      <div className="grid grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div key={ach.id} className="text-center">
            <img src={`/images/${ach.icon}`} alt={ach.name} className="w-12 h-12 mx-auto" />
            <p className="text-sm mt-2 font-semibold">{ach.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
