import request from "supertest";
import fastify from "../server.js";

describe("API Tests", () => {
  it("should register a user", async () => {
    try {
      const res = await request(fastify.server)
        .post("/api/signup")
        .set("Content-Type", "application/json") 
        .send({ name: "Jane Doe", email: "jane@example.com", password: "test123", role: "student" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
    } catch (error) {
      console.error("Signup test failed:", error);
      throw error; // Ensures Jest registers it as a failed test
    }
  });

  it("should login a user", async () => {
    try {
      const res = await request(fastify.server)
        .post("/login")
        .set("Content-Type", "application/json") 
        .send({ email: "jane@example.com", password: "test123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    } catch (error) {
      console.error("Login test failed:", error);
      throw error;
    }
  });
});
