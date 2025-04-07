"use client";

import { useState } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  timeLimit: number;
  questions: Question[];
  totalPoints: number;
}

export default function AssessmentTools() {
  const { selectedCourse } = useLecturerDashboard();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newAssessment, setNewAssessment] = useState<Partial<Assessment>>({
    title: "",
    description: "",
    dueDate: "",
    timeLimit: 60,
    questions: [],
    totalPoints: 0,
  });
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    question: "",
    options: ["", ""],
    points: 1,
  });

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const assessment: Assessment = {
      id: Date.now().toString(),
      title: newAssessment.title || "",
      description: newAssessment.description || "",
      courseId: selectedCourse.id,
      dueDate: newAssessment.dueDate || "",
      timeLimit: newAssessment.timeLimit || 60,
      questions: newAssessment.questions || [],
      totalPoints: newAssessment.totalPoints || 0,
    };

    setAssessments([...assessments, assessment]);
    setShowCreateModal(false);
    setNewAssessment({
      title: "",
      description: "",
      dueDate: "",
      timeLimit: 60,
      questions: [],
      totalPoints: 0,
    });
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.type) return;

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as Question["type"],
      question: newQuestion.question,
      options: newQuestion.type === "multiple-choice" ? newQuestion.options : undefined,
      correctAnswer: newQuestion.correctAnswer,
      points: newQuestion.points || 1,
    };

    setNewAssessment({
      ...newAssessment,
      questions: [...(newAssessment.questions || []), question],
      totalPoints: (newAssessment.totalPoints || 0) + question.points,
    });

    setNewQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", ""],
      points: 1,
    });
  };

  const addQuestionOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...(newQuestion.options || []), ""],
    });
  };

  const removeQuestionOption = (index: number) => {
    const options = [...(newQuestion.options || [])];
    options.splice(index, 1);
    setNewQuestion({ ...newQuestion, options });
  };

  const updateQuestionOption = (index: number, value: string) => {
    const options = [...(newQuestion.options || [])];
    options[index] = value;
    setNewQuestion({ ...newQuestion, options });
  };

  const renderQuestionForm = () => {
    return (
      <form onSubmit={handleAddQuestion} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Question Type
          </label>
          <select
            value={newQuestion.type}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, type: e.target.value as Question["type"] })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
            <option value="essay">Essay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Question
          </label>
          <textarea
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        {newQuestion.type === "multiple-choice" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            {newQuestion.options?.map((option, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateQuestionOption(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {newQuestion.options && newQuestion.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeQuestionOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestionOption}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Add Option
            </button>
          </div>
        )}

        {(newQuestion.type === "multiple-choice" ||
          newQuestion.type === "true-false" ||
          newQuestion.type === "short-answer") && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correct Answer
            </label>
            <input
              type="text"
              value={newQuestion.correctAnswer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Points
          </label>
          <input
            type="number"
            value={newQuestion.points}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Question
        </button>
      </form>
    );
  };

  const renderAssessmentList = () => {
    return (
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{assessment.title}</h3>
                <p className="text-gray-600 mt-1">{assessment.description}</p>
                <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                  <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                  <span>Time Limit: {assessment.timeLimit} minutes</span>
                  <span>Total Points: {assessment.totalPoints}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Questions</h4>
              <div className="space-y-2">
                {assessment.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {index + 1}. {question.question}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.points} points
                      </span>
                    </div>
                    {question.type === "multiple-choice" && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="text-sm text-gray-600"
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a course to create assessments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assessments</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Assessment
          </button>
        </div>
        {renderAssessmentList()}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Assessment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={newAssessment.title}
                  onChange={(e) =>
                    setNewAssessment({ ...newAssessment, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newAssessment.description}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newAssessment.dueDate}
                    onChange={(e) =>
                      setNewAssessment({ ...newAssessment, dueDate: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={newAssessment.timeLimit}
                    onChange={(e) =>
                      setNewAssessment({
                        ...newAssessment,
                        timeLimit: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Questions</h4>
                {newAssessment.questions?.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-gray-50 p-3 rounded-lg mb-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {index + 1}. {question.question}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.points} points
                      </span>
                    </div>
                    {question.type === "multiple-choice" && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="text-sm text-gray-600"
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {renderQuestionForm()}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 