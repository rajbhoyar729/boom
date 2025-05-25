
# BOOM Videos App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-4.x-green.svg)](https://www.mongodb.com/)

A robust backend service powering a modern short-form video platform, built with industry-standard technologies. BOOM Videos App provides comprehensive APIs for secure user authentication, video management, and seamless user interactions.

## Overview

BOOM Videos App is designed to deliver a high-performance, scalable backend for short-form video content platforms. The service handles everything from user management to video processing, providing a solid foundation for building engaging video-sharing applications.

### Key Capabilities
- **Content Management**: Upload, store, and serve short-form videos with automatic thumbnail generation
- **User Experience**: Personalized video feed with intuitive browsing and interaction features
- **Security**: Robust authentication and authorization using JWT tokens
- **Media Handling**: Efficient video processing and storage using Cloudinary
- **Scalability**: Built on MongoDB for flexible data storage and high performance

## Features

### Core Features
- **User Management**
  - Secure registration and authentication
  - JWT-based authorization
  - Profile management and customization
  - Personal video library

- **Video Features**
  - Video upload with automatic processing
  - Custom thumbnail support
  - Video feed with sorting options
  - Like/unlike functionality
  - Comment system
  - View count tracking

- **Technical Features**
  - RESTful API architecture
  - Cloudinary integration for media storage
  - MongoDB for flexible data storage
  - Input validation and sanitization
  - Error handling and logging


## Tech Stack

### Core Technologies
- **Node.js**: Runtime environment (v14.x or higher)
- **Express.js**: Web application framework for robust API development
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling and validation

### Authentication & Security
- **JWT (JSON Web Tokens)**: Secure authentication and authorization
- **bcrypt.js**: Password hashing and verification
- **Express middleware**: Request validation and security checks

### File Handling & Storage
- **Cloudinary**: Cloud-based media storage and processing
- **Multer**: File upload handling and processing
- **UUID**: Unique identifier generation for files

### Development Tools
- **Morgan**: HTTP request logger for development
- **Cors**: Cross-Origin Resource Sharing support
- **dotenv**: Environment variable management

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── cloudinary.js     # Cloudinary configuration
│   │   └── database.js       # MongoDB connection setup
│   │
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── upload.js         # File upload middleware
│   │
│   ├── models/
│   │   ├── User.js           # User model schema
│   │   └── Video.js          # Video model schema
│   │
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management routes
│   │   └── videos.js         # Video handling routes
│   │
│   └── index.js              # Application entry point
│
├── uploads/                   # Temporary file storage
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```


## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for media storage)
- Git (for version control)

### Development Environment Setup

1. **Clone the Repository**
   ```sh
   git clone <repository-url>
   cd server
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Environment Configuration**
   ```sh
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/boom-videos
   # Or use your MongoDB Atlas URI:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/boom-videos

   # JWT Configuration
   JWT_SECRET=your-secret-key
   JWT_EXPIRY=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Optional: Cors Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   - For local MongoDB:
     ```sh
     # Start MongoDB service
     mongod
     ```
   - For MongoDB Atlas:
     - Create a cluster in MongoDB Atlas
     - Get your connection string
     - Update MONGODB_URI in `.env`

5. **Cloudinary Setup**
   - Create a Cloudinary account at https://cloudinary.com
   - Get your cloud name, API key, and secret from the dashboard
   - Update Cloudinary credentials in `.env`

6. **Start the Development Server**
   ```sh
   npm run dev
   ```
   The server will start on http://localhost:5000

### Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm start`: Start production server
- `npm test`: Run test suite
- `npm run lint`: Run ESLint for code style checking

## API Endpoints


## Backend Overview

This backend provides RESTful APIs for user authentication, video management, and user profiles. Media files are stored in Cloudinary, and JWT is used for secure authentication. All sensitive routes are protected by middleware.


## Data Models

### User
| Field      | Type     | Description                |
|------------|----------|----------------------------|
| _id        | ObjectId | Unique user ID             |
| email      | String   | User email (unique)        |
| password   | String   | Hashed password            |
| username   | String   | Username                   |
| createdAt  | Date     | Registration date          |

### Video
| Field        | Type       | Description                        |
|--------------|------------|------------------------------------|
| _id          | ObjectId   | Unique video ID                    |
| title        | String     | Video title                        |
| description  | String     | Video description                  |
| videoid      | String     | Cloudinary video public ID         |
| videoUrl     | String     | Cloudinary video URL               |
| thumbnailid  | String     | Cloudinary thumbnail public ID     |
| thumbnailUrl | String     | Cloudinary thumbnail URL           |
| uploader     | ObjectId   | Reference to User                  |
| likes        | Number     | Number of likes                    |
| views        | Number     | Number of views                    |
| tags         | [String]   | Tags                               |
| comments     | [Object]   | Comments (user, text, createdAt)   |
| createdAt    | Date       | Upload date                        |


