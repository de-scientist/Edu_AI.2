"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Clock,
  User,
  MoreVertical,
  Check,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Feedback {
  id: string;
  type: "suggestion" | "bug" | "feature" | "general";
  status: "pending" | "in_review" | "implemented" | "declined";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  votes: {
    up: number;
    down: number;
  };
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackAggregation() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/feedback");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate the data structure
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array");
      }
      
      // Validate each feedback item has required fields
      const requiredFields = ['id', 'type', 'status', 'priority', 'title', 'description', 'user', 'votes', 'comments', 'createdAt', 'updatedAt'];
      data.forEach((item, index) => {
        requiredFields.forEach(field => {
          if (!(field in item)) {
            throw new Error(`Invalid feedback at index ${index}: missing ${field}`);
          }
        });
        
        // Validate user object
        if (!item.user || typeof item.user !== 'object') {
          throw new Error(`Invalid feedback at index ${index}: invalid user object`);
        }
        
        // Validate votes object
        if (!item.votes || typeof item.votes !== 'object') {
          throw new Error(`Invalid feedback at index ${index}: invalid votes object`);
        }
      });
      
      setFeedback(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load feedback";
      toast.error(errorMessage);
      console.error("Error fetching feedback:", error);
      setFeedback([]); // Reset feedback on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  const handlePriorityFilter = (priority: string) => {
    setSelectedPriority(priority);
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const handleStatusChange = async (feedbackId: string, newStatus: Feedback["status"]) => {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update feedback status");

      setFeedback(feedback.map(item => 
        item.id === feedbackId ? { ...item, status: newStatus } : item
      ));
      toast.success("Feedback status updated successfully");
    } catch (error) {
      toast.error("Failed to update feedback status");
      console.error("Error updating feedback status:", error);
    }
  };

  const getPriorityColor = (priority: Feedback["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: Feedback["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "in_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "implemented":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "declined":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: Feedback["type"]) => {
    switch (type) {
      case "suggestion":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "bug":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "feature":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "general":
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Feedback & Suggestions</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredFeedback.length} items
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="implemented">Implemented</option>
          <option value="declined">Declined</option>
        </select>
        <select
          value={selectedType}
          onChange={(e) => handleTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="suggestion">Suggestion</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="general">General Feedback</option>
        </select>
        <select
          value={selectedPriority}
          onChange={(e) => handlePriorityFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading feedback...
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No feedback found
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4 mr-1" />
                        {item.user.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {item.comments} comments
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace("_", " ")}
                  </span>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.votes.up}</span>
                    <ThumbsDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.votes.down}</span>
                  </div>
                  <button
                    onClick={() => setSelectedFeedback(item)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Feedback Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Feedback Details
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h4>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedFeedback.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedFeedback.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">User</h4>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedFeedback.user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedFeedback.user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</h4>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    handleStatusChange(selectedFeedback.id, "declined");
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedFeedback.id, "implemented");
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Mark as Implemented
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 