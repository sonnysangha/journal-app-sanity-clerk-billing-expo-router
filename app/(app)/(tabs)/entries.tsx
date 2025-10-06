import CreateEntryButton from "@/components/CreateEntryButton";
import { getMoodConfig } from "@/lib/constants/moods";
import { fetchJournalEntries } from "@/lib/sanity/journal";
import { useUser } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
              const moodConfig = getMoodConfig(entry.mood);
              const preview =
                entry.content?.[0]?.children?.[0]?.text?.slice(0, 100) ||
                "No content";

              return (
                <View key={entry._id} style={styles.entryCardContainer}>
                  <TouchableOpacity
                    style={styles.entryCard}
                    onPress={() => handleEntryPress(entry._id)}
                  >
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {entry.title ||
                          new Date(entry.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </Text>
                      <View style={styles.entryActions}>
                        <MaterialIcons
                          size={20}
                          name={moodConfig.icon as any}
                          color={moodConfig.color}
                        />
                        <Text
                          style={[
                            styles.moodLabel,
                            { color: moodConfig.color },
                          ]}
                        >
                          {moodConfig.label}
                        </Text>
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
    gap: 8,
    marginLeft: 12,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: "600",
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
