"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Search, Book, Video, FileText, Award, Filter } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "book" | "course";
  url: string;
  category: string;
  thumbnail?: string;
}

export default function ResourcesPage() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const categories = [
    { id: "all", name: "All Resources", icon: Filter },
    { id: "video", name: "Videos", icon: Video },
    { id: "article", name: "Articles", icon: FileText },
    { id: "book", name: "Books", icon: Book },
    { id: "course", name: "Courses", icon: Award },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch general resources
        const response = await fetch("http://localhost:5000/eduai/resources", {
          headers: {
            "Content-Type": "application/json",
            ...(session?.user?.accessToken && {
              Authorization: `Bearer ${session.user.accessToken}`,
            }),
          },
          credentials: "include",
        });

        if (!response.ok) {
          console.warn(`API error: ${response.status}`);
          // Don't throw error, just set empty resources
          setResources([]);
          setFilteredResources([]);
          return;
        }

        const data = await response.json();
        setResources(data.resources || []);
        setFilteredResources(data.resources || []);

        // If user is logged in, fetch personalized recommendations
        if (session?.user) {
          try {
            const recommendationsResponse = await fetch(
              "http://localhost:5000/eduai/recommend-study",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.user.accessToken}`,
                },
                body: JSON.stringify({ id: session.user.id }),
              }
            );

            if (recommendationsResponse.ok) {
              const recommendationsData = await recommendationsResponse.json();
              // Add recommendations to resources
              setResources((prev) => [...prev, ...(recommendationsData.recommendations || [])]);
              setFilteredResources((prev) => [...prev, ...(recommendationsData.recommendations || [])]);
            }
          } catch (recError) {
            console.warn("Error fetching recommendations:", recError);
            // Don't throw, just continue without recommendations
          }
        }
      } catch (err) {
        console.warn("Error fetching resources:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch resources");
        // Set empty resources instead of throwing
        setResources([]);
        setFilteredResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchResources();
    }
  }, [session, mounted]);

  useEffect(() => {
    // Filter resources based on search query and category
    const filtered = resources.filter((resource) => {
      const matchesSearch = resource.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || resource.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredResources(filtered);
  }, [searchQuery, selectedCategory, resources]);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" suppressHydrationWarning>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
          suppressHydrationWarning
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" suppressHydrationWarning>
            Educational Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300" suppressHydrationWarning>
            Discover and learn from our curated collection of educational materials
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
          suppressHydrationWarning
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between" suppressHydrationWarning>
            <div className="relative w-full md:w-96" suppressHydrationWarning>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto" suppressHydrationWarning>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64" suppressHydrationWarning>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" suppressHydrationWarning></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500" suppressHydrationWarning>{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            suppressHydrationWarning
          >
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                suppressHydrationWarning
              >
                {resource.thumbnail && (
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {resource.type === "video" && <Video className="w-5 h-5 text-blue-500" />}
                    {resource.type === "article" && <FileText className="w-5 h-5 text-green-500" />}
                    {resource.type === "book" && <Book className="w-5 h-5 text-purple-500" />}
                    {resource.type === "course" && <Award className="w-5 h-5 text-yellow-500" />}
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {resource.description}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    Learn More
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 