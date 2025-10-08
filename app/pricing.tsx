import { Colors } from "@/constants/theme";
import { Protect, useAuth } from "@clerk/clerk-expo";
import { PricingTable, UserProfile } from "@clerk/clerk-expo/web";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PricingWeb() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const upgradeContent = (
    <View style={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PREMIUM PLANS</Text>
          </View>
        </View>

        <Text style={styles.title}>Elevate Your Journaling</Text>

        <Text style={styles.subtitle}>
          Unlock AI-powered insights, advanced analytics, and premium features
          to transform your journaling experience
        </Text>
      </View>

      {/* Pricing Table Section */}
      <View style={styles.pricingSection}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        <View style={styles.pricingContainer}>
          {Platform.OS === "web" ? (
            <View style={styles.pricingWrapper}>
              <PricingTable
                newSubscriptionRedirectUrl="http://localhost:8081/plan-changed-success"
                appearance={{
                  variables: {
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: "16px",
                    fontWeight: {
                      normal: 400,
                      medium: 500,
                      bold: 600,
                    },
                  },
                }}
              />
            </View>
          ) : (
            <View style={styles.nativeMessage}>
              <Text style={styles.nativeMessageIcon}>💳</Text>
              <Text style={styles.nativeMessageText}>
                Please use the web version to manage your subscription
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Everything You Get with Pro</Text>
        <Text style={styles.featuresSubtitle}>
          Premium features designed to enhance your journaling
        </Text>

        <View style={styles.featuresGrid}>
          {[
            {
              icon: "🤖",
              title: "AI Chat Assistant",
              description: "Get intelligent insights from your journal entries",
            },
            {
              icon: "📊",
              title: "Advanced Analytics",
              description: "Track patterns and trends in your journaling",
            },
            {
              icon: "🔒",
              title: "Priority Support",
              description: "Get help when you need it most",
            },
            {
              icon: "☁️",
              title: "Unlimited Storage",
              description: "Never worry about space again",
            },
            {
              icon: "🎨",
              title: "Premium Themes",
              description: "Customize your experience",
            },
            {
              icon: "🚀",
              title: "Early Access",
              description: "Be first to try new features",
            },
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Trust Badge */}
      <View style={styles.trustBadge}>
        <Text style={styles.trustIcon}>🔐</Text>
        <View style={styles.trustTextContainer}>
          <Text style={styles.trustTitle}>Secure & Private</Text>
          <Text style={styles.trustText}>
            Your data is encrypted and protected. Cancel anytime.
          </Text>
        </View>
      </View>
    </View>
  );

  const manageContent = (
    <View style={styles.contentContainer}>
      {/* Hero Section for Pro Users */}
      <View style={styles.heroSection}>
        <View style={styles.badgeContainer}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO MEMBER</Text>
          </View>
        </View>

        <Text style={styles.title}>Manage Your Subscription</Text>

        <Text style={styles.subtitle}>
          Update your plan, payment method, and billing information
        </Text>
      </View>

      {/* User Profile Section */}
      {Platform.OS === "web" ? (
        <View style={styles.profileSection}>
          <View style={styles.profileWrapper}>
            <UserProfile
              appearance={{
                variables: {
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                },
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.nativeMessage}>
          <Text style={styles.nativeMessageIcon}>⚙️</Text>
          <Text style={styles.nativeMessageText}>
            Please use the web version to manage your subscription settings
          </Text>
        </View>
      )}
      {/* Pro Features Reminder */}
      <View style={styles.proFeaturesSection}>
        <Text style={styles.proFeaturesTitle}>Your Pro Benefits</Text>

        <View style={styles.proBenefitsList}>
          {[
            "🤖 AI Chat Assistant",
            "📊 Advanced Analytics",
            "🔒 Priority Support",
            "☁️ Unlimited Storage",
            "🎨 Premium Themes",
            "🚀 Early Access to Features",
          ].map((benefit, index) => (
            <View key={index} style={styles.proBenefitItem}>
              <Text style={styles.proBenefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.supportBadge}>
        <Text style={styles.supportIcon}>💬</Text>
        <View style={styles.supportTextContainer}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Our priority support team is here for you. Contact us anytime.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const content = (
    <Protect plan="pro" fallback={upgradeContent}>
      {manageContent}
    </Protect>
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <div style={{ overflow: "auto", height: "100vh" }}>{content}</div>
      </View>
    );
  }

  return <ScrollView style={styles.container}>{content}</ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingBottom: 80,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  badgeContainer: {
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "rgba(144, 75, 255, 0.1)",
    borderColor: "rgba(144, 75, 255, 0.3)",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#904BFF",
  },
  proBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "rgba(144, 75, 255, 0.15)",
    borderColor: "rgba(144, 75, 255, 0.4)",
  },
  proBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#904BFF",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: -1.5,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 32,
    maxWidth: 600,
    fontWeight: "400",
    color: "#666666",
  },
  pricingSection: {
    paddingHorizontal: 24,
    marginBottom: 64,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 32,
    textAlign: "center",
    letterSpacing: -0.5,
    color: Colors.light.text,
  },
  pricingContainer: {
    marginBottom: 24,
  },
  pricingWrapper: {
    borderRadius: 24,
    overflow: "hidden",
  },
  nativeMessage: {
    padding: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    borderWidth: 1,
    backgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
    marginHorizontal: 24,
  },
  nativeMessageIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  nativeMessageText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 26,
    color: Colors.light.text,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 64,
  },
  featuresTitle: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.5,
    color: Colors.light.text,
  },
  featuresSubtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 28,
    color: "#666666",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
  },
  featureCard: {
    width: Platform.OS === "web" ? 340 : "100%",
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(144, 75, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: -0.3,
    color: Colors.light.text,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
    color: "#666666",
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 28,
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 64,
    gap: 20,
    borderWidth: 1,
    backgroundColor: "#f0f9ff",
    borderColor: "#e0f2fe",
  },
  trustIcon: {
    fontSize: 36,
  },
  trustTextContainer: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.light.text,
  },
  trustText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666666",
  },
  profileSection: {
    paddingHorizontal: 24,
    marginBottom: 64,
  },
  profileWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  proFeaturesSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  proFeaturesTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
    color: Colors.light.text,
  },
  proBenefitsList: {
    gap: 16,
  },
  proBenefitItem: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
    }),
  },
  proBenefitText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  supportBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 28,
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 28,
    gap: 20,
    borderWidth: 1,
    backgroundColor: "#fef3c7",
    borderColor: "#fde68a",
  },
  supportIcon: {
    fontSize: 36,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.light.text,
  },
  supportText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666666",
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 200,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)",
        cursor: "pointer",
      },
    }),
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});
