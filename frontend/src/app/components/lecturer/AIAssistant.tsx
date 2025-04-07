"use client";

import { useState } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";
import { AIInsight, ContentSuggestion } from "../../types/lecturer";

export default function AIAssistant() {
  const { selectedCourse, aiInsights, contentSuggestions } = useLecturerDashboard();
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ContentSuggestion | null>(null);
  const [showInsightModal, setShowInsightModal] = useState<boolean>(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState<boolean>(false);

  const handleInsightClick = (insight: AIInsight) => {
    setSelectedInsight(insight);
    setShowInsightModal(true);
  };

  const handleSuggestionClick = (suggestion: ContentSuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowSuggestionModal(true);
  };

  const renderInsightsList = () => {
    if (!aiInsights) return null;

    return (
      <div className="space-y-4">
        {aiInsights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleInsightClick(insight)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{insight.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(insight.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  insight.status === "new"
                    ? "bg-blue-100 text-blue-800"
                    : insight.status === "reviewed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {insight.status}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{insight.summary}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSuggestionsList = () => {
    if (!contentSuggestions) return null;

    return (
      <div className="space-y-4">
        {contentSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{suggestion.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(suggestion.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  suggestion.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : suggestion.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {suggestion.status}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{suggestion.description}</p>
          </div>
        ))}
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a course to view AI insights and suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
        {renderInsightsList()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Content Suggestions</h2>
        {renderSuggestionsList()}
      </div>

      {showInsightModal && selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedInsight.title}</h3>
              <button
                onClick={() => setShowInsightModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(selectedInsight.timestamp).toLocaleString()}
                </p>
                <p className="mt-2 text-gray-600">{selectedInsight.summary}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Detailed Analysis</h4>
                <p className="text-gray-600">{selectedInsight.details}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedInsight.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowInsightModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Implementation would update the insight status
                    setShowInsightModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Mark as Reviewed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuggestionModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedSuggestion.title}</h3>
              <button
                onClick={() => setShowSuggestionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(selectedSuggestion.timestamp).toLocaleString()}
                </p>
                <p className="mt-2 text-gray-600">{selectedSuggestion.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Suggested Content</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-gray-600">
                    {selectedSuggestion.content}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSuggestionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Implementation would update the suggestion status
                    setShowSuggestionModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    // Implementation would update the suggestion status
                    setShowSuggestionModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 