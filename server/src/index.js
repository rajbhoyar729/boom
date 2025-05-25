const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const videoRoutes = require("./routes/videos")
const userRoutes = require("./routes/users")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(morgan("dev"))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello this is t boom entertainments pvt ltd" })
})

app.use("/api/auth", authRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/users", userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
