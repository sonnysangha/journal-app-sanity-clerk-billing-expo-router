import CreateEntryButton from "@/components/CreateEntryButton";
import { deleteJournalEntry, fetchJournalEntries } from "@/lib/sanity/journal";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "tamagui";

interface JournalEntry {
  _id: string;
  title?: string;
  content: any[];
  mood: string;
  createdAt: string;
  aiGeneratedCategory?: {
    title: string;
    color?: string;
  };
}

interface GroupedEntries {
  [date: string]: JournalEntry[];
}

const MOOD_EMOJIS: Record<string, string> = {
  "very-sad": "😢",
  sad: "😞",
  neutral: "😐",
  happy: "😊",
  "very-happy": "😄",
};

export default function JournalListScreen() {
  const { user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = async () => {
    if (!user?.id) return;

    try {
      const fetchedEntries = await fetchJournalEntries(user.id);
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Failed to load journal entries:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEntries();
  };

  // Group entries by date
  const groupEntriesByDate = (entries: JournalEntry[]): GroupedEntries => {
    return entries.reduce((groups: GroupedEntries, entry) => {
      const date = new Date(entry.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const handleEntryPress = (entryId: string) => {
    router.push(`/entry/${entryId}`);
  };

  const handleDeleteEntry = (entryId: string, entryTitle?: string) => {
    Alert.alert(
      "Delete Entry?",
      `Are you sure you want to delete ${
        entryTitle ? `"${entryTitle}"` : "this entry"
      }? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDeleteEntry(entryId),
        },
      ]
    );
  };

  const confirmDeleteEntry = async (entryId: string) => {
    try {
      await deleteJournalEntry(entryId);
      // Refresh the entries list
      loadEntries();
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
      Alert.alert(
        "Error",
        "Failed to delete the journal entry. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your journal entries...</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Journal Entries Yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the + button to write your first journal entry!
        </Text>
        <CreateEntryButton />
      </View>
    );
  }

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <View bg="$background" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Your Journal</Text>

        {Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <View key={date} style={styles.dayGroup}>
            <Text style={styles.dateHeader}>
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            {dayEntries.map((entry) => {
              const moodEmoji = MOOD_EMOJIS[entry.mood] || "😐";
              const preview =
                entry.content?.[0]?.children?.[0]?.text?.slice(0, 100) ||
                "No content";

              return (
                <View key={entry._id} style={styles.entryCardContainer}>
                  <TouchableOpacity
                    style={styles.entryCard}
                    onPress={() => handleEntryPress(entry._id)}
                    onLongPress={() =>
                      handleDeleteEntry(entry._id, entry.title)
                    }
                  >
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {entry.title ||
                          `${moodEmoji} ${new Date(
                            entry.createdAt
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`}
                      </Text>
                      <View style={styles.entryActions}>
                        <Text style={styles.moodEmoji}>{moodEmoji}</Text>
                        <TouchableOpacity
                          style={styles.deleteButtonSmall}
                          onPress={() =>
                            handleDeleteEntry(entry._id, entry.title)
                          }
                        >
                          <Text style={styles.deleteButtonSmallText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.entryPreview}>
                      {preview}
                      {preview.length >= 100 ? "..." : ""}
                    </Text>

                    {entry.aiGeneratedCategory && (
                      <View
                        style={[
                          styles.categoryTag,
                          {
                            backgroundColor:
                              entry.aiGeneratedCategory.color || "#e1e5e9",
                          },
                        ]}
                      >
                        <Text style={styles.categoryText}>
                          {entry.aiGeneratedCategory.title}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <CreateEntryButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Space for FAB
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  dayGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  entryCardContainer: {
    marginBottom: 12,
  },
  entryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  entryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moodEmoji: {
    fontSize: 20,
  },
  deleteButtonSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonSmallText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 16,
  },
  entryPreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
});
