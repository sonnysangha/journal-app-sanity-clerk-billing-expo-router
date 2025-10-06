import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { H1, Text, View, YStack } from "tamagui";

export default function AIChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <YStack gap="$4" style={{ alignItems: "center" }} mt="$8">
          <H1 fontSize="$8" fontWeight="600" color="$color12">
            AI Chat
          </H1>
          <Text fontSize="$4" color="$color10" style={{ textAlign: "center" }}>
            Chat with your AI journal assistant
          </Text>
          <Text
            fontSize="$3"
            color="$color9"
            style={{ textAlign: "center" }}
            mt="$4"
          >
            Coming soon...
          </Text>
        </YStack>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
