import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  username: {
    type: String,
    required: true
  },

  message: {
    type: String,
    trim: true
  },

  // NEW → message type
  type: {
    type: String,
    enum: ["text", "image", "pdf", "link"],
    default: "text"
  },

  // NEW → file url (image/pdf)
  fileUrl: {
    type: String,
    default: null
  },

  // NEW → external link
  link: {
    type: String,
    default: null
  },

  channel: {
    type: String,
    default: "community"
  },

  // reply feature
  replyTo: {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    message: String
  },

  // delete for everyone
  isDeleted: {
    type: Boolean,
    default: false
  },

  // delete for me
  deletedFor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ]
},
{
  timestamps: true
}
);

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;