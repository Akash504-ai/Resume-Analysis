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

        // 🔹 send pinned message if exists
        const pinned = await messageModel.findOne({
          channel: "community",
          isPinned: true,
        });

        if (pinned) {
          socket.emit("message-pinned", pinned);
        }

      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    });

    /* When user sends message */
    socket.on("send-message", async (data) => {
      try {
        const { userId, username, message, replyTo, type, fileUrl, link } = data;

        const newMessage = await messageModel.create({
          user: userId,
          username,
          message,
          type: type || "text",
          fileUrl: fileUrl || null,
          link: link || null,
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

    /* Pin message */
    socket.on("pin-message", async ({ messageId }) => {
      try {

        // unpin any previous pinned message
        await messageModel.updateMany(
          { channel: "community", isPinned: true },
          { isPinned: false }
        );

        const pinnedMessage = await messageModel.findByIdAndUpdate(
          messageId,
          { isPinned: true },
          { new: true }
        );

        io.to("community").emit("message-pinned", pinnedMessage);

      } catch (error) {
        console.error("Pin message error:", error);
      }
    });

    /* Unpin message */
    socket.on("unpin-message", async ({ messageId }) => {
      try {

        await messageModel.findByIdAndUpdate(messageId, {
          isPinned: false,
        });

        io.to("community").emit("message-unpinned", { messageId });

      } catch (error) {
        console.error("Unpin message error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
};

export default setupChatSocket;