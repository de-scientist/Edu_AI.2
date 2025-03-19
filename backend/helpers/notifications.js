export function sendNotification(fastify, type, message) {
    fastify.io.emit("receive_notification", { type, message });
  }
  