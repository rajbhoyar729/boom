"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "../services/api"
import { useNavigation } from "@react-navigation/native"

const ProfileScreen = () => {
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const userId = await AsyncStorage.getItem("userId")

      // Fetch user profile
      const userResponse = await api.get(`/users/${userId}`)
      setUser(userResponse.data)

      // Fetch user videos
      const videosResponse = await api.get(`/users/${userId}/videos`)
      setVideos(videosResponse.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
      Alert.alert("Error", "Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("userId")

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    } catch (error) {
      console.error("Error logging out:", error)
      Alert.alert("Error", "Failed to log out")
    }
  }

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => navigation.navigate("Home")}>
      <Image source={{ uri: item.thumbnailUrl || "https://via.placeholder.com/150" }} style={styles.thumbnail} />
      <View style={styles.videoItemInfo}>
        <Text style={styles.videoItemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.videoItemStats}>{item.likes || 0} likes</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D4D" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitial}>{user?.email?.charAt(0).toUpperCase() || "U"}</Text>
        </View>

        <Text style={styles.username}>{user?.email?.split("@")[0] || "User"}</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{videos.length}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{videos.reduce((total, video) => total + (video.likes || 0), 0)}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>
      </View>

      <View style={styles.videosSection}>
        <Text style={styles.sectionTitle}>My Videos</Text>

        {videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No videos uploaded yet</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate("Upload")}>
              <Text style={styles.uploadButtonText}>Upload a Video</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.videosList}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF4D4D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  videosSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  videosList: {
    paddingBottom: 20,
  },
  videoItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnail: {
    width: 100,
    height: 70,
  },
  videoItemInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  videoItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  videoItemStats: {
    fontSize: 12,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default ProfileScreen
