import React, { useState, useEffect } from "react";
import axios from "axios";

const GoalTracker = ({ studentId }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/goals/${studentId}`)
      .then((res) => setGoals(res.data));
  }, []);

  const addGoal = () => {
    axios.post("http://localhost:5000/set-goal", { studentId, goal: newGoal })
      .then((res) => setGoals([...goals, res.data]));
  };

  const completeGoal = (id) => {
    axios.put(`http://localhost:5000/update-goal/${id}`)
      .then((res) => setGoals(goals.map((goal) => (goal.id === id ? res.data : goal))));
  };

  return (
    <div>
      <h2>🎯 Goal Tracker</h2>
      <input type="text" onChange={(e) => setNewGoal(e.target.value)} placeholder="Enter goal" />
      <button onClick={addGoal}>➕ Set Goal</button>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            {goal.goal} {goal.completed ? "✅" : <button onClick={() => completeGoal(goal.id)}>✔️ Mark Complete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalTracker;
