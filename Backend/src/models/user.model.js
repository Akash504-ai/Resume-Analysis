import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    grokApiKey: {
        type: String,
        default: null
    }

},
{
    timestamps: true
}
);

const userModel = mongoose.model("users", userSchema);

export default userModel;