import { useState } from "react";
import { FaRobot } from "react-icons/fa";

export default function StudentInput() {
  const [question, setQuestion] = useState("What is 5 + 5?");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [hint, setHint] = useState("");

  const getHint = async () => {
    const response = await fetch("http://localhost:5000/tutor/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "student123", question, studentAnswer }),
    });

    const data = await response.json();
    setHint(data.hint);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">AI Tutoring Assistant</h2>
      <p className="text-gray-600 mb-4">{question}</p>
      <input
        type="text"
        value={studentAnswer}
        onChange={(e) => setStudentAnswer(e.target.value)}
        placeholder="Enter your answer..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={getHint}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full flex items-center justify-center"
      >
        <FaRobot className="mr-2" /> Get AI Hint
      </button>
      {hint && (
        <p className="mt-4 text-green-600 bg-green-100 p-2 rounded">
          💡 Hint: {hint}
        </p>
      )}
    </div>
  );
}
