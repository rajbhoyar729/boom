# BOOM Videos App

A short-video viewing app with user authentication, video feed, and video upload functionality.

## Features

- User authentication (register/login)
- Video feed with scrollable list
- Video upload functionality
- Like videos
- User profiles

## Tech Stack

### Backend
- Node.js: JavaScript runtime environment
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing user and video data
- JWT: JSON Web Tokens for secure user authentication
- Cloudinary: Cloud-based media management service for video storage and delivery

## Project Structure

```
boom-video-app/
├── server/               # Node.js/Express backend
│   ├── src/              # Source code
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── config/       # Configuration files
│   │   └── index.js      # Entry point
│   └── ...               # Server config files
│
└── README.md             # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. Navigate to the server directory:
2. ```
   cd server
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on `.env.example` and fill in your credentials:
  ```
   cp .env.example .env
   ```

5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

## Backend Overview

The backend is built with Node.js and Express.js, using MongoDB for data storage. It provides RESTful APIs for user authentication, video management, and user profiles. Media files are stored in Cloudinary, and JWT is used for secure authentication.

### Main Components
- **Express.js**: Handles HTTP requests and routing.
- **MongoDB & Mongoose**: Stores user and video data, with schemas for validation.
- **Cloudinary**: Stores uploaded videos and thumbnails.
- **JWT (JSON Web Token)**: Secures protected routes and authenticates users.
- **Multer**: Handles file uploads for videos and thumbnails.

## Data Models

### User
```js
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  username: String,
  createdAt: Date
}
```

### Video
```js
{
  _id: ObjectId,
  title: String,
  description: String,
  videoid: String (Cloudinary public ID),
  videoUrl: String,
  thumbnailid: String (Cloudinary public ID),
  thumbnailUrl: String,
  uploader: ObjectId (User),
  likes: Number,
  views: Number,
  tags: [String],
  comments: [
    { user: ObjectId, text: String, createdAt: Date }
  ],
  createdAt: Date
}
```

## Security & Authentication

- **Password Hashing**: User passwords are hashed with bcrypt before storage.
- **JWT Authentication**: Upon login/register, users receive a JWT. Protected routes require the `Authorization: Bearer <token>` header.
- **Protected Routes**: Middleware checks the JWT and user existence before allowing access to sensitive endpoints (e.g., video upload, profile update).
- **Input Validation**: All endpoints validate required fields and types.
- **File Upload Security**: Multer restricts file types and sizes for uploads. Cloudinary is used for secure media storage.

### Example: JWT Auth Middleware
```js
const token = req.header('Authorization').replace('Bearer ', '');
jwt.verify(token, process.env.JWT_SECRET);
// If valid, req.user is set
```

## API Endpoints

### Authentication

-   **`POST /api/auth/register`**
    -   **Description:** Registers a new user.
    -   **Request Body:** `{ "username": "...", "email": "...", "password": "..." }`
    -   **Response:** `{ "message": "User registered successfully" }` or error.

-   **`POST /api/auth/login`**
    -   **Description:** Logs in an existing user.
    -   **Request Body:** `{ "email": "...", "password": "..." }`
    -   **Response:** `{ "token": "...", "user": { ... } }` or error.

### Videos

-   **`GET /api/videos`**
    -   **Description:** Gets a list of all videos.
    -   **Response:** `[ { video object }, ... ]`

-   **`GET /api/videos/:id`**
    -   **Description:** Gets details for a specific video by ID.
    -   **Parameters:** `:id` (Video ID)
    -   **Response:** `{ video object }` or error.

-   **`POST /api/videos/upload`**
    -   **Description:** Uploads a new video. Requires authentication.
    -   **Request Body:** `multipart/form-data` containing the video file and other metadata (e.g., title, description).
    -   **Response:** `{ message: "Video uploaded successfully", video: { ... } }` or error.

-   **`POST /api/videos/like/:id`**
    -   **Description:** Likes or unlikes a video by ID. Requires authentication.
    -   **Parameters:** `:id` (Video ID)
    -   **Response:** `{ message: "Video liked/unliked successfully" }` or error.

### Users

-   **`GET /api/users/:id`**
    -   **Description:** Gets a user profile by ID.
    -   **Parameters:** `:id` (User ID)
    -   **Response:** `{ user object }` or error.

-   **`GET /api/users/:id/videos`**
    -   **Description:** Gets videos uploaded by a specific user ID.
    -   **Parameters:** `:id` (User ID)
    -   **Response:** `[ { video object }, ... ]`

-   **`PUT /api/users/profile`**
    -   **Description:** Updates the authenticated user's profile. Requires authentication.
    -   **Request Body:** `{ "username": "...", "bio": "...", ... }` (fields to update)
    -   **Response:** `{ message: "Profile updated successfully", user: { ... } }` or error.

## deployed link

https://boom-5hzk.onrender.com



## License

MIT
