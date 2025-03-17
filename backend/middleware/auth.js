export async function myPreHandler(req, reply) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Dummy verification function
        if (token !== "valid_token") {
            return reply.status(401).send({ error: 'Unauthorized: Invalid token' });
        }

        req.user = { id: 1, username: "JohnDoe" }; // Attach user data
    } catch (error) {
        reply.status(500).send({ error: 'Internal Server Error' });
    }
}