## Security & Authentication

- **Password Hashing:** User passwords are hashed with bcrypt before storage.
- **JWT Authentication:** Users receive a JWT on login/register. Protected routes require `Authorization: Bearer <token>`.
- **Protected Routes:** Middleware checks JWT and user existence before allowing access to sensitive endpoints (e.g., video upload, profile update).
- **Input Validation:** All endpoints validate required fields and types.
- **File Upload Security:** Multer restricts file types and sizes for uploads. Cloudinary is used for secure media storage.


## API Documentation

All API endpoints are prefixed with `/api`.

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60e6f3a789e13d1234567890",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid input
- `409 Conflict`: Email already registered
- `500 Server Error`: Internal server error

#### User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60e6f3a789e13d1234567890",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
- `404 Not Found`: User not found
- `500 Server Error`: Internal server error

### Video Endpoints

#### Upload Video
```http
POST /api/videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
video: <video_file>
thumbnail: <image_file>
title: "My Amazing Video"
description: "Description of the video"
```

**Success Response (201 Created):**
```json
{
  "_id": "60e6f3a789e13d1234567890",
  "title": "My Amazing Video",
  "description": "Description of the video",
  "videoUrl": "https://cloudinary.com/...",
  "thumbnailUrl": "https://cloudinary.com/...",
  "uploader": "60e6f3a789e13d1234567890",
  "likes": 0,
  "views": 0,
  "createdAt": "2023-07-14T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Missing files or invalid input
- `401 Unauthorized`: Invalid or missing token
- `413 Payload Too Large`: File size exceeds limit
- `500 Server Error`: Upload or processing failed

#### Get All Videos
```http
GET /api/videos
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "60e6f3a789e13d1234567890",
    "title": "Video Title",
    "description": "Video Description",
    "videoUrl": "https://cloudinary.com/...",
    "thumbnailUrl": "https://cloudinary.com/...",
    "uploader": {
      "_id": "60e6f3a789e13d1234567890",
      "username": "johndoe"
    },
    "likes": 10,
    "views": 100,
    "createdAt": "2023-07-14T12:00:00.000Z"
  }
]
```

#### Get Video by ID
```http
GET /api/videos/:id
```

**Success Response (200 OK):**
```json
{
  "_id": "60e6f3a789e13d1234567890",
  "title": "Video Title",
  "description": "Video Description",
  "videoUrl": "https://cloudinary.com/...",
  "thumbnailUrl": "https://cloudinary.com/...",
  "uploader": {
    "_id": "60e6f3a789e13d1234567890",
    "username": "johndoe"
  },
  "likes": 10,
  "views": 100,
  "createdAt": "2023-07-14T12:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Video not found
- `500 Server Error`: Server error

#### Like Video
```http
POST /api/videos/like/:id
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "likes": 11
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Video not found
- `500 Server Error`: Server error

### User Endpoints

#### Get User Profile
```http
GET /api/users/:id
```

**Success Response (200 OK):**
```json
{
  "_id": "60e6f3a789e13d1234567890",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2023-07-14T12:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: User not found
- `500 Server Error`: Server error

#### Get User Videos
```http
GET /api/users/:id/videos
```

**Success Response (200 OK):**
```json
[
  {
    "_id": "60e6f3a789e13d1234567890",
    "title": "Video Title",
    "description": "Video Description",
    "videoUrl": "https://cloudinary.com/...",
    "thumbnailUrl": "https://cloudinary.com/...",
    "likes": 10,
    "views": 100,
    "createdAt": "2023-07-14T12:00:00.000Z"
  }
]
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "newusername"
}
```

**Success Response (200 OK):**
```json
{
  "_id": "60e6f3a789e13d1234567890",
  "email": "john@example.com",
  "username": "newusername"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid or missing token
- `500 Server Error`: Server error

### Error Handling

The API uses standard HTTP status codes and consistent error response formats:

#### Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid input or parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `413 Payload Too Large`: File size exceeds limit
- `500 Server Error`: Internal server error

#### Error Response Format

All error responses follow this format:
```json
{
  "message": "Description of the error"
}
```

### Rate Limiting

- API requests are limited to 100 requests per IP per minute
- File uploads are limited to 10 uploads per user per hour
- Response headers include rate limit information:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

### API Versioning

The current API version is v1, which is implied in the base URL `/api/`. Future versions will be explicitly versioned as `/api/v2/`, etc. Major version changes will be communicated in advance and maintained with backward compatibility for at least 6 months.

---

### Videos

#### Get All Videos
**GET** `/api/videos`
*Returns all videos.*

**Response:**
```json
[
  { "_id": "...", "title": "...", ... }
]
```

#### Get Video by ID
**GET** `/api/videos/:id`
*Returns a single video by its ID.*

**Response:**
```json
{ "_id": "...", "title": "...", ... }
```

#### Upload Video
**POST** `/api/videos/upload`
*Uploads a new video. Requires authentication.*

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `video` (file): Video file
- `thumbnail` (file): Thumbnail image
- `title` (string)
- `description` (string)

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "video": { "_id": "...", "title": "...", ... }
}
```

#### Like a Video
**POST** `/api/videos/like/:id`
*Likes a video. Requires authentication.*

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{ "likes": 5 }
```

#### Update Video
**PATCH** `/api/videos/:id`
*Updates video details. Requires authentication and ownership.*

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body (JSON):**
```json
{
  "title": "string (optional)",
  "description": "string (optional)"
}
```
**Response:**
```json
{ "_id": "...", "title": "...", ... }
```

---

### Users

#### Get User Profile
**GET** `/api/users/:id`
*Returns user profile by ID.*

**Response:**
```json
{ "_id": "...", "email": "...", "username": "..." }
```

#### Get User's Videos
**GET** `/api/users/:id/videos`
*Returns all videos uploaded by a user.*

**Response:**
```json
[
  { "_id": "...", "title": "...", ... }
]
```

#### Update User Profile
**PUT** `/api/users/profile`
*Updates the authenticated user's profile.*

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body (JSON):**
```json
{
  "username": "string"
}
```
**Response:**
```json
{ "_id": "...", "email": "...", "username": "..." }
```


<!-- The above API Documentation section provides all details. The following is a quick summary. -->

## Deployment Guide

### Deploy to Production

#### Prerequisites
- Node.js production environment
- MongoDB production database
- Cloudinary account
- Process manager (PM2 recommended)
- SSL certificate for HTTPS

#### Deployment Steps

1. **Server Setup**
   ```sh
   # Clone repository
   git clone <repository-url>
   cd server
   
   # Install dependencies
   npm install --production
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Use secure `JWT_SECRET`
   - Configure MongoDB production URI
   - Set up Cloudinary production credentials
   - Configure CORS for production domains

3. **Process Management**
   ```sh
   # Install PM2 globally
   npm install -g pm2
   
   # Start application
   pm2 start src/index.js --name boom-videos
   
   # Configure PM2 startup
   pm2 startup
   pm2 save
   ```

4. **Monitoring**
   ```sh
   # Monitor application
   pm2 monit
   
   # View logs
   pm2 logs boom-videos
   ```

### Production Checklist

- [ ] Configure secure environment variables
- [ ] Enable production logging
- [ ] Set up monitoring and alerts
- [ ] Configure automatic backups
- [ ] Set up SSL/TLS
- [ ] Enable security headers
- [ ] Configure rate limiting
- [ ] Set up automated deployments

## Troubleshooting

### Common Issues

#### Connection Issues
```
Error: ECONNREFUSED 127.0.0.1:27017
```
- Check if MongoDB is running
- Verify MongoDB connection string
- Check network connectivity and firewall rules

#### Authentication Errors
```
JsonWebTokenError: invalid signature
```
- Verify JWT_SECRET is correctly set
- Check token expiration
- Ensure consistent JWT_SECRET across deployments

#### File Upload Issues
```
Error: Request entity too large
```
- Check file size limits in Multer config
- Verify Cloudinary upload settings
- Check network upload speed and timeout settings

#### Performance Issues
- Enable database indexes
- Implement caching where appropriate
- Monitor memory usage and leaks
- Use compression middleware
- Optimize database queries

### Logging and Debugging

- Check application logs: `pm2 logs`
- Monitor server resources: `pm2 monit`
- Enable debug logging:
  ```sh
  # Windows PowerShell
  $env:DEBUG="boom:*"; npm run dev
  ```

### Getting Help

- Open an issue in the GitHub repository
- Check existing issues and documentation
- Join our Discord community for support

## Deployed Demo

Access the deployed demo at: https://boom-5hzk.onrender.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- Commercial use allowed
- Modification allowed
- Distribution allowed
- Private use allowed
- Liability and warranty limitations apply
