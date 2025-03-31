"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/questions").then((res) => setQuestions(res.data));
  }, []);

  const handleSubmit = (questionId, answer) => {
    setSelectedAnswer({ ...selectedAnswer, [questionId]: answer });

    axios.post("http://localhost:5000/check-answer", { questionId, studentAnswer: answer })
      .then((res) => setFeedback(res.data.message));
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

const Quiz = ({ studentId }) => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});

  const generateQuiz = () => {
    axios.post("http://localhost:5000/generate-quiz", { studentId })
      .then((res) => setQuiz(res.data.quiz));
  };

  const submitAnswers = () => {
    let score = 0;
    quiz.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });
    alert(`🎯 Your Score: ${score}/${quiz.length}`);
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
                <input type="radio" name={q.id} value={opt} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
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

const getHint = async (question, studentAnswer) => {
  const response = await fetch("http://localhost:5000/tutor/hint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "student123", question, studentAnswer }),
  });

  const data = await response.json();
  return data.hint;
};

// Example Usage
const handleHintRequest = async () => {
  const hint = await getHint("What is 5 + 5?", "The answer is 12.");
  console.log("Hint:", hint);
};

fastify.post("/quiz/generate", async (req, reply) => {
  const { userId, topic } = req.body;

  // Check student history from DB
  const performance = await prisma.performance.findMany({
    where: { userId, topic },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const correctAnswers = performance.filter((p) => p.correct).length;
  let difficulty = "medium";

  if (correctAnswers < 2) difficulty = "easy";
  else if (correctAnswers > 3) difficulty = "hard";

  // AI-generated quiz question
  const prompt = `Generate a ${difficulty} level quiz question on ${topic}.`;
  
  const aiResponse = await openai.completions.create({
    model: "gpt-4",
    prompt: prompt,
    max_tokens: 100,
  });

  const question = aiResponse.choices[0].text.trim();

  return reply.send({ question, difficulty });
});


export default Quiz;
