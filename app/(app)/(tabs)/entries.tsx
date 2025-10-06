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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export default function EntriesScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <ActivityIndicator size="large" color="#3b82f6" />
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
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 20 },
        ]}
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
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for FAB
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#6b7280",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  dayGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  entryCardContainer: {
    marginBottom: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  entryCard: {
    backgroundColor: "transparent",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    letterSpacing: -0.3,
  },
  entryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 12,
  },
  moodEmoji: {
    fontSize: 24,
  },
  deleteButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonSmallText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 18,
  },
  entryPreview: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 26,
    marginBottom: 16,
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
