import request from "supertest";
import Fastify from "fastify";
import app from "../server.js";

const fastify = Fastify();
fastify.register(app);

describe("Course API Tests", () => {
    let courseId;

    // 🚀 Test Create Course
    test("Create a course", async () => {
        const response = await request(fastify.server)
            .post("/api/courses")
            .send({
                title: "Test Course",
                description: "This is a test course.",
                instructorId: "instructor-123",
                duration: "4 weeks",
                category: "Programming"
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        courseId = response.body.id;
    });

    // 📜 Test Fetch All Courses
    test("Fetch all courses", async () => {
        const response = await request(fastify.server).get("/api/courses");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // 🔍 Test Fetch Single Course
    test("Fetch a single course", async () => {
        const response = await request(fastify.server).get(`/api/courses/${courseId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", courseId);
    });

    // ✏️ Test Update Course
    test("Update a course", async () => {
        const response = await request(fastify.server)
            .put(`/api/courses/${courseId}`)
            .send({
                title: "Updated Course",
                description: "Updated description.",
                duration: "6 weeks"
            });
        
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Course");
    });

    // ❌ Test Delete Course
    test("Delete a course", async () => {
        const response = await request(fastify.server).delete(`/api/courses/${courseId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Course deleted successfully" });
    });
});
