# BOOM Videos App

A short-video viewing app with user authentication, video feed, and video upload functionality.

## Features

- User authentication (register/login)
- Video feed with scrollable list
- Video upload functionality
- Like videos
- User profiles

## Tech Stack

### Frontend (Mobile App)
- React Native
- Expo
- React Navigation
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB (database)
- JWT for authentication
- Cloudinary for video storage

## Project Structure

\`\`\`
boom-video-app/
├── app/                  # React Native frontend
│   ├── src/              # Source code
│   │   ├── components/   # Reusable components
│   │   ├── screens/      # App screens
│   │   ├── navigation/   # Navigation setup
│   │   ├── services/     # API services
│   │   └── assets/       # Images and other assets
│   └── ...               # React Native config files
│
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
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Android Studio (for Android development)

### Backend Setup

1. Navigate to the server directory:
   \`\`\`
   cd server
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file based on `.env.example` and fill in your credentials:
   \`\`\`
   cp .env.example .env
   \`\`\`

4. Start the server:
   \`\`\`
   npm run dev
   \`\`\`

### Frontend Setup

1. Navigate to the app directory:
   \`\`\`
   cd app
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the Expo development server:
   \`\`\`
   npm start
   \`\`\`

4. Run on Android:
   \`\`\`
   npm run android
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get a specific video
- `POST /api/videos/upload` - Upload a new video
- `POST /api/videos/like/:id` - Like a video

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/videos` - Get user videos
- `PUT /api/users/profile` - Update user profile

## Demo

[Link to demo video]

## License

MIT
