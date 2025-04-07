"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Users, BookOpen, Brain, Award, Clock } from "lucide-react";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: "AI-Powered Learning",
      description: "Our platform uses advanced AI algorithms to personalize your learning experience and adapt to your progress.",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Community Engagement",
      description: "Connect with fellow learners, share knowledge, and participate in discussions to enhance your learning journey.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      title: "Comprehensive Resources",
      description: "Access a wide range of educational materials, from interactive tutorials to in-depth articles and videos.",
    },
    {
      icon: <Award className="h-6 w-6 text-blue-500" />,
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics and receive personalized recommendations for improvement.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Flexible Learning",
      description: "Learn at your own pace with our flexible platform that adapts to your schedule and learning preferences.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
      title: "Quality Education",
      description: "Our content is curated by experts to ensure you receive high-quality education that meets industry standards.",
    },
  ];

  const teamMembers = [
    {
      name: "Mark Kinyanjui",
      role: "Lead Developer & AI Architect",
      bio: "Passionate about leveraging AI to transform education and make learning more accessible and effective for everyone.",
      image: "/images/team/mark.jpg",
    },
    {
      name: "Sarah Johnson",
      role: "Educational Content Specialist",
      bio: "Experienced educator with a background in curriculum development and a passion for creating engaging learning experiences.",
      image: "/images/team/sarah.jpg",
    },
    {
      name: "David Chen",
      role: "Machine Learning Engineer",
      bio: "Specializes in developing AI models that can understand and adapt to individual learning patterns and preferences.",
      image: "/images/team/david.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
          suppressHydrationWarning
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" suppressHydrationWarning>
            About Edu_AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" suppressHydrationWarning>
            We're on a mission to revolutionize education through artificial intelligence, making learning more personalized, engaging, and effective for everyone.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-16"
          suppressHydrationWarning
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4" suppressHydrationWarning>
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4" suppressHydrationWarning>
            At Edu_AI, we believe that education should be accessible, personalized, and effective for everyone. Our platform leverages cutting-edge artificial intelligence to create a learning experience that adapts to each individual's needs, strengths, and learning style.
          </p>
          <p className="text-gray-600 dark:text-gray-300" suppressHydrationWarning>
            By combining advanced AI algorithms with educational expertise, we're creating a future where learning is not just a one-size-fits-all approach, but a tailored journey that helps each person reach their full potential.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
          suppressHydrationWarning
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center" suppressHydrationWarning>
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" suppressHydrationWarning>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                suppressHydrationWarning
              >
                <div className="mb-4" suppressHydrationWarning>{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2" suppressHydrationWarning>
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300" suppressHydrationWarning>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
          suppressHydrationWarning
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center" suppressHydrationWarning>
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" suppressHydrationWarning>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                suppressHydrationWarning
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative" suppressHydrationWarning>
                  {/* Placeholder for team member image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500" suppressHydrationWarning>
                    <Users className="h-16 w-16" />
                  </div>
                </div>
                <div className="p-6" suppressHydrationWarning>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1" suppressHydrationWarning>
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-3" suppressHydrationWarning>
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300" suppressHydrationWarning>
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
          suppressHydrationWarning
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4" suppressHydrationWarning>
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6" suppressHydrationWarning>
            Have questions or want to learn more about Edu_AI? We'd love to hear from you!
          </p>
          <a
            href="mailto:gitaumark502@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            suppressHydrationWarning
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
} 