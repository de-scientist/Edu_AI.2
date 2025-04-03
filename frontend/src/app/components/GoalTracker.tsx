"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Define Goal type
type Goal = {
  id: string | number;  // Assuming ID is a string or number
  goal: string;
  completed: boolean;
};

interface GoalTrackerProps {
  id: string | number;  // Use id instead of studentId
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ id }) => {
  const [goals, setGoals] = useState<Goal[]>([]);  // Define the goals state with Goal type
  const [newGoal, setNewGoal] = useState<string>("");

  useEffect(() => {
    axios.get(`http://localhost:5000/goals/${id}`)
      .then((res) => setGoals(res.data))
      .catch((err) => console.error(err)); // Added error handling
  }, [id]); // Added id dependency to re-fetch on change

  const addGoal = () => {
    axios.post("http://localhost:5000/set-goal", { id, goal: newGoal })
      .then((res) => setGoals([...goals, res.data]))
      .catch((err) => console.error(err)); // Added error handling
  };

  const completeGoal = (goalId: string | number) => {
    axios.put(`http://localhost:5000/update-goal/${goalId}`)
      .then((res) => setGoals(goals.map((goal) => (goal.id === goalId ? res.data : goal))))
      .catch((err) => console.error(err)); // Added error handling
  };

  return (
    <div>
      <h2>🎯 Goal Tracker</h2>
      <input
        type="text"
        onChange={(e) => setNewGoal(e.target.value)}
        placeholder="Enter goal"
      />
      <button onClick={addGoal}>➕ Set Goal</button>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            {goal.goal}{" "}
            {goal.completed ? (
              "✅"
            ) : (
              <button onClick={() => completeGoal(goal.id)}>✔️ Mark Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalTracker;
