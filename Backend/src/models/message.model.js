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
        required: true,
        trim: true
    },

    channel: {
        type: String,
        default: "community"
    }

},
{
    timestamps: true
}
);

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;