export default function Sidebar() {
    return (
      <aside className="w-64 h-screen bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold">Menu</h2>
        <ul className="mt-4 space-y-2">
          <li>Dashboard</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      </aside>
    );
  }
  