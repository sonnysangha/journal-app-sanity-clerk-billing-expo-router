import DailyPromptCards from "@/components/DailyPromptCards";
import Logo from "@/components/Logo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useStreaks } from "@/hooks/use-streaks";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Card,
  H1,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    currentStreak,
    longestStreak,
    isActive,
    statusMessage,
    daysUntilNextMilestone,
    nextMilestone,
    isLoading: streaksLoading,
  } = useStreaks();

  // Get current date information using modern functional approach
  const now = new Date();
  const dayOfWeek = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Get greeting based on time of day - functional approach
  const getGreeting = (hour: number = now.getHours()): string => {
    const greetings = {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening",
    };

    return hour < 12
      ? greetings.morning
      : hour < 17
      ? greetings.afternoon
      : greetings.evening;
  };

  // Get user's name with nullish coalescing
  const getUserName = (): string =>
    user?.firstName ?? user?.username ?? "there";

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container} px="$4">
      <ScrollView
        style={{
          ...styles.content,
          paddingTop: insets.top,
        }}
      >
        {/* Header with date */}
        <YStack gap="$2" style={{ alignItems: "center" }} mt="$4">
          <Logo />
          <Text
            fontSize="$2"
            color="$color10"
            textTransform="uppercase"
            fontWeight="500"
          >
            {dayOfWeek} {date}
          </Text>
        </YStack>

        {/* Greeting */}
        <YStack gap="$2" style={{ alignItems: "center" }} mb="$4">
          <H1
            fontSize="$8"
            fontWeight="600"
            style={{ textAlign: "center" }}
            color="$color12"
          >
            {getGreeting()}, {getUserName()}!
          </H1>
        </YStack>

        {/* Weekly Calendar Strip */}
        <XStack style={{ justifyContent: "space-between" }} mb="$6">
          {Array.from({ length: 7 }, (_, i) => {
            // Calculate date for this day of the week
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + i);

            const dayData = {
              dayName: startOfWeek.toLocaleDateString("en-US", {
                weekday: "short",
              }),
              dayNumber: startOfWeek.getDate(),
              isToday: startOfWeek.toDateString() === now.toDateString(),
            };

            return (
              <YStack key={i} gap="$1" style={{ alignItems: "center" }}>
                <Text fontSize="$2" color="$color10" fontWeight="500">
                  {dayData.dayName}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    dayData.isToday && styles.todayCircle,
                  ]}
                >
                  <Text
                    fontSize="$3"
                    color={dayData.isToday ? "white" : "$color11"}
                    fontWeight={dayData.isToday ? "600" : "400"}
                  >
                    {dayData.dayNumber}
                  </Text>
                </View>
              </YStack>
            );
          })}
        </XStack>

        {/* Streak Section */}
        {!streaksLoading && (
          <YStack gap="$3" mb="$6">
            <Card
              elevate
              size="$4"
              bordered
              bg="$background"
              borderColor="$borderColor"
              padding="$5"
            >
              <XStack
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Current Streak */}
                <YStack gap="$2" style={{ alignItems: "center" }} flex={1}>
                  <Text fontSize="$2" color="$color10" fontWeight="600">
                    CURRENT STREAK
                  </Text>
                  <XStack gap="$2" style={{ alignItems: "baseline" }}>
                    <Text fontSize="$10" fontWeight="700" color="$color12">
                      {currentStreak}
                    </Text>
                    <Text fontSize="$5" color="$color11" fontWeight="500">
                      {currentStreak === 1 ? "day" : "days"}
                    </Text>
                  </XStack>
                  <View style={{ marginTop: 4 }}>
                    <IconSymbol
                      size={32}
                      name={isActive ? "flame.fill" : "zzz"}
                      color={isActive ? "#f59e0b" : "#9ca3af"}
                    />
                  </View>
                </YStack>

                {/* Divider */}
                <View
                  style={{
                    width: 1,
                    height: 60,
                    backgroundColor: "#e5e7eb",
                    marginHorizontal: 16,
                  }}
                />

                {/* Best Streak */}
                <YStack gap="$2" style={{ alignItems: "center" }} flex={1}>
                  <Text fontSize="$2" color="$color10" fontWeight="600">
                    BEST STREAK
                  </Text>
                  <XStack gap="$2" style={{ alignItems: "baseline" }}>
                    <Text fontSize="$10" fontWeight="700" color="$color11">
                      {longestStreak}
                    </Text>
                    <Text fontSize="$5" color="$color10" fontWeight="500">
                      {longestStreak === 1 ? "day" : "days"}
                    </Text>
                  </XStack>
                  <View style={{ marginTop: 4 }}>
                    <IconSymbol size={28} name="trophy.fill" color="#fbbf24" />
                  </View>
                </YStack>
              </XStack>
            </Card>

            {/* Motivational Messages Outside Card */}
            <YStack gap="$2" style={{ alignItems: "center" }} pt="$2">
              <Text
                fontSize="$4"
                color="$color11"
                fontWeight="500"
                style={{ textAlign: "center" }}
              >
                {statusMessage}
              </Text>

              {daysUntilNextMilestone > 0 && (
                <XStack gap="$2" style={{ alignItems: "center" }}>
                  <IconSymbol size={16} name="target" color="#6b7280" />
                  <Text fontSize="$3" color="$color10">
                    {daysUntilNextMilestone} days until {nextMilestone}-day
                    milestone!
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        )}

        {/* Daily Prompts Section */}
        <DailyPromptCards />

        {/* Action Buttons */}
        <YStack gap="$3" mb="$6">
          {/* Add New Entry Button */}
          <Pressable
            onPress={() => router.push("/new-entry")}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Card
              elevate
              size="$4"
              bordered
              bg="$blue9"
              borderColor="$blue9"
              padding="$4"
            >
              <XStack
                gap="$3"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <IconSymbol size={24} name="plus.circle.fill" color="white" />
                <Text fontSize="$5" fontWeight="600" color="white">
                  Add New Entry
                </Text>
              </XStack>
            </Card>
          </Pressable>

          {/* View Previous Entries Button */}
          <Pressable
            onPress={() => router.push("/(app)/(tabs)/entries")}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Card
              elevate
              size="$4"
              bordered
              bg="white"
              borderColor="$borderColor"
              padding="$4"
            >
              <XStack
                gap="$3"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <IconSymbol size={24} name="book.fill" color="#3b82f6" />
                <Text fontSize="$5" fontWeight="600" color="$color12">
                  View Entries
                </Text>
              </XStack>
            </Card>
          </Pressable>
        </YStack>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderColor: "#d1d5db",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
