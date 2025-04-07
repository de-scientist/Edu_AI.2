"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Share2, Bookmark, Send, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

const categories = [
  "all",
  "general",
  "programming",
  "data-science",
  "web-development",
  "machine-learning",
];

// Fallback data for when API is not available
const fallbackPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Machine Learning",
    content: "Machine learning is a subset of artificial intelligence that focuses on developing systems that can learn from and make decisions based on data. This post will guide you through the basics of machine learning and how to get started.",
    author: "AI Expert",
    likes: 24,
    comments: 8,
    timestamp: new Date().toISOString(),
    category: "machine-learning",
  },
  {
    id: "2",
    title: "Best Practices for Web Development",
    content: "Web development is constantly evolving with new frameworks and technologies. Here are some best practices to keep in mind when developing modern web applications.",
    author: "Web Developer",
    likes: 18,
    comments: 5,
    timestamp: new Date().toISOString(),
    category: "web-development",
  },
  {
    id: "3",
    title: "Understanding Data Science Fundamentals",
    content: "Data science combines statistics, programming, and domain expertise to extract meaningful insights from data. This post covers the fundamental concepts of data science.",
    author: "Data Scientist",
    likes: 32,
    comments: 12,
    timestamp: new Date().toISOString(),
    category: "data-science",
  },
  {
    id: "4",
    title: "Programming Tips for Beginners",
    content: "Starting your programming journey can be overwhelming. Here are some tips to help you get started and avoid common pitfalls.",
    author: "Senior Developer",
    likes: 15,
    comments: 7,
    timestamp: new Date().toISOString(),
    category: "programming",
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showCommentForm, setShowCommentForm] = useState<Record<string, boolean>>({});
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch posts from API with fallback to local data
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we're in development mode and use appropriate URL
        const apiUrl = process.env.NODE_ENV === "development" 
          ? "http://localhost:5000/eduai/posts" 
          : "/eduai/posts";
        
        console.log("Fetching posts from:", apiUrl);
        
        // Make the API request
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Check if response is ok
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Server responded with status: ${response.status}`);
        }
        
        // Parse the response
        const data = await response.json();
        console.log("Posts fetched successfully:", data.length);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message || "Failed to fetch posts from server. Using fallback data.");
        // Use fallback data when API fails
        setPosts(fallbackPosts);
        toast.error(error.message || "Using fallback data - API connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  const handleCreatePost = async () => {
    try {
      if (!newPost.title.trim() || !newPost.content.trim()) {
        toast.error("Title and content are required");
        return;
      }

      const apiUrl = process.env.NODE_ENV === "development" 
        ? "http://localhost:5000/eduai/posts" 
        : "/eduai/posts";

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          authorName: "Anonymous User"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();
      setPosts(prevPosts => [createdPost, ...prevPosts]);
      setNewPost({
        title: "",
        content: "",
        category: "general"
      });
      setShowCreatePostForm(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  // Fixed handleLikePost function
  const handleLikePost = async (postId: string) => {
    try {
      const apiUrl = process.env.NODE_ENV === "development" 
          ? `http://localhost:5000/eduai/posts/${postId}/like` 
          : `/eduai/posts/${postId}/like`;

      console.log("Liking post:", postId, "at URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorName: "Anonymous User"
        })
      });

      // First check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error details, but don't throw if JSON parsing fails
        let errorMessage = `Failed to like post: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        console.error("Error response:", errorMessage);
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      const data = await response.json();
      console.log("Like response:", data);
      
      // Update the posts array with the new like count
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, likes: data.likes } : post
        )
      );
      
      toast.success('Post liked successfully!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to like post');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const apiUrl = process.env.NODE_ENV === "development" 
        ? `http://localhost:5000/eduai/posts/${postId}/comments` 
        : `/eduai/posts/${postId}/comments`;

      console.log("Fetching comments for post:", postId, "at URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // First check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error details, but don't throw if JSON parsing fails
        let errorMessage = `Failed to fetch comments: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        console.error("Error response:", errorMessage);
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      const comments = await response.json();
      console.log("Comments fetched successfully:", comments);
      
      setPostComments(prev => ({
        ...prev,
        [postId]: comments
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch comments');
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Fetch comments if they haven't been loaded yet
    if (!postComments[postId]) {
      fetchComments(postId);
    }
  };

  // Fixed handleAddComment function
  const handleAddComment = async (postId: string, content: string) => {
    try {
      if (!content.trim()) {
        toast.error('Comment cannot be empty');
        return;
      }

      const apiUrl = process.env.NODE_ENV === "development" 
          ? `http://localhost:5000/eduai/posts/${postId}/comments` 
          : `/eduai/posts/${postId}/comments`;

      console.log("Adding comment to post:", postId, "at URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          authorName: "Anonymous User"
        })
      });

      // First check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error details, but don't throw if JSON parsing fails
        let errorMessage = `Failed to add comment: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        console.error("Error response:", errorMessage);
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      const newComment = await response.json();
      console.log("Comment added successfully:", newComment);
      
      // Update the comments count in the posts array
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );
      
      // Add the new comment to the postComments state
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      
      // Clear the comment input
      setCommentText({ ...commentText, [postId]: '' });
      
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
    }
  };

  const toggleCommentForm = (postId: string) => {
    setShowCommentForm(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Discussions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Join the conversation and share your knowledge
          </p>
          
          <button
            onClick={() => setShowCreatePostForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Post
          </button>
        </motion.div>

        {/* Create Post Form */}
        {showCreatePostForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Post
              </h2>
              <button
                onClick={() => setShowCreatePostForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write your post content here..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCreatePostForm(false)}
                  className="px-4 py-2 mr-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posted by {post.author} • {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {post.category}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <ThumbsUp className="h-5 w-5 mr-1" />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <MessageSquare className="h-5 w-5 mr-1" />
                    <span>{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Share2 className="h-5 w-5 mr-1" />
                  </button>
                  
                  <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <Bookmark className="h-5 w-5 mr-1" />
                  </button>
                </div>
                
                <button
                  onClick={() => toggleCommentForm(post.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {showCommentForm[post.id] ? 'Cancel' : 'Comment'}
                </button>
              </div>
              
              {showCommentForm[post.id] && (
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id, commentText[post.id] || '')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {showComments[post.id] && (
                <div className="mt-6 space-y-4">
                  {postComments[post.id]?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 