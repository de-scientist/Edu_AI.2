"use client";

import { useState } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";
import { StudentFeedback } from "../../types/lecturer";

export default function FeedbackSystem() {
  const { selectedCourse, studentFeedback } = useLecturerDashboard();
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<StudentFeedback | null>(
    null
  );
  const [response, setResponse] = useState<string>("");

  const handleRespondToFeedback = (feedback: StudentFeedback) => {
    setSelectedFeedback(feedback);
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback || !response.trim()) return;

    try {
      // Implementation would call the API to submit the response
      console.log("Submitting response:", {
        feedbackId: selectedFeedback.id,
        response,
      });
      setShowResponseModal(false);
      setSelectedFeedback(null);
      setResponse("");
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const renderFeedbackList = () => {
    if (!studentFeedback) return null;

    return (
      <div className="space-y-4">
        {studentFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{feedback.studentName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(feedback.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  feedback.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : feedback.status === "resolved"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {feedback.status}
              </span>
            </div>
            <div className="mt-2">
              <h4 className="font-medium text-gray-700">Feedback</h4>
              <p className="text-gray-600 mt-1">{feedback.content}</p>
            </div>
            {feedback.category && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">Category: </span>
                <span className="text-sm font-medium">{feedback.category}</span>
              </div>
            )}
            {feedback.response && (
              <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-700">Your Response</h4>
                <p className="text-gray-600 mt-1">{feedback.response}</p>
              </div>
            )}
            {feedback.status === "pending" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleRespondToFeedback(feedback)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Respond
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFeedbackStats = () => {
    if (!studentFeedback) return null;

    const total = studentFeedback.length;
    const pending = studentFeedback.filter((f) => f.status === "pending").length;
    const resolved = studentFeedback.filter((f) => f.status === "resolved").length;
    const inProgress = studentFeedback.filter(
      (f) => f.status === "in-progress"
    ).length;

    const categories = studentFeedback.reduce((acc, feedback) => {
      if (feedback.category) {
        acc[feedback.category] = (acc[feedback.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Feedback Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Feedback</span>
              <span className="font-medium">{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="font-medium text-yellow-600">{pending}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress</span>
              <span className="font-medium text-blue-600">{inProgress}</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved</span>
              <span className="font-medium text-green-600">{resolved}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Feedback Categories</h3>
          <div className="space-y-2">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a course to view feedback</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Student Feedback</h2>
        {renderFeedbackStats()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Feedback List</h3>
          <div className="flex space-x-2">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="content">Content</option>
              <option value="delivery">Delivery</option>
              <option value="assessment">Assessment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {renderFeedbackList()}
      </div>

      {showResponseModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Respond to Feedback</h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Student Feedback</h4>
              <p className="text-gray-600 mt-1">{selectedFeedback.content}</p>
            </div>
            <form onSubmit={handleSubmitResponse}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 