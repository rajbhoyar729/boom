const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()
const multer = require('multer'); // Import multer

// Configure multer for handling form-data (without file uploads)
const upload = multer();

// Register a new user
router.post("/register", upload.none(), async (req, res) => { // Use upload.none() for text-only form-data
  try {
    const { email, password, username } = req.body; // Include username
    console.log(req.body);

    // Validate input
    if (!email || !password || !username) { // Add username validation
      return res.status(400).json({ message: "Please provide email, password, and username" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ email, password, username }); // Include username in user creation
    await user.save();


    // Generate JWT token
    // Debug logs removed
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    // More specific error handling could be added here, e.g., for Mongoose validation errors
    res.status(500).json({ message: "Server error" });
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }


    // Generate JWT token
    // Debug logs removed
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
