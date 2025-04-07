// This file contains fixed versions of the handleLikePost and handleAddComment functions
// Copy these functions and replace the existing ones in page.tsx

// Fixed handleLikePost function
export const handleLikePost = async (postId: string, setPosts: any, toast: any) => {
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

// Fixed handleAddComment function
export const handleAddComment = async (
  postId: string, 
  content: string, 
  setPosts: any, 
  setPostComments: any, 
  setCommentText: any, 
  commentText: any, 
  toast: any
) => {
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