import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create axios instance
const api = axios.create({
  baseURL: "https://boom-5hzk.onrender.com/api", // Deployed backend URL
  // For physical device testing, use your computer's IP address
  // baseURL: 'http://192.168.1.x:5000/api',
  timeout: 30000, // 30 seconds timeout for video uploads
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("userId")
      // We'll handle navigation in the components
      return Promise.reject({
        type: "auth",
        message: "Session expired. Please login again.",
      })
    }

    // Handle other common errors
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || "Something went wrong"
      return Promise.reject({
        type: "server",
        status: error.response.status,
        message,
      })
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        type: "network",
        message: "Network error. Please check your connection.",
      })
    } else {
      // Error in request configuration
      return Promise.reject({
        type: "client",
        message: "Failed to make request.",
      })
    }
  },
)

export default api
