import { SignOutButton } from "@/components/SignOutButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useStreaks } from "@/hooks/use-streaks";
import { useUser } from "@clerk/clerk-expo";
import { Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
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
          paddingTop: insets.top,
        }}
      >
        <YStack pb={insets.bottom + 100}>
          {/* Profile Header Section */}
          <YStack style={{ alignItems: "center" }} py="$8" gap="$5">
            {/* Profile Picture */}
            <View
              style={{
                borderRadius: 70,
                overflow: "hidden",
                width: 140,
                height: 140,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
              }}
            >
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <Text fontSize={48} fontWeight="600" color="$color12">
                  {getUserInitials()}
                </Text>
              )}
            </View>

            {/* Name */}
            <YStack style={{ alignItems: "center" }} gap="$2">
              <H1 fontSize={32} fontWeight="700">
                {getFullName()}
              </H1>
              {user?.primaryEmailAddress?.emailAddress && (
                <Text fontSize={15} color="$color10">
                  {user.primaryEmailAddress.emailAddress}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Stats Section */}
          <XStack
            px="$6"
            py="$6"
            gap="$4"
            style={{ justifyContent: "space-around" }}
          >
            {/* Current Streak */}
            <YStack style={{ alignItems: "center" }} gap="$2" flex={1}>
              <XStack gap="$2" style={{ alignItems: "center" }}>
                <IconSymbol size={20} name="flame.fill" color="#f59e0b" />
                <Text fontSize={32} fontWeight="700" color="$color12">
                  {currentStreak}
                </Text>
              </XStack>
              <Text fontSize={13} color="$color10" fontWeight="500">
                Day Streak
              </Text>
            </YStack>

            {/* Best Streak */}
            <YStack style={{ alignItems: "center" }} gap="$2" flex={1}>
              <XStack gap="$2" style={{ alignItems: "center" }}>
                <IconSymbol size={20} name="trophy.fill" color="#3b82f6" />
                <Text fontSize={32} fontWeight="700" color="$color11">
                  {longestStreak}
                </Text>
              </XStack>
              <Text fontSize={13} color="$color10" fontWeight="500">
                Best Streak
              </Text>
            </YStack>
          </XStack>

          {/* Settings Section */}
          <YStack px="$6" pt="$8" gap="$6">
            <H2 fontSize={20} fontWeight="600" color="$color11">
              Account
            </H2>
            <SignOutButton />
          </YStack>
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
    width: 140,
    height: 140,
  },
});
