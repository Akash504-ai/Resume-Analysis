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
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    resetOTP: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
