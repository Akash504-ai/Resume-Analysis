import messageModel from "../models/message.model.js";
import axios from "axios";

const ML_API = `${process.env.ML_SERVICE_URL}/moderate`;
const onlineUsers = new Map();

const setupChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* USER JOIN COMMUNITY */
    socket.on("join-community", async ({ userId }) => {
      socket.join("community");

      onlineUsers.set(userId, socket.id);

      io.to("community").emit("online-users", Array.from(onlineUsers.keys()));

      try {
        const messages = await messageModel
          .find({
            channel: "community",
            deletedFor: { $nin: [userId] },
          })
          .sort({ createdAt: -1 })
          .limit(50);

        socket.emit("chat-history", messages.reverse());

        const pinned = await messageModel.findOne({
          channel: "community",
          isPinned: true,
        });

        if (pinned) socket.emit("message-pinned", pinned);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    });

    /* SEND MESSAGE */
    socket.on("send-message", async (data) => {
      try {
        const { userId, username, message, replyTo, type, imageUrl, mentions } =
          data;

        /* Call ML moderation API */
        let spam_score = 0;
        let toxic_score = 0;

        try {
          const moderation = await axios.post(
            ML_API,
            { text: message },
            { timeout: 60000 }, // prevents timeout crash (Render cold start)
          );

          spam_score = moderation.data.spam_score;
          toxic_score = moderation.data.toxic_score;
        } catch (err) {
          console.error("ML service failed:", err.message);
        }

        console.log("Spam score:", spam_score);
        console.log("Toxic score:", toxic_score);

        let moderationLabel = null;

        if (toxic_score > 0.6) moderationLabel = "toxic";
        else if (spam_score > 0.3) moderationLabel = "spam";

        const newMessage = await messageModel.create({
          user: userId,
          username,
          message,
          type: type || "text",
          imageUrl: imageUrl || null,
          mentions: mentions || [],
          moderation: moderationLabel, 
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

    /* MESSAGE REACTION */
    socket.on("add-reaction", async ({ messageId, emoji, userId }) => {
      try {
        const message = await messageModel.findById(messageId);
        if (!message) return;

        const existingReaction = message.reactions.find(
          (r) => r.user.toString() === userId,
        );

        if (existingReaction) {
          existingReaction.emoji = emoji;
        } else {
          message.reactions.push({ emoji, user: userId });
        }

        await message.save();

        io.to("community").emit("reaction-updated", {
          messageId,
          reactions: message.reactions,
        });
      } catch (error) {
        console.error("Reaction error:", error);
      }
    });

    /* TYPING INDICATOR */
    socket.on("typing-start", ({ username }) => {
      socket.to("community").emit("user-typing", username);
    });

    socket.on("typing-stop", ({ username }) => {
      socket.to("community").emit("user-stop-typing", username);
    });

    /* SEARCH MESSAGES */
    socket.on("search-messages", async ({ query }) => {
      try {
        const results = await messageModel
          .find({
            $text: { $search: query },
            channel: "community",
          })
          .limit(20);

        socket.emit("search-results", results);
      } catch (error) {
        console.error("Search error:", error);
      }
    });

    /* DELETE FOR ME */
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

    /* DELETE FOR EVERYONE */
    socket.on("delete-for-everyone", async ({ messageId, userId }) => {
      try {
        const message = await messageModel.findById(messageId);
        if (!message) return;

        if (message.user.toString() !== userId) return;

        message.isDeleted = true;
        message.message = "This message was deleted";

        await message.save();

        io.to("community").emit("message-deleted-for-everyone", { messageId });
      } catch (error) {
        console.error("Delete for everyone error:", error);
      }
    });

    /* PIN MESSAGE */
    socket.on("pin-message", async ({ messageId }) => {
      try {
        await messageModel.updateMany(
          { channel: "community", isPinned: true },
          { isPinned: false },
        );

        const pinnedMessage = await messageModel.findByIdAndUpdate(
          messageId,
          { isPinned: true },
          { new: true },
        );

        io.to("community").emit("message-pinned", pinnedMessage);
      } catch (error) {
        console.error("Pin message error:", error);
      }
    });

    /* UNPIN MESSAGE */
    socket.on("unpin-message", async ({ messageId }) => {
      try {
        await messageModel.findByIdAndUpdate(messageId, { isPinned: false });

        io.to("community").emit("message-unpinned", { messageId });
      } catch (error) {
        console.error("Unpin message error:", error);
      }
    });

    /* USER DISCONNECT */
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.to("community").emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};

export default setupChatSocket;
