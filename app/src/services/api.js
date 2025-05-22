import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create axios instance
const api = axios.create({
  baseURL: "http://10.0.2.2:5000/api", // Android emulator points to localhost
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
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear token and redirect to login
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("userId")

      // We can't directly navigate here, so we'll need to handle this in the UI
      // by checking for 401 errors in the components

      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export default api
