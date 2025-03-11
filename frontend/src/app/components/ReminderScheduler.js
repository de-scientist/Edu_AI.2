import React, { useState } from "react";
import axios from "axios";

const ReminderScheduler = ({ studentId }) => {
  const [message, setMessage] = useState("");
  const [sendTime, setSendTime] = useState("");

  const scheduleReminder = () => {
    axios.post("http://localhost:5000/set-reminder", { studentId, message, sendTime })
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
