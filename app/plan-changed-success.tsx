import { Colors } from "@/constants/theme";
import { Protect, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function PlanChangedSuccess() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isLoaded } = useUser();
  const router = useRouter();

  const handleReturn = async () => {
    if (Platform.OS === "web") {
      // Deep link to the native app using the custom scheme defined in app.config.ts
      // >>A development build is required to test this<<
      const appUrl = "sanityclerkbillingjournalappexpo://";

      try {
        // Try to open the app
        await Linking.openURL(appUrl);

        // Close the web window after a short delay
        setTimeout(() => {
          window.close();
        }, 500);
      } catch {
        console.log("Could not open app, user might not have it installed");
        // Optionally show a message to the user
      }
    } else {
      // If running in native app, just navigate
      router.replace("/");
    }
  };

  const content = (
    <View style={styles.contentContainer}>
      {/* Success Card */}
      <View
        style={[
          styles.successCard,
          {
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            borderColor: isDark ? "#2a2a3e" : "#e5e7eb",
          },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        {/* Success Message */}
        <Text
          style={[
            styles.title,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
        >
          Subscription Updated!
        </Text>

        <Text
          style={[styles.subtitle, { color: isDark ? "#a0a0a0" : "#666666" }]}
        >
          Your subscription has been successfully changed
        </Text>

        {/* Plan Status */}
        {!isLoaded ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
          </View>
        ) : (
          <Protect
            plan="pro"
            fallback={
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>Free Plan</Text>
              </View>
            }
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Pro Plan</Text>
            </View>
          </Protect>
        )}

        {/* Return to the app text */}
        <Text style={styles.returnToAppText}>
          You can now close this page & return to the app to continue using your
          PRO Benefits!
        </Text>

        {/* Return Button */}
        <Pressable
          style={({ pressed }) => [
            styles.returnButton,
            {
              opacity: pressed ? 0.8 : 1,
              backgroundColor: "#10B981",
            },
          ]}
          onPress={handleReturn}
        >
          <Text style={styles.returnButtonText}>Return to App</Text>
        </Pressable>
      </View>
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? Colors.dark.background
              : Colors.light.background,
          },
        ]}
      >
        <div style={{ display: "flex", minHeight: "100vh" }}>{content}</div>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  userButtonContainer: {
    position: "absolute",
    top: Platform.OS === "web" ? 24 : 60,
    right: 24,
    zIndex: 10,
  },
  returnToAppText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: "400",
    color: "#10B981",
  },
  successCard: {
    maxWidth: 440,
    width: "100%",
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
    }),
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 4px 24px rgba(16, 185, 129, 0.3)",
      },
    }),
  },
  successIcon: {
    fontSize: 44,
    color: "#ffffff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: "400",
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  planBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  planBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  proBadgeIcon: {
    fontSize: 18,
  },
  proBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tint,
  },
  returnButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  returnButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
