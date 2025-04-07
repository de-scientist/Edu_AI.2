"use client";

import { useState } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";
import { Course, Session, Resource } from "../../types/lecturer";
import { motion } from "framer-motion";

export default function CourseManagement() {
  const { 
    courses, 
    selectedCourse, 
    selectCourse,
    loading,
    error
  } = useLecturerDashboard();
  
  const [activeTab, setActiveTab] = useState<string>("materials");
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: "",
    type: "pdf",
    description: "",
  });
  const [newSession, setNewSession] = useState<Partial<Session>>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    type: "live",
  });

  const handleCourseSelect = (courseId: string) => {
    selectCourse(courseId);
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would call the API to upload the resource
    setShowUploadModal(false);
    setNewResource({
      title: "",
      type: "pdf",
      description: "",
    });
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would call the API to schedule the session
    setShowScheduleModal(false);
    setNewSession({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      type: "live",
    });
  };

  const renderTabContent = () => {
    if (!selectedCourse) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Select a course to manage</p>
        </div>
      );
    }

    switch (activeTab) {
      case "materials":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Materials</h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Upload Material
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCourse.materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{material.title}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {material.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{material.description}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "sessions":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scheduled Sessions</h3>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Schedule Session
              </button>
            </div>
            <div className="space-y-4">
              {selectedCourse.schedule.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{session.title}</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {session.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{session.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
                  </div>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Join Meeting
                    </a>
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Your Courses</h3>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className={`w-full text-left p-2 rounded ${
                    selectedCourse?.id === course.id
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {course.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          {selectedCourse ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
                <p className="text-gray-600">{selectedCourse.description}</p>
                <div className="mt-2 flex space-x-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {selectedCourse.code}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {selectedCourse.semester}
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex space-x-4 border-b">
                  <button
                    className={`pb-2 ${
                      activeTab === "materials"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("materials")}
                  >
                    Materials
                  </button>
                  <button
                    className={`pb-2 ${
                      activeTab === "sessions"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("sessions")}
                  >
                    Sessions
                  </button>
                </div>
                <div className="mt-4">{renderTabContent()}</div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">Select a course to manage</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload Material</h3>
            <form onSubmit={handleUploadResource}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newResource.type}
                    onChange={(e) =>
                      setNewResource({ ...newResource, type: e.target.value as any })
                    }
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={newResource.description}
                    onChange={(e) =>
                      setNewResource({ ...newResource, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    File
                  </label>
                  <input
                    type="file"
                    className="mt-1 block w-full"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Schedule Session</h3>
            <form onSubmit={handleScheduleSession}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newSession.title}
                    onChange={(e) =>
                      setNewSession({ ...newSession, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={newSession.description}
                    onChange={(e) =>
                      setNewSession({ ...newSession, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newSession.type}
                    onChange={(e) =>
                      setNewSession({ ...newSession, type: e.target.value as any })
                    }
                  >
                    <option value="live">Live Session</option>
                    <option value="recorded">Recorded Session</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={newSession.startTime}
                      onChange={(e) =>
                        setNewSession({ ...newSession, startTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={newSession.endTime}
                      onChange={(e) =>
                        setNewSession({ ...newSession, endTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 