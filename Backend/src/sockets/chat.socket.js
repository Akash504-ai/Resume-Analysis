import messageModel from "../models/message.model.js";

const setupChatSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* User joins community channel */
    socket.on("join-community", async () => {
      socket.join("community");

      try {
        // load last 50 messages
        const messages = await messageModel
          .find({ channel: "community" })
          .sort({ createdAt: -1 })
          .limit(50);

        // send chat history to the user
        socket.emit("chat-history", messages.reverse());

      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    });

    /* When user sends message */
    socket.on("send-message", async (data) => {
      try {

        const { userId, username, message } = data;

        // save message in DB
        const newMessage = await messageModel.create({
          user: userId,
          username: username,
          message: message,
          channel: "community"
        });

        // broadcast message to everyone
        io.to("community").emit("receive-message", newMessage);

      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};

export default setupChatSocket;