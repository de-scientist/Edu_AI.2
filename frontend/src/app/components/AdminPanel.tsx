"use client";

import { useEffect, useState } from "react";

// Define the type for the user object
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  totalUsers: number;
  totalLogins: number;
  roleStats: { role: string; _count: { role: number } }[];
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]); // Specify the type for users
  const [stats, setStats] = useState<Stats | null>(null); // For stats
  const token = localStorage.getItem("token");

  // Fetch users when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Access denied", err));
  }, [token]); // Ensure token is available before fetching users

  // Fetch stats when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats", err));
  }, [token]); // Ensure token is available before fetching stats

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      
      {/* Users Table */}
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stats Section */}
      {stats && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Logins: {stats.totalLogins}</p>
          <p>User Roles:</p>
          <ul>
            {stats.roleStats.map((role) => (
              <li key={role.role}>
                {role.role}: {role._count.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
