import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },

    profileImage: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    targetRole: {
        type: String,
        default: ""
    },

    skills: {
        type: [String],
        default: []
    },

    codingProfiles: {
        leetcode: { type: String, default: "" },
        gfg: { type: String, default: "" },
        codeforces: { type: String, default: "" },
        codechef: { type: String, default: "" }
    },

    github: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
}
);

const profileModel = mongoose.model("profiles", profileSchema);

export default profileModel;