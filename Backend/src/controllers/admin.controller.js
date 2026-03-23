import userModel from "../models/user.model.js";
import interviewReportModel from "../models/interviewReport.model.js";      
import messageModel from "../models/message.model.js";    

// Get Platform Stats

export const getAdminStats = async (req, res) => {
  try {

    const totalUsers = await userModel.countDocuments();
    const totalResumes = await interviewReportModel.countDocuments();
    const totalMessages = await messageModel.countDocuments();

    res.json({
      totalUsers,
    //   totalResumes,
      totalMessages
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get All Users

export const getAllUsers = async (req, res) => {
  try {

    const users = await userModel
      .find()
      .select("-password");

    res.json({
      total: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Delete User

export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Cannot delete admin"
      });
    }

    await userModel.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

//ban
export const banUser = async (req, res) => {

  const { id } = req.params;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(403).json({ message: "Cannot ban admin" });
  }

  user.isBanned = !user.isBanned;

  await user.save();

  res.json({
    message: "User status updated",
    isBanned: user.isBanned
  });

};