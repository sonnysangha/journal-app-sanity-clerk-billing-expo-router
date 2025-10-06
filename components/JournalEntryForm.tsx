import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface JournalImage {
  uri: string;
  caption?: string;
  alt?: string;
}

interface JournalEntryFormProps {
  initialData?: {
    title?: string;
    content: string;
    mood: string;
    images: JournalImage[];
    userId: string;
  };
  isEditing?: boolean;
  onSave: (entry: {
    title?: string;
    content: string;
    images: JournalImage[];
    mood: string;
    userId: string;
  }) => void;
  onCancel: () => void;
}

const MOOD_OPTIONS = [
  { emoji: "😢", label: "Very Sad", value: "very-sad" },
  { emoji: "😞", label: "Sad", value: "sad" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😄", label: "Very Happy", value: "very-happy" },
];

export default function JournalEntryForm({
  initialData,
  isEditing = false,
  onSave,
  onCancel,
}: JournalEntryFormProps) {
  const { user } = useUser();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [mood, setMood] = useState(initialData?.mood || "");
  const [images, setImages] = useState<JournalImage[]>(
    initialData?.images || []
  );
  const [currentImageCaption, setCurrentImageCaption] = useState("");

  // Request permissions on component mount
  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Sorry, we need camera roll permissions to add images to your journal entries."
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: JournalImage = {
          uri: result.assets[0].uri,
          caption: "",
          alt: "Journal entry image",
        };
        setImages([...images, newImage]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: JournalImage = {
          uri: result.assets[0].uri,
          caption: "",
          alt: "Journal entry photo",
        };
        setImages([...images, newImage]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const updateImageCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index].caption = caption;
    setImages(newImages);
  };

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert(
        "Missing content",
        "Please write something in your journal entry."
      );
      return;
    }

    if (!mood) {
      Alert.alert("Missing mood", "Please select how you're feeling.");
      return;
    }

    if (!user?.id) {
      Alert.alert(
        "Authentication error",
        "Please sign in to save your journal entry."
      );
      return;
    }

    onSave({
      title: title.trim() || undefined,
      content: content.trim(),
      images,
      mood,
      userId: user.id,
    });
  };

  const showImageOptions = () => {
    Alert.alert("Add Image", "Choose how you want to add an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Give your entry a title..."
            maxLength={100}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What&apos;s on your mind? *</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Write about your day, thoughts, feelings..."
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Images Section */}
        <View style={styles.inputGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Images</Text>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={showImageOptions}
            >
              <Text style={styles.addImageText}>+ Add Image</Text>
            </TouchableOpacity>
          </View>

          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: image.uri }}
                style={styles.image}
                contentFit="cover"
              />
              <View style={styles.imageControls}>
                <TextInput
                  style={styles.captionInput}
                  value={image.caption}
                  onChangeText={(text) => updateImageCaption(index, text)}
                  placeholder="Add a caption..."
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Mood Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>How are you feeling? *</Text>
          <View style={styles.moodContainer}>
            {MOOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.moodOption,
                  mood === option.value && styles.moodOptionSelected,
                ]}
                onPress={() => setMood(option.value)}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={styles.moodLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? "Update Entry" : "Save Entry"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  contentInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    minHeight: 120,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addImageButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addImageText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  captionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  moodOption: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e1e5e9",
    minWidth: 80,
  },
  moodOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
