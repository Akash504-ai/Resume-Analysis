import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    emoji: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // message type
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    // image url
    imageUrl: {
      type: String,
      default: null,
    },

    channel: {
      type: String,
      default: "community",
      index: true,
    },

    // reply feature
    replyTo: {
      _id: mongoose.Schema.Types.ObjectId,
      username: String,
      message: String,
    },

    // mentions feature (@username)
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    // reactions
    reactions: [reactionSchema],

    // delete for everyone
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // pinned message
    isPinned: {
      type: Boolean,
      default: false,
    },

    // delete for me
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// text search index (for message search)
messageSchema.index({ message: "text" });

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
