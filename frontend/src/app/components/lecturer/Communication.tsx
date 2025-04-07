"use client";

import { useState } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";
import { LecturerChatMessage } from "../../types/lecturer";

export default function Communication() {
  const { selectedCourse, chatMessages, sendMessage } = useLecturerDashboard();
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<{
    title: string;
    content: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    content: "",
    priority: "medium",
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || selectedRecipients.length === 0) return;

    const message: LecturerChatMessage = {
      id: Date.now().toString(),
      senderId: "lecturer-id", // This would come from the auth context
      senderName: "Lecturer", // This would come from the auth context
      recipients: selectedRecipients,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    sendMessage(message);
    setNewMessage("");
    setSelectedRecipients([]);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.title.trim() || !announcement.content.trim()) return;

    // Implementation would call the API to create the announcement
    console.log("Creating announcement:", announcement);
    setShowAnnouncementModal(false);
    setAnnouncement({
      title: "",
      content: "",
      priority: "medium",
    });
  };

  const renderChatList = () => {
    if (!chatMessages) return null;

    return (
      <div className="space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{message.senderName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                To: {message.recipients.join(", ")}
              </div>
            </div>
            <p className="mt-2 text-gray-600">{message.content}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderAnnouncementList = () => {
    // This would be populated from the API
    const announcements = [
      {
        id: "1",
        title: "Assignment Deadline Extended",
        content: "The deadline for the latest assignment has been extended to next Friday.",
        priority: "high" as const,
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Office Hours Update",
        content: "Office hours will be held virtually this week due to maintenance.",
        priority: "medium" as const,
        timestamp: new Date().toISOString(),
      },
    ];

    return (
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(announcement.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  announcement.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : announcement.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {announcement.priority}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{announcement.content}</p>
          </div>
        ))}
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a course to manage communications</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Announcements</h2>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Announcement
          </button>
        </div>
        {renderAnnouncementList()}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <form onSubmit={handleSendMessage} className="mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipients
              </label>
              <select
                multiple
                value={selectedRecipients}
                onChange={(e) =>
                  setSelectedRecipients(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all-students">All Students</option>
                <option value="group-a">Group A</option>
                <option value="group-b">Group B</option>
                <option value="individual-1">Student 1</option>
                <option value="individual-2">Student 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </form>
        {renderChatList()}
      </div>

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Announcement</h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  value={announcement.content}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, content: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={announcement.priority}
                  onChange={(e) =>
                    setAnnouncement({
                      ...announcement,
                      priority: e.target.value as "low" | "medium" | "high",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 