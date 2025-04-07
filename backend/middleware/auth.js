import jwt from "jsonwebtoken";

export const authenticate = async function(req, reply) {
    try {
        const routePath = req.url;  // Ensure correct route handling

        // ✅ Skip authentication for signup & login routes
        if (routePath.includes("/signup") || routePath.includes("/login")) {
            return;
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.status(401).send({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // 🔹 Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return reply.status(401).send({ error: "Unauthorized: Invalid token" });
        }

        // 🔹 Attach user details from the token to request object
        req.user = decoded;

        return; // Proceed with the request
    } catch (error) {
        console.error("Auth Error:", error.message);

        if (error.name === "JsonWebTokenError") {
            return reply.status(401).send({ error: "Unauthorized: Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return reply.status(401).send({ error: "Unauthorized: Token expired" });
        }

        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
