// This is a fixed version of the handleLikePost function
// Copy this function and replace the existing one in page.tsx

export const handleLikePost = async (
  postId: string,
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  toast: any
) => {
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

    // Handle non-OK responses without trying to parse JSON first
    if (!response.ok) {
      console.error(`Server responded with status: ${response.status}`);
      throw new Error(`Failed to like post: ${response.status}`);
    }

    // Only try to parse JSON if response is ok
    let data;
    try {
      data = await response.json();
      console.log("Like response:", data);
    } catch (parseError) {
      console.error("Error parsing response JSON:", parseError);
      throw new Error("Invalid response format from server");
    }
    
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