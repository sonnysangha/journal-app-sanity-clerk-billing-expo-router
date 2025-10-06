import { IconSymbol } from "@/components/ui/icon-symbol";
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
  {
    icon: "face.dashed",
    label: "Very Sad",
    value: "very-sad",
    color: "#ef4444",
  },
  { icon: "cloud.rain", label: "Sad", value: "sad", color: "#f97316" },
  { icon: "circle", label: "Neutral", value: "neutral", color: "#6b7280" },
  { icon: "sun.max", label: "Happy", value: "happy", color: "#22c55e" },
  {
    icon: "sparkles",
    label: "Very Happy",
    value: "very-happy",
    color: "#eab308",
  },
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
    } catch {
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
    } catch {
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

  const selectedMood = MOOD_OPTIONS.find((opt) => opt.value === mood);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with date and mood */}
        <View style={styles.header}>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>

          {/* Mood Selector */}
          <View style={styles.moodBar}>
            {MOOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.moodIcon,
                  mood === option.value && styles.moodIconSelected,
                ]}
                onPress={() => setMood(option.value)}
              >
                <IconSymbol
                  size={20}
                  name={option.icon as any}
                  color={mood === option.value ? option.color : "#9ca3af"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title Input - Minimal */}
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#9ca3af"
          maxLength={100}
        />

        {/* Content Input - Minimal */}
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor="#d1d5db"
          multiline
          textAlignVertical="top"
        />

        {/* Images Section */}
        {images.length > 0 && (
          <View style={styles.imagesSection}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.image}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <IconSymbol size={16} name="xmark" color="white" />
                </TouchableOpacity>
                <TextInput
                  style={styles.imageCaption}
                  value={image.caption}
                  onChangeText={(text) => updateImageCaption(index, text)}
                  placeholder="Add caption..."
                  placeholderTextColor="#9ca3af"
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={showImageOptions}
          >
            <IconSymbol size={22} name="photo" color="#6b7280" />
          </TouchableOpacity>

          {selectedMood && (
            <View style={styles.selectedMoodIndicator}>
              <IconSymbol
                size={18}
                name={selectedMood.icon as any}
                color={selectedMood.color}
              />
              <Text style={styles.selectedMoodText}>{selectedMood.label}</Text>
            </View>
          )}
        </View>

        <View style={styles.toolbarRight}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <IconSymbol size={18} name="checkmark" color="white" />
            <Text style={styles.saveButtonText}>
              {isEditing ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  date: {
    fontSize: 13,
    color: "#9ca3af",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  moodBar: {
    flexDirection: "row",
    gap: 12,
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  moodIconSelected: {
    backgroundColor: "#f0f9ff",
    borderWidth: 2,
    borderColor: "#e0f2fe",
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    fontSize: 17,
    lineHeight: 28,
    color: "#374151",
    minHeight: 300,
    padding: 0,
  },
  imagesSection: {
    marginTop: 24,
    gap: 16,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageCaption: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedMoodIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
  },
  selectedMoodText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  toolbarRight: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});
