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

// Configure multer for file upload
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
  limits: { fileSize: 150 * 1024 * 1024 }, // Increased limit to 150MB for video and thumbnail
  fileFilter: (req, file, cb) => {
    // Allow both video and image file types based on fieldname
    if (file.fieldname === "video") {
      const filetypes = /mp4|mov|avi|wmv|flv|mkv/
      const mimetype = filetypes.test(file.mimetype)
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
      if (mimetype && extname) {
        return cb(null, true)
      }
      cb(new Error("Only video files are allowed for video field"))
    } else if (file.fieldname === "thumbnail") {
      const filetypes = /jpeg|jpg|png/
      const mimetype = filetypes.test(file.mimetype)
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
      if (mimetype && extname) {
        return cb(null, true)
      }
      cb(new Error("Only image files are allowed for thumbnail field"))
    } else {
      cb(new Error("Unexpected field"))
    }
  },
})

// Upload video and thumbnail
router.post("/upload", auth, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    const { title, description } = req.body; // Extract description from req.body

    if (!videoFile || !thumbnailFile || !title || !description) { // Add description validation
      // Clean up uploaded files if any
      if (videoFile && fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
      if (thumbnailFile && fs.existsSync(thumbnailFile.path)) fs.unlinkSync(thumbnailFile.path);
      return res.status(400).json({ message: "Video file, thumbnail file, title, and description are required" });
    }

    // Upload video to Cloudinary
    const videoResult = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: "boom-videos",
    });

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(thumbnailFile.path, {
      resource_type: "image",
      folder: "boom-videos/thumbnails", // Optional: store thumbnails in a separate folder
    });

    // Create video record
    const video = new Video({
      title:req.body.title,
      description: req.body.description, // Include description in the video document
      videoid: videoResult.public_id, // Store Cloudinary video public ID
      videoUrl: videoResult.secure_url,
      thumbnailid: thumbnailResult.public_id, // Store Cloudinary thumbnail public ID
      thumbnailUrl: thumbnailResult.secure_url,
      uploader: req.userId,
    });

    await video.save();

    // Delete local files after upload
    fs.unlinkSync(videoFile.path);
    fs.unlinkSync(thumbnailFile.path);

    res.status(201).json(video);
  } catch (error) {
    console.error("Video upload error:", error);

    // Clean up local files if they exist
    const videoFile = req.files && req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files && req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    if (videoFile && fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
    if (thumbnailFile && fs.existsSync(thumbnailFile.path)) fs.unlinkSync(thumbnailFile.path);

    res.status(500).json({ message: "Failed to upload video" });
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
