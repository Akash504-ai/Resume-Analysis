import userModel from "../models/user.model.js";

export async function getAllUsers(req, res) {

    const users = await userModel.find().select("-password");

    res.json({
        total: users.length,
        users
    });

}

export async function deleteUser(req, res) {

    const { id } = req.params;

    await userModel.findByIdAndDelete(id);

    res.json({
        message: "User deleted"
    });

}