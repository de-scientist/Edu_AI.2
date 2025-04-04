/*
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

//Users can send & receive messages in real-time
export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="h-40 overflow-auto border p-2">
        {messages.map((msg, index) => <p key={index}>{msg}</p>)}
      </div>
      <input className="w-full border p-2" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="bg-blue-500 text-white px-2 py-1 mt-2" onClick={sendMessage}>Send</button>
    </div>
  );
}
*/