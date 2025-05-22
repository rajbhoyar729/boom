const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/User")
const Video = require("../models/Video")
const router = express.Router()

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error fetching user profile" })
  }
})

// Get user videos
router.get("/:id/videos", async (req, res) => {
  try {
    const videos = await Video.find({ uploader: req.params.id }).sort({ createdAt: -1 })

    res.json(videos)
  } catch (error) {
    console.error("Get user videos error:", error)
    res.status(500).json({ message: "Server error fetching user videos" })
  }
})

// Update user profile (protected route)
router.put("/profile", auth, async (req, res) => {
  try {
    const { username } = req.body

    // Update user
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username

    await user.save()

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Server error updating profile" })
  }
})

module.exports = router
