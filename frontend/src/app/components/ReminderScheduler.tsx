"use client";
import React, { useState } from "react";
import axios from "axios";

// Define the type for the props
interface ReminderSchedulerProps {
  id: string;  // Explicitly define the type of `id` as string
}

const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({ id }) => {  // ✅ Use the defined type
  const [message, setMessage] = useState("");
  const [sendTime, setSendTime] = useState("");

  const scheduleReminder = () => {
    axios.post("http://localhost:5000/set-reminder", { id, message, sendTime })
      .then(() => alert("Reminder Scheduled!"));
  };

  return (
    <div>
      <h2>🔔 Schedule Study Reminder</h2>
      <input type="text" placeholder="Reminder Message" onChange={(e) => setMessage(e.target.value)} />
      <input type="datetime-local" onChange={(e) => setSendTime(e.target.value)} />
      <button onClick={scheduleReminder}>📅 Schedule Reminder</button>
    </div>
  );
};

export default ReminderScheduler;
