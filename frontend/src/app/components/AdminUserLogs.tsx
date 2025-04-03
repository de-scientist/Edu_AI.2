"use client";
import { useEffect, useState } from "react";

const AdminUserLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch("http://localhost:5000/admin/user-logs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLogs(data);
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>User Login History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>IP Address</th>
            <th>Device</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user.email}</td>
              <td>{log.ipAddress}</td>
              <td>{log.userAgent}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserLogs;
