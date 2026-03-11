import mongoose from "mongoose";

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
      required: true,
      trim: true,
    },

    channel: {
      type: String,
      default: "community",
    },

    // reply feature
    replyTo: {
      _id: mongoose.Schema.Types.ObjectId,
      username: String,
      message: String,
    },

    // delete for everyone
    isDeleted: {
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

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
