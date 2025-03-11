import { io } from "socket.io-client";

const socket = io("http://localhost:5000");  // Connect to Fastify WebSocket Server

//Student Sends Progress Updates
function updateProgress( userId, courseId, progress) {
    socket.emit("progress_update", { userId, courseId, progress});
}

//Admin Sees Live Progress Updates
socket.io("progress_broadcast", (data) => {
    console.log(" 📡 Live Progress Update:", data);
});

export default socket;
