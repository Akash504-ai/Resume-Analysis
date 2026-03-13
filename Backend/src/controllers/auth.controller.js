import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* =========================
   Register User
========================= */

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and password",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists with this email or username",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await emailApi.sendTransacEmail({
        sender: {
          email: "santraakash999@gmail.com",
          name: "Nexus AI",
        },
        to: [{ email: user.email }],
        subject: "Welcome to Nexus 🚀",
        htmlContent: `
    <h1>Welcome to Nexus</h1>
    
    <p>Initialize your neural credentials and enter the protocol.</p>

    <p>Your AI-powered interview system is ready.</p>

    <h3>What you can do now:</h3>

    <ul>
      <li>Upload your resume for <b>ML/NLP-based analysis</b></li>
      <li>Get <b>Top 5 job recommendations</b> from the internet with apply links</li>
      <li>Practice <b>technical and behavioral interview questions</b></li>
      <li>Follow an <b>AI interview preparation roadmap</b></li>
      <li>Join the <b>Nexus community</b> for peer support</li>
      <li>Track progress with the <b>LeetCode-style planning system</b></li>
    </ul>

    <p>Start building your interview system today.</p>

    <br/>

    <p><b>Nexus AI Protocol</b></p>
  `,
      });
    } catch (error) {
      console.error("Welcome email failed:", err.message);
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/* =========================
   Login User
========================= */

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/* =========================
   Logout User
========================= */

async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/* =========================
   Get Current User
========================= */

async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.set("Cache-Control", "no-store");

    res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        grokApiKey: !!user.grokApiKey,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await emailApi.sendTransacEmail({
      sender: {
        email: "santraakash999@gmail.com",
        name: "Nexus AI",
      },
      to: [{ email }],
      subject: "Password Reset OTP",
      htmlContent: `
        <h2>Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    res.status(200).json({
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function resetPasswordController(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export default {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController,
};
