"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// Define types for the questions and quiz data
type Question = {
  id: string | number;
  text: string;
  options: string[];
};

type QuizItem = {
  id: string | number;
  question: string;
  options: string[];
  answer: string;
};

interface QuizProps {
  id: string; // Accepting lecturer/student id
}

interface AIQuizProps {
  id: string; // Accepting lecturer/student id
}

// ✅ Modified Quiz component to accept id
const Quiz: React.FC<QuizProps> = ({ id }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string | number, string>>({});
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/questions", { params: { id } }) // ✅ Pass id when fetching questions
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [id]);

  const handleSubmit = (questionId: string | number, answer: string) => {
    setSelectedAnswer((prevState) => ({ ...prevState, [questionId]: answer }));

    axios
      .post("http://localhost:5000/check-answer", { questionId, studentId: id, studentAnswer: answer }) // ✅ Include id
      .then((res) => setFeedback(res.data.message))
      .catch((err) => console.error("Error submitting answer:", err));
  };

  return (
    <div>
      <h2>🧩 Take a Quiz</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <h3>{q.text}</h3>
          {q.options.map((option) => (
            <button key={option} onClick={() => handleSubmit(q.id, option)}>
              {option}
            </button>
          ))}
        </div>
      ))}
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

// ✅ Updated AIQuiz component to use id
const AIQuiz: React.FC<AIQuizProps> = ({ id }) => {
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<string | number, string>>({});

  const generateQuiz = () => {
    axios
      .post("http://localhost:5000/generate-quiz", { id }) // ✅ Include id when generating the quiz
      .then((res) => setQuiz(res.data.quiz))
      .catch((err) => console.error("Error generating quiz:", err));
  };

  const submitAnswers = () => {
    let score = 0;
    quiz.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    // ✅ Send results with id
    axios
      .post("http://localhost:5000/submit-quiz", { id, answers })
      .then(() => alert(`🎯 Your Score: ${score}/${quiz.length}`))
      .catch((err) => console.error("Error submitting quiz:", err));
  };

  return (
    <div>
      <h2>📝 AI-Generated Quiz</h2>
      <button onClick={generateQuiz}>🎯 Generate Quiz</button>
      <ul>
        {quiz.map((q) => (
          <li key={q.id}>
            <p>{q.question}</p>
            {q.options.map((opt, index) => (
              <label key={index}>
                <input type="radio" name={String(q.id)} value={opt} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
                {opt}
              </label>
            ))}
          </li>
        ))}
      </ul>
      <button onClick={submitAnswers}>✔️ Submit Answers</button>
    </div>
  );
};

// ✅ Updated getHint function to accept id
const getHint = async (id: string, question: string, studentAnswer: string) => {
  try {
    const response = await fetch("http://localhost:5000/tutor/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, question, studentAnswer }), // ✅ Include id
    });

    const data = await response.json();
    return data.hint;
  } catch (error) {
    console.error("Error getting hint:", error);
  }
};

// Example Usage of Hint Request
const handleHintRequest = async (id: string) => {
  const hint = await getHint(id, "What is 5 + 5?", "The answer is 12.");
  console.log("Hint:", hint);
};

export { Quiz, AIQuiz, getHint };
