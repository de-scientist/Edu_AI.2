"use client";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

//Displays users
//Admins can delete users
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
              <td>
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

//Accessed if logged in as Admin
useEffect(() => {
  fetch("http://localhost:5000/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setUsers(data));
}, []);

return (
  <div>
    <h1>Admin Panel</h1>
    {users.map((user) => (
      <div key={user.id}>{user.name} - {user.role}</div>
    ))}
  </div>
);
}

useEffect(() => {
  fetch("http://localhost:5000/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setStats(data));
}, []);

return (
  <div>
    <h1>Admin Dashboard</h1>
    {stats && (
      <>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Logins: {stats.totalLogins}</p>
        <p>User Roles:</p>
        <ul>
          {stats.roleStats.map((role) => (
            <li key={role.role}>{role.role}: {role._count.role}</li>
          ))}
        </ul>
      </>
    )}
  </div>
);
}
