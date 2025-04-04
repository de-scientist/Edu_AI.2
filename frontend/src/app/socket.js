/*
import { io } from "socket.io-client";

// Function to get the latest token
const getToken = () => {
    try {
        return (
            sessionStorage.getItem("accessToken") ||
            localStorage.getItem("accessToken") ||
            decodeURIComponent(
                document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("accessToken="))
                    ?.split("=")[1] || ""
            ) ||
            null
        );
    } catch (error) {
        console.error("⚠️ Error retrieving token:", error);
        return null;
    }
};

// Initialize WebSocket connection (without auto-connecting)
const socket = io("http://localhost:5000/ws", {
    transports: ["websocket"],
    autoConnect: false, // ⛔ Prevent premature connection
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

// Function to connect WebSocket only after authentication
const connectSocket = () => {
    const token = getToken();

    if (token) {
        console.log("🔄 Connecting WebSocket with token:", token); // ✅ Debugging aid
        socket.io.opts.extraHeaders = {
            "sec-websocket-protocol": token, // ✅ Attach token to headers
        };
        socket.connect();
    } else {
        console.warn("❌ No token available. WebSocket will not connect.");
        socket.disconnect();
    }
};

// Function to be called after login
const handleLoginSuccess = () => {
    console.log("✅ Login successful, storing token...");
    setTimeout(() => {
        connectSocket(); // 🕒 Ensure token is stored before connecting
    }, 500); // Small delay to avoid race conditions
};

// Listen for token updates & reconnect WebSocket when necessary
const watchTokenChanges = () => {
    let lastToken = getToken();

    // Storage event listener (handles session/localStorage updates)
    window.addEventListener("storage", (event) => {
        if (event.key === "accessToken") {
            const newToken = getToken();
            if (newToken !== lastToken) {
                console.log("🔄 Token updated via storage. Reconnecting WebSocket...");
                lastToken = newToken;
                connectSocket();
            }
        }
    });

    // MutationObserver for DOM changes (if token is updated in cookies)
    const observer = new MutationObserver(() => {
        const newToken = getToken();
        if (newToken !== lastToken) {
            console.log("🔄 Token change detected via MutationObserver. Reconnecting...");
            lastToken = newToken;
            connectSocket();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return observer;
};

// Handle successful WebSocket connection
socket.on("connect", () => {
    console.log("✅ WebSocket connected successfully.");
    socket.emit("userOnline"); // Notify server that user is online
});

// Handle connection errors (401 Unauthorized, etc.)
socket.on("connect_error", (err) => {
    console.error("❌ WebSocket Connection Error:", err.message);
    if (err.message.includes("Unauthorized")) {
        console.warn("🔒 Token is invalid or missing. Attempting re-auth...");
        // Don't force logout immediately—give the user a chance to re-auth
    }
});

// Send progress update (for students)
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

// Listen for admin live progress updates
socket.on("progress_broadcast", (data) => {
    console.log("📡 Live Progress Update:", data);
});

// Disconnect WebSocket and clear tokens
const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log("❌ WebSocket disconnected.");
    }
};

// Start watching for token changes
const tokenObserver = watchTokenChanges();

// Cleanup before the page unloads
window.addEventListener("beforeunload", () => {
    tokenObserver.disconnect();
    console.log("🧹 Stopped watching for token changes.");
});

export { handleLoginSuccess, connectSocket, updateProgress, socket, disconnectSocket };
*/