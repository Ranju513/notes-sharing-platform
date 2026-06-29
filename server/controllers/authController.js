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

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
      user.email,
      "NoteHub Email Verification OTP",
      `Your NoteHub OTP is ${otp}. It is valid for 10 minutes.`
    );

    res.status(201).json({
      message: "OTP sent to your email. Please verify your account.",
      email: user.email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
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
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    if (!user.isVerified) {
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;

      await user.save();

      await sendEmail(
        user.email,
        "NoteHub Email Verification OTP",
        `Your NoteHub OTP is ${otp}. It is valid for 10 minutes.`
      );

      return res.status(400).json({
        message: "Please verify your email before login",
        email: user.email,
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
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
};
