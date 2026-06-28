const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
      normalizedEmail,
      "NoteHub Email Verification OTP",
      `Your NoteHub verification OTP is ${otp}. It is valid for 10 minutes.`
    );

    res.status(201).json({
      message: "OTP sent to your email. Please verify your account.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!otp || !otp.trim()) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before login",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
};
