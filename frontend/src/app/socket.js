import { io } from "socket.io-client";

// Function to get the latest token
const getToken = () => {
    return sessionStorage.getItem("accessToken") || 
           localStorage.getItem("accessToken") || 
           decodeURIComponent(document.cookie.split("; ").find(row => row.startsWith("accessToken="))?.split("=")[1] || "") || 
           null;
};

// Initialize socket without connecting yet
const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    autoConnect: false, // Don't connect automatically
});

// Function to connect WebSocket only after authentication
const connectSocket = () => {
    const token = getToken();
    
    if (token) {
        console.log("🔄 Connecting WebSocket with new token...");
        socket.auth = { token };  // Attach token dynamically
        socket.connect();
    } else {
        console.warn("❌ No token available. WebSocket will not connect.");
        socket.disconnect();  // Ensure it stays disconnected if no token
    }
};

// Listen for token updates and reconnect if needed
const watchTokenChanges = () => {
    // Listen for localStorage/sessionStorage changes
    window.addEventListener("storage", (event) => {
        if (event.key === "accessToken") {
            console.log("🔄 Token updated. Reconnecting WebSocket...");
            connectSocket();
        }
    });

    // Use MutationObserver to watch for DOM changes (useful if token is added directly to DOM)
    const observer = new MutationObserver(() => {
        console.log("🔄 Detected token change. Reconnecting WebSocket...");
        connectSocket();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return observer;
};

// Handle successful connection
socket.on("connect", () => {
    console.log("✅ WebSocket connected successfully.");
    socket.emit("userOnline"); // Inform the server the user is online
});

// Handle connection errors
socket.on("connect_error", (err) => {
    console.error("❌ WebSocket Connection Error:", err.message);
    if (err.message.includes("Unauthorized")) {
        console.warn("🔒 Invalid or expired token. Please log in again.");
    }
});

// Function for students to send progress updates
const updateProgress = (userId, courseId, progress) => {
    if (socket.connected) {
        socket.emit("progress_update", { userId, courseId, progress }, (response) => {
            if (response?.error) {
                console.error("❌ Failed to send progress update:", response.error);
            } else {
                console.log("✅ Progress update sent successfully!");
            }
        });
    } else {
        console.warn("❌ WebSocket is not connected.");
    }
};

// Admin listens for live updates
socket.on("progress_broadcast", (data) => {
    console.log("📡 Live Progress Update:", data);
});

// Handle socket disconnection
const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log("❌ WebSocket disconnected.");
    }

    // Clear stored tokens
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

// Start watching for token changes
const tokenObserver = watchTokenChanges();

// Clean up before the page unloads
window.addEventListener("beforeunload", () => {
    tokenObserver.disconnect();
    console.log("🧹 Stopped watching for token changes.");
});

// Ensure the WebSocket only connects when needed
connectSocket();

export { connectSocket, updateProgress, socket, disconnectSocket };
