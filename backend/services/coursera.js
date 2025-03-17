import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const COURSERA_API_URL = "https://api.coursera.org/api/courses.v1";

export const fetchAndStoreCourseraCourses = async () => {
  try {
    console.log("Fetching Coursera courses...");

    const response = await axios.get(COURSERA_API_URL);
    const courses = response.data.elements || [];

    console.log(`Received ${courses.length} courses from Coursera.`);

    for (let course of courses) {
      const courseTitle = course.title || "Untitled Course";
      const courseDescription = course.description || "No description available";
      const courseUrl = `https://www.coursera.org/learn/${course.slug || course.id}`;

      await prisma.course.upsert({
        where: { url: courseUrl },
        update: {},
        create: {
          title: courseTitle,
          description: courseDescription,
          platform: "Coursera",
          url: courseUrl,
        },
      });
    }

    console.log("Coursera courses saved successfully!");
    return { message: "Coursera courses saved successfully!" };

  } catch (error) {
    console.error("Error fetching Coursera courses:", error.message);
    throw error;
  }
};
