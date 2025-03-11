import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const YOUR_UDEMY_API_KEY = process.env.UDEMY_API_KEY;

export const fetchUdemyCourses = async () => {
  try {
    const response = await axios.get(UDEMY_API_URL, {
      headers: { Authorization: "Bearer YOUR_UDEMY_API_KEY" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Udemy courses:", error);
    throw error;
  }
};
