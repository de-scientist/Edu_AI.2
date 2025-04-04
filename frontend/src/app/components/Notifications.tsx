"use client";
import { useEffect, useState } from "react";

// Define the type for notifications
interface Notification {
  message: string;
}

export default function Notifications() {
  // Explicitly define the state type
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /*
  useEffect(() => {
    socket.on("receive_notification", (data: Notification) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_notification");
    };
  }, []);
  */

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
}
