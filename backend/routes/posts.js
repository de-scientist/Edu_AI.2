import prisma from "../prisma/db.js";

export default async function postsRoutes(fastify, options) {
  // Get all posts
  fastify.get("/eduai/posts", async (request, reply) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author.name,
        likes: post._count.likes,
        comments: post._count.comments,
        timestamp: post.createdAt,
        category: post.category,
      }));

      return reply.send(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return reply.status(500).send({ error: "Failed to fetch posts" });
    }
  });

  // Create a new post
  fastify.post("/eduai/posts", async (request, reply) => {
    try {
      const { title, content, category, authorName = "Anonymous User" } = request.body;

      // Create or get anonymous user
      let author = await prisma.user.findFirst({
        where: { name: authorName }
      });

      if (!author) {
        author = await prisma.user.create({
          data: {
            name: authorName,
            email: `${authorName.toLowerCase().replace(/\s+/g, '.')}@anonymous.com`,
            password: "anonymous",
            role: "USER"
          }
        });
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          category,
          authorId: author.id,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      return reply.status(201).send({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author.name,
        likes: 0,
        comments: 0,
        timestamp: post.createdAt,
        category: post.category,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return reply.status(500).send({ error: "Failed to create post" });
    }
  });

  // Like a post
  fastify.post("/eduai/posts/:id/like", async (request, reply) => {
    try {
      const postId = request.params.id;
      const { authorName = "Anonymous User" } = request.body;

      // Create or get anonymous user
      let user = await prisma.user.findFirst({
        where: { name: authorName }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: authorName,
            email: `${authorName.toLowerCase().replace(/\s+/g, '.')}@anonymous.com`,
            password: "anonymous",
            role: "USER"
          }
        });
      }

      const existingLike = await prisma.like.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        await prisma.like.create({
          data: {
            postId,
            userId: user.id,
          },
        });
      }

      const likeCount = await prisma.like.count({
        where: {
          postId,
        },
      });

      return reply.send({ likes: likeCount });
    } catch (error) {
      console.error("Error toggling like:", error);
      return reply.status(500).send({ error: "Failed to toggle like" });
    }
  });

  // Add a comment to a post
  fastify.post("/eduai/posts/:id/comments", async (request, reply) => {
    try {
      const postId = request.params.id;
      const { content, authorName = "Anonymous User" } = request.body;

      // Create or get anonymous user
      let user = await prisma.user.findFirst({
        where: { name: authorName }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: authorName,
            email: `${authorName.toLowerCase().replace(/\s+/g, '.')}@anonymous.com`,
            password: "anonymous",
            role: "USER"
          }
        });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          userId: user.id,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      return reply.status(201).send({
        id: comment.id,
        content: comment.content,
        author: comment.author.name,
        timestamp: comment.createdAt,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      return reply.status(500).send({ error: "Failed to create comment" });
    }
  });

  // Get comments for a post
  fastify.get("/eduai/posts/:id/comments", async (request, reply) => {
    try {
      const postId = request.params.id;

      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedComments = comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author: comment.author.name,
        timestamp: comment.createdAt,
      }));

      return reply.send(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return reply.status(500).send({ error: "Failed to fetch comments" });
    }
  });
} 