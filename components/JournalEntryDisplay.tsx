import { urlFor } from "@/lib/sanity/client";
import { PortableText } from "@portabletext/react-native";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface JournalEntryDisplayProps {
  entry: {
    _id: string;
    title?: string;
    content: any[]; // Portable Text content
    mood: string;
    createdAt: string;
    aiGeneratedCategory?: {
      title: string;
      color?: string;
    };
  };
}

const MOOD_EMOJIS: Record<string, string> = {
  "very-sad": "😢",
  sad: "😞",
  neutral: "😐",
  happy: "😊",
  "very-happy": "😄",
};

export default function JournalEntryDisplay({
  entry,
}: JournalEntryDisplayProps) {
  const moodEmoji = MOOD_EMOJIS[entry.mood] || "😐";
  const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Custom components for Portable Text rendering
  const portableTextComponents = {
    types: {
      image: ({ value }: { value: any }) => {
        if (!value?.asset) return null;

        // Use official Sanity image URL builder with optimizations
        const imageUrl = urlFor(value)
          .width(800)
          .height(400)
          .fit("crop")
          .auto("format")
          .url();

        return (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
            {value.caption && (
              <Text style={styles.imageCaption}>{value.caption}</Text>
            )}
          </View>
        );
      },
    },
    block: {
      // Custom block styles
      normal: ({ children }: { children: React.ReactNode }) => (
        <Text style={styles.paragraph}>{children}</Text>
      ),
      h1: ({ children }: { children: React.ReactNode }) => (
        <Text style={styles.heading1}>{children}</Text>
      ),
      h2: ({ children }: { children: React.ReactNode }) => (
        <Text style={styles.heading2}>{children}</Text>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <View style={styles.blockquote}>
          <Text style={styles.blockquoteText}>{children}</Text>
        </View>
      ),
    },
    marks: {
      // Custom text formatting
      strong: ({ children }: { children: React.ReactNode }) => (
        <Text style={styles.bold}>{children}</Text>
      ),
      em: ({ children }: { children: React.ReactNode }) => (
        <Text style={styles.italic}>{children}</Text>
      ),
      link: ({ children }: { children: React.ReactNode }) => (
        <Text style={styles.link}>{children}</Text>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <View style={styles.bulletList}>{children}</View>
      ),
      number: ({ children }: { children: React.ReactNode }) => (
        <View style={styles.numberedList}>{children}</View>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <View style={styles.listItemContent}>{children}</View>
        </View>
      ),
      number: ({
        children,
        index,
      }: {
        children: React.ReactNode;
        index: number;
      }) => (
        <View style={styles.listItem}>
          <Text style={styles.bullet}>{index + 1}.</Text>
          <View style={styles.listItemContent}>{children}</View>
        </View>
      ),
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{moodEmoji}</Text>
          </View>
        </View>

        {entry.title && <Text style={styles.title}>{entry.title}</Text>}

        {entry.aiGeneratedCategory && (
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: entry.aiGeneratedCategory.color || "#e1e5e9" },
            ]}
          >
            <Text style={styles.categoryText}>
              {entry.aiGeneratedCategory.title}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <PortableText
          value={entry.content}
          components={portableTextComponents}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  moodContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  moodEmoji: {
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  contentContainer: {
    // Container for portable text content
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 12,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    marginTop: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    paddingLeft: 16,
    marginVertical: 12,
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    borderRadius: 8,
  },
  blockquoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  bulletList: {
    marginVertical: 8,
  },
  numberedList: {
    marginVertical: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
    minWidth: 20,
  },
  listItemContent: {
    flex: 1,
  },
  imageContainer: {
    marginVertical: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  imageCaption: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
});
