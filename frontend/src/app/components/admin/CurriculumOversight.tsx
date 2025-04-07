"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  FileText,
  Video,
  Link,
  Check,
  X,
  MoreVertical
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  status: "draft" | "published" | "archived";
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "assignment";
  content: string;
  duration: number;
  order: number;
}

export default function CurriculumOversight() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/courses");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of courses");
      }
      
      setCourses(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load courses";
      toast.error(errorMessage);
      console.error("Error fetching courses:", error);
      setCourses([]); // Reset courses on error
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowAddCourseModal(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete course");
      
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Error deleting course:", error);
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: Course["status"]) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update course status");

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: newStatus } : course
      ));
      toast.success("Course status updated successfully");
    } catch (error) {
      toast.error("Failed to update course status");
      console.error("Error updating course status:", error);
    }
  };

  const getModuleIcon = (type: Module["type"]) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "text":
        return <FileText className="w-5 h-5" />;
      case "quiz":
        return <BookOpen className="w-5 h-5" />;
      case "assignment":
        return <Link className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const toggleDropdown = (courseId: string) => {
    setOpenDropdownId(openDropdownId === courseId ? null : courseId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Curriculum Management</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddCourseModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Course</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No courses found
          </div>
        ) : (
          filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {course.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    course.status === "published" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : course.status === "draft"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}>
                    {course.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="mr-4">Instructor: {course.instructor}</span>
                  <span>Modules: {course.modules.length}</span>
                </div>
                <div className="space-y-2">
                  {course.modules.slice(0, 3).map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      {getModuleIcon(module.type)}
                      <span className="ml-2">{module.title}</span>
                      <span className="ml-auto text-gray-400">
                        {module.duration} min
                      </span>
                    </div>
                  ))}
                  {course.modules.length > 3 && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      +{course.modules.length - 3} more modules
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => toggleDropdown(course.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openDropdownId === course.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleStatusChange(course.id, "published");
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            Publish
                          </button>
                          <button
                            onClick={() => {
                              handleStatusChange(course.id, "archived");
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X className="w-4 h-4 mr-2 text-red-500" />
                            Archive
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h3>
            {/* Add form fields here */}
          </motion.div>
        </div>
      )}
    </div>
  );
} 