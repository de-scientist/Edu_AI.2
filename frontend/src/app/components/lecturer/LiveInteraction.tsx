"use client";

import { useState, useEffect, useRef } from "react";
import { useLecturerDashboard } from "../../contexts/LecturerDashboardContext";
import { Session } from "../../types/lecturer";

export default function LiveInteraction() {
  const { selectedCourse, sessions } = useLecturerDashboard();
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [participants, setParticipants] = useState<Array<{
    id: string;
    name: string;
    role: string;
    isSpeaking: boolean;
  }>>([]);
  const [polls, setPolls] = useState<Array<{
    id: string;
    question: string;
    options: Array<{ id: string; text: string; votes: number }>;
    isActive: boolean;
  }>>([]);
  const [newPoll, setNewPoll] = useState<{
    question: string;
    options: string[];
  }>({
    question: "",
    options: ["", ""],
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const startSession = async () => {
    try {
      // Implementation would call the API to start a new session
      const newSession: Session = {
        id: "new-session-id",
        courseId: selectedCourse?.id || "",
        title: "Live Session",
        description: "Interactive lecture session",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        type: "live",
        meetingLink: "https://meet.example.com/session",
      };
      setActiveSession(newSession);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const endSession = async () => {
    try {
      // Implementation would call the API to end the session
      setActiveSession(null);
      setChatMessages([]);
      setParticipants([]);
      setPolls([]);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implementation would handle recording start/stop
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Implementation would handle screen sharing start/stop
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: "Lecturer",
      message: newMessage,
      timestamp: new Date(),
    };
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const createPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoll.question.trim() || newPoll.options.some((opt) => !opt.trim()))
      return;

    const poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: newPoll.options.map((text) => ({
        id: Date.now().toString() + Math.random(),
        text,
        votes: 0,
      })),
      isActive: true,
    };
    setPolls([...polls, poll]);
    setNewPoll({ question: "", options: ["", ""] });
  };

  const addPollOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ""] });
  };

  const removePollOption = (index: number) => {
    const options = [...newPoll.options];
    options.splice(index, 1);
    setNewPoll({ ...newPoll, options });
  };

  const updatePollOption = (index: number, value: string) => {
    const options = [...newPoll.options];
    options[index] = value;
    setNewPoll({ ...newPoll, options });
  };

  const renderVideoGrid = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 text-white text-sm">
            You (Lecturer)
          </div>
        </div>
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-4xl">
                {participant.name.charAt(0)}
              </div>
            </div>
            <div className="absolute bottom-2 left-2 text-white text-sm">
              {participant.name}
              {participant.isSpeaking && (
                <span className="ml-2 text-green-400">Speaking</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div className="flex flex-col h-full">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "Lecturer" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "Lecturer"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                <div className="text-sm font-medium">{message.sender}</div>
                <div>{message.message}</div>
                <div className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderPolls = () => {
    return (
      <div className="space-y-4">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2">{poll.question}</h4>
            <div className="space-y-2">
              {poll.options.map((option) => (
                <div key={option.id} className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          poll.options.reduce((acc, opt) => acc + opt.votes, 0) >
                          0
                            ? (option.votes /
                                poll.options.reduce(
                                  (acc, opt) => acc + opt.votes,
                                  0
                                )) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{option.text}</span>
                    <span>{option.votes} votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <form onSubmit={createPoll} className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-4">Create New Poll</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Question
              </label>
              <input
                type="text"
                value={newPoll.question}
                onChange={(e) =>
                  setNewPoll({ ...newPoll, question: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  {newPoll.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPollOption}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Add Option
              </button>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a course to start a live session</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Live Session</h2>
          {!activeSession ? (
            <button
              onClick={startSession}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={endSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Session
            </button>
          )}
        </div>
        {activeSession && (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-lg ${
                  isRecording
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              <button
                onClick={toggleScreenShare}
                className={`px-4 py-2 rounded-lg ${
                  isScreenSharing
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isScreenSharing ? "Stop Sharing" : "Share Screen"}
              </button>
            </div>
            {renderVideoGrid()}
          </div>
        )}
      </div>

      {activeSession && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm h-[600px]">
            <h3 className="text-lg font-semibold mb-4">Chat</h3>
            {renderChat()}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Polls</h3>
            {renderPolls()}
          </div>
        </div>
      )}
    </div>
  );
} 