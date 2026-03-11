import messageModel from "../models/message.model.js";

const setupChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* User joins community channel */
    socket.on("join-community", async ({ userId }) => {
      socket.join("community");

      try {
        // load last 50 messages (excluding deleted for this user)
        const messages = await messageModel
          .find({
            channel: "community",
            deletedFor: { $nin: userId },
          })
          .sort({ createdAt: -1 })
          .limit(50);

        socket.emit("chat-history", messages.reverse());
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    });

    /* When user sends message */
    socket.on("send-message", async (data) => {
      try {
        const { userId, username, message, replyTo } = data;

        const newMessage = await messageModel.create({
          user: userId,
          username,
          message,
          replyTo: replyTo
            ? {
                _id: replyTo._id,
                username: replyTo.username,
                message: replyTo.message,
              }
            : null,
          channel: "community",
        });

        io.to("community").emit("receive-message", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    /* Delete message only for the current user */
    socket.on("delete-for-me", async ({ messageId, userId }) => {
      try {
        await messageModel.findByIdAndUpdate(messageId, {
          $addToSet: { deletedFor: userId },
        });

        socket.emit("message-deleted-for-me", { messageId });
      } catch (error) {
        console.error("Delete for me error:", error);
      }
    });

    /* Delete message for everyone */
    socket.on("delete-for-everyone", async ({ messageId, userId }) => {
      try {
        const message = await messageModel.findById(messageId);

        if (!message) return;

        // only sender can delete
        if (message.user.toString() !== userId) return;

        message.isDeleted = true;
        message.message = "This message was deleted";

        await message.save();

        io.to("community").emit("message-deleted-for-everyone", {
          messageId,
        });
      } catch (error) {
        console.error("Delete for everyone error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupChatSocket;
