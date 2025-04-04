"use client";
import { useEffect, useState } from "react";

// Define the log data type
interface LogData {
  id: number;
  user: { email: string };
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

const AdminUserLogs = () => {
  const [logs, setLogs] = useState<LogData[]>([]); // ✅ Ensure logs have a type

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch("http://localhost:5000/admin/user-logs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data: LogData[] = await response.json();
      setLogs(data);
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>User Login History</h2>
      <table className="border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">IP Address</th>
            <th className="border px-4 py-2">Device</th>
            <th className="border px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border px-4 py-2">{log.user.email}</td>
              <td className="border px-4 py-2">{log.ipAddress}</td>
              <td className="border px-4 py-2">{log.userAgent}</td>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserLogs;
