const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const cloudinary = require("cloudinary").v2
const auth = require("../middleware/auth")
const Video = require("../models/Video")
const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|wmv|flv|mkv/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only video files are allowed"))
  },
})

// Upload video
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" })
    }

    const { title } = req.body
    if (!title) {
      return res.status(400).json({ message: "Title is required" })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "boom-videos",
    })

    // Create video record
    const video = new Video({
      title,
      videoUrl: result.secure_url,
      thumbnailUrl: result.secure_url.replace(/\.[^/.]+$/, ".jpg"), // Cloudinary auto-generates thumbnails
      uploader: req.userId,
    })

    await video.save()

    // Delete local file after upload
    fs.unlinkSync(req.file.path)

    res.status(201).json(video)
  } catch (error) {
    console.error("Video upload error:", error)

    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ message: "Failed to upload video" })
  }
})

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).populate("uploader", "username")

    res.json(videos)
  } catch (error) {
    console.error("Get videos error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("uploader", "username")

    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    res.json(video)
  } catch (error) {
    console.error("Get video error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Like a video
router.post("/like/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }

    // Increment likes
    video.likes += 1
    await video.save()

    res.json({ likes: video.likes })
  } catch (error) {
    console.error("Like video error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
