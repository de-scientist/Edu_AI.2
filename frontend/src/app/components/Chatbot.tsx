"use client";
import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const askQuestion = () => {
    axios.post("http://localhost:5000/chat", { question })
      .then((res) => setResponse(res.data.answer));
  };

  return (
    <div>
      <h2>🤖 AI Chatbot Tutor</h2>
      <input type="text" placeholder="Ask a question..." onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={askQuestion}>💬 Ask AI</button>
      <p><strong>Answer:</strong> {response}</p>
    </div>
  );
};

export default Chatbot;
