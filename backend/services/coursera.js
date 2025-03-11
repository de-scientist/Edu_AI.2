import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const COURSERA_API_URL = "https://api.coursera.org/api/courses.v1";

export const fetchAndStoreCourseraCourses = async () => {
  try {
    const response = await axios.get(COURSERA_API_URL);
    const courses = response.data.elements;

    for (let course of courses) {
      await prisma.course.upsert({
        where: { url: `https://www.coursera.org/learn/${course.id}` },
        update: {},
        create: {
          title: course.name,
          description: course.description || "No description available",
          platform: "Coursera",
          url: `https://www.coursera.org/learn/${course.id}`,
        },
      });
    }
    
    return { message: "Coursera courses saved successfully!" };
  } catch (error) {
    console.error("Error fetching Coursera courses:", error);
    throw error;
  }
};
