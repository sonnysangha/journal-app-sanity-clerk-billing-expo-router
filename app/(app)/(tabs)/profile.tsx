import { SignOutButton } from "@/components/SignOutButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useStreaks } from "@/hooks/use-streaks";
import { Protect, useUser } from "@clerk/clerk-expo";
import { Image, Linking, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H1,
  H2,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const insets = useSafeAreaInsets();
  const { currentStreak, longestStreak } = useStreaks();

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </View>
    );
  }

  const getUserInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getFullName = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user?.username || "User";
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingTop: insets.top + 20,
        }}
      >
        <YStack px="$4" gap="$4" pb={insets.bottom + 100}>
          {/* Profile Header Card */}
          <Card
            elevate
            size="$4"
            bordered
            bg="$background"
            borderColor="$borderColor"
            padding="$6"
          >
            <YStack gap="$4" style={{ alignItems: "center" }}>
              {/* Profile Picture */}
              <View
                style={{
                  borderRadius: 60,
                  overflow: "hidden",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e5e7eb",
                }}
              >
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text fontSize={42} fontWeight="700" color="$color11">
                    {getUserInitials()}
                  </Text>
                )}
              </View>

              {/* Name & Email */}
              <YStack style={{ alignItems: "center" }} gap="$2">
                <H1
                  fontSize={28}
                  fontWeight="700"
                  style={{ textAlign: "center" }}
                >
                  {getFullName()}
                </H1>
                {user?.primaryEmailAddress?.emailAddress && (
                  <Text fontSize={14} color="$color10">
                    {user.primaryEmailAddress.emailAddress}
                  </Text>
                )}
              </YStack>

              {/* Plan Badge */}
              <Protect
                plan="pro"
                fallback={
                  <View style={styles.planBadge}>
                    <Text fontSize={13} fontWeight="600" color="$color11">
                      Free Plan
                    </Text>
                  </View>
                }
              >
                <View style={styles.proPlanBadge}>
                  <Text fontSize={13} fontWeight="700" color="#904BFF">
                    ✨ Pro Plan
                  </Text>
                </View>
              </Protect>
            </YStack>
          </Card>

          {/* Stats Cards */}
          <XStack gap="$4">
            {/* Current Streak Card */}
            <Card
              elevate
              size="$4"
              bordered
              bg="$background"
              borderColor="$borderColor"
              padding="$5"
              flex={1}
            >
              <YStack gap="$3" style={{ alignItems: "center" }}>
                <View style={styles.streakIconContainer}>
                  <IconSymbol size={24} name="flame.fill" color="#f59e0b" />
                </View>
                <Text fontSize={36} fontWeight="800" color="$color12">
                  {currentStreak}
                </Text>
                <Text fontSize={12} color="$color10" fontWeight="600">
                  Day Streak
                </Text>
              </YStack>
            </Card>

            {/* Best Streak Card */}
            <Card
              elevate
              size="$4"
              bordered
              bg="$background"
              borderColor="$borderColor"
              padding="$5"
              flex={1}
            >
              <YStack gap="$3" style={{ alignItems: "center" }}>
                <View style={styles.bestStreakIconContainer}>
                  <IconSymbol size={24} name="trophy.fill" color="#904BFF" />
                </View>
                <Text fontSize={36} fontWeight="800" color="$color12">
                  {longestStreak}
                </Text>
                <Text fontSize={12} color="$color10" fontWeight="600">
                  Best Streak
                </Text>
              </YStack>
            </Card>
          </XStack>

          {/* Subscription Card */}
          <Card
            elevate
            size="$4"
            bordered
            bg="$background"
            borderColor="$borderColor"
            padding="$5"
          >
            <YStack gap="$4">
              <YStack gap="$2">
                <H2 fontSize={18} fontWeight="700" color="$color12">
                  Subscription
                </H2>
                <Text fontSize={13} color="$color10" lineHeight={18}>
                  Manage your plan and billing settings
                </Text>
              </YStack>
              <Button
                size="$4"
                bg="$purple9"
                color="white"
                pressStyle={{ opacity: 0.8 }}
                fontWeight="600"
                onPress={() => {
                  Linking.openURL("http://localhost:8081/pricing");
                }}
              >
                View Plans & Pricing
              </Button>
            </YStack>
          </Card>

          {/* Account Section */}
          <Card
            elevate
            size="$4"
            bordered
            bg="$background"
            borderColor="$borderColor"
            padding="$5"
          >
            <YStack gap="$4">
              <YStack gap="$2">
                <H2 fontSize={18} fontWeight="700" color="$color12">
                  Account
                </H2>
                <Text fontSize={13} color="$color10" lineHeight={18}>
                  Manage your account settings
                </Text>
              </YStack>
              <SignOutButton />
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  planBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
  },
  proPlanBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(144, 75, 255, 0.4)",
    backgroundColor: "rgba(144, 75, 255, 0.15)",
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  bestStreakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(144, 75, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
