"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from "react-native"
import { Video } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import api from "../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { height, width } = Dimensions.get("window")

const HomeScreen = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos")
      setVideos(response.data)
    } catch (error) {
      console.error("Error fetching videos:", error)
      Alert.alert("Error", "Failed to load videos")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (videoId) => {
    try {
      const userId = await AsyncStorage.getItem("userId")
      await api.post(`/like/${videoId}`)

      // Update videos state to reflect the like
      setVideos(
        videos.map((video) => {
          if (video._id === videoId) {
            return { ...video, likes: video.likes + 1 }
          }
          return video
        }),
      )
    } catch (error) {
      console.error("Error liking video:", error)
      Alert.alert("Error", "Failed to like video")
    }
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  const renderItem = ({ item, index }) => {
    const isActive = index === currentIndex

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.videoUrl }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={isActive}
          isLooping
          style={styles.video}
        />

        <View style={styles.overlay}>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.videoUploader}>@{item.uploader?.username || "user"}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item._id)}>
              <Ionicons name="heart" size={30} color="#FF4D4D" />
              <Text style={styles.actionText}>{item.likes || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D4D" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoContainer: {
    height: height,
    width: width,
    position: "relative",
  },
  video: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 20,
  },
  videoInfo: {
    marginTop: "auto",
    marginBottom: 80,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  videoUploader: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  actions: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 15,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
})

export default HomeScreen
