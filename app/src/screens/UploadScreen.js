"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Video } from "expo-av"
import api from "../services/api"
import { Ionicons } from "@expo/vector-icons"

const UploadScreen = ({ navigation }) => {
  const [title, setTitle] = useState("")
  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [uploading, setUploading] = useState(false)

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled) {
        setVideo(result.assets[0].uri)
        // Generate thumbnail (in a real app, this would be done on the server)
        setThumbnail(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video")
    }
  }

  const uploadVideo = async () => {
    if (!video || !title.trim()) {
      Alert.alert("Error", "Please select a video and add a title")
      return
    }

    try {
      setUploading(true)

      // Create form data for upload
      const formData = new FormData()
      formData.append("title", title)

      // Add video file
      const videoName = video.split("/").pop()
      const videoType = "video/" + (videoName.split(".").pop() === "mp4" ? "mp4" : "quicktime")

      formData.append("video", {
        uri: video,
        name: videoName,
        type: videoType,
      })

      // Upload to server
      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Reset form
      setTitle("")
      setVideo(null)
      setThumbnail(null)

      // Show success message
      Alert.alert("Success", "Video uploaded successfully", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      console.error("Upload error:", error)
      Alert.alert("Error", "Failed to upload video")
    } finally {
      setUploading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Upload New Video</Text>

        <TouchableOpacity style={styles.uploadArea} onPress={pickVideo} disabled={uploading}>
          {video ? (
            <Video source={{ uri: video }} style={styles.videoPreview} resizeMode="cover" shouldPlay={false} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="cloud-upload-outline" size={50} color="#FF4D4D" />
              <Text style={styles.placeholderText}>Tap to select video</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Add a title for your video"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          multiline
          disabled={uploading}
        />

        <TouchableOpacity
          style={[styles.button, (!video || !title.trim() || uploading) && styles.disabledButton]}
          onPress={uploadVideo}
          disabled={!video || !title.trim() || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Upload Video</Text>
          )}
        </TouchableOpacity>

        {uploading && (
          <Text style={styles.uploadingText}>
            Uploading video... This may take a while depending on your connection.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  uploadArea: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 10,
    color: "#666",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 60,
  },
  button: {
    backgroundColor: "#FF4D4D",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ffb3b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadingText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
})

export default UploadScreen
