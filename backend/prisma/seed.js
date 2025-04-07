import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

const sampleUsers = [
  {
    email: "admin@eduai.com",
    password: bcrypt.hashSync("admin123", 10),
    name: "Admin User",
    role: "ADMIN",
  },
  {
    email: "lecturer@eduai.com",
    password: bcrypt.hashSync("lecturer123", 10),
    name: "Sample Lecturer",
    role: "LECTURER",
  },
  {
    email: "student@eduai.com",
    password: bcrypt.hashSync("student123", 10),
    name: "Sample Student",
    role: "STUDENT",
  },
];

const sampleCourses = [
  {
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning algorithms and applications",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/machine-learning",
    instructor: "Dr. Andrew Ng",
    duration: "12 weeks",
    level: "Intermediate",
    category: "machine-learning",
    thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    title: "Advanced React Development",
    description: "Master advanced React concepts and best practices",
    platform: "Udemy",
    url: "https://www.udemy.com/course/react-advanced",
    instructor: "John Doe",
    duration: "8 weeks",
    level: "Advanced",
    category: "web-development",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    title: "Data Science Fundamentals",
    description: "Learn the basics of data science and analytics",
    platform: "EduAI",
    url: "https://www.coursera.org/specializations/data-science",
    instructor: "Jane Smith",
    duration: "10 weeks",
    level: "Beginner",
    category: "data-science",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  }
];

const resources = [
  {
    title: "Introduction to Machine Learning",
    description: "A comprehensive introduction to machine learning concepts and algorithms",
    type: "course",
    url: "https://www.coursera.org/learn/machine-learning",
    category: "AI & Machine Learning",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
  },
  {
    title: "Deep Learning Specialization",
    description: "Master the fundamentals of deep learning and neural networks",
    type: "course",
    url: "https://www.coursera.org/specializations/deep-learning",
    category: "AI & Machine Learning",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
  },
  {
    title: "The Python Programming Language",
    description: "Learn Python programming from basics to advanced concepts",
    type: "book",
    url: "https://www.python.org/about/gettingstarted/",
    category: "Programming",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript for web development",
    type: "video",
    url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9g5_pnV1l8Ee1VQ5QZqQz5Y",
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  },
  {
    title: "Data Structures and Algorithms",
    description: "Learn essential data structures and algorithms concepts",
    type: "article",
    url: "https://www.geeksforgeeks.org/data-structures/",
    category: "Programming",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    description: "The definitive textbook on artificial intelligence",
    type: "book",
    url: "https://aima.cs.berkeley.edu/",
    category: "AI & Machine Learning",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
  },
  {
    title: "React.js Crash Course",
    description: "Learn React.js from scratch with hands-on projects",
    type: "video",
    url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    title: "Database Design Principles",
    description: "Learn the fundamentals of database design and management",
    type: "article",
    url: "https://www.sqlshack.com/database-design-best-practices/",
    category: "Databases",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1021&q=80",
  }
];

const aiSettings = {
  modelVersion: "gpt-4",
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: "You are a helpful AI assistant."
};

const modelParameters = [
  {
    name: "Learning Rate",
    value: 0.001,
    min: 0.0001,
    max: 0.01,
    description: "Controls how quickly the model adapts to new data",
    modelType: "recommendation"
  },
  {
    name: "Batch Size",
    value: 32,
    min: 8,
    max: 128,
    description: "Number of samples processed before model update",
    modelType: "recommendation"
  },
  {
    name: "Training Epochs",
    value: 10,
    min: 1,
    max: 50,
    description: "Number of complete passes through the training dataset",
    modelType: "recommendation"
  },
  {
    name: "Dropout Rate",
    value: 0.2,
    min: 0.1,
    max: 0.5,
    description: "Prevents overfitting by randomly dropping neurons",
    modelType: "recommendation"
  },
  {
    name: "Learning Rate",
    value: 0.0005,
    min: 0.0001,
    max: 0.01,
    description: "Controls how quickly the model adapts to new data",
    modelType: "assessment"
  },
  {
    name: "Batch Size",
    value: 64,
    min: 16,
    max: 256,
    description: "Number of samples processed before model update",
    modelType: "assessment"
  },
  {
    name: "Training Epochs",
    value: 15,
    min: 1,
    max: 50,
    description: "Number of complete passes through the training dataset",
    modelType: "assessment"
  },
  {
    name: "Dropout Rate",
    value: 0.3,
    min: 0.1,
    max: 0.5,
    description: "Prevents overfitting by randomly dropping neurons",
    modelType: "assessment"
  }
];

const aiMetrics = Array.from({ length: 30 }, (_, i) => ({
  accuracy: 85 + Math.random() * 10,
  responseTime: 100 + Math.random() * 200,
  errorRate: Math.random() * 5,
  usageCount: 100 + Math.random() * 900,
  timestamp: new Date(Date.now() - (29 - i) * 3600000).toISOString()
}));

async function main() {
  console.log("🌱 Starting seeding...");

  // Delete all existing data in the correct order to handle foreign key constraints
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.interaction.deleteMany({});
  await prisma.loginHistory.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("🗑️ Deleted existing data");

  // Create users
  const users = [];
  for (const user of sampleUsers) {
    const result = await prisma.user.create({
      data: user,
    });
    users.push(result);
    console.log(`Created user: ${result.email}`);
  }

  // Create sample courses
  for (const course of sampleCourses) {
    const result = await prisma.course.create({
      data: course,
    });
    console.log(`Created course: ${result.title}`);
  }

  // Create sample resources
  for (const resource of resources) {
    const result = await prisma.resource.create({
      data: resource,
    });
    console.log(`Created resource: ${result.title}`);
  }

  // Create sample posts
  const posts = [
    {
      title: "Getting Started with Machine Learning",
      content: "Here's a comprehensive guide to getting started with machine learning...",
      category: "machine-learning",
      authorId: users[0].id,
    },
    {
      title: "Best Practices for React Development",
      content: "Let's discuss some best practices for React development...",
      category: "web-development",
      authorId: users[1].id,
    },
    {
      title: "Understanding Neural Networks",
      content: "A deep dive into the fundamentals of neural networks...",
      category: "artificial-intelligence",
      authorId: users[0].id,
    },
  ];

  for (const post of posts) {
    const result = await prisma.post.create({
      data: post,
    });
    console.log(`Created post: ${result.title}`);
  }

  // Create sample progress entries
  const progressEntries = [
    {
      userId: users[2].id, // student
      courseId: "1", // You'll need to create courses first
      progress: 75,
    },
    {
      userId: users[2].id,
      courseId: "2",
      progress: 100,
    },
  ];

  for (const progress of progressEntries) {
    const result = await prisma.progress.create({
      data: progress,
    });
    console.log(`Created progress entry for user ${progress.userId}`);
  }

  // Create AI settings
  await prisma.aISettings.create({
    data: aiSettings
  });

  // Create model parameters
  for (const param of modelParameters) {
    await prisma.modelParameter.create({
      data: param
    });
  }

  // Create AI metrics
  for (const metric of aiMetrics) {
    await prisma.aIMetrics.create({
      data: metric
    });
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 