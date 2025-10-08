import { generateAPIUrl } from "@/utils";
import { useChat } from "@ai-sdk/react";
import { Protect, useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { DefaultChatTransport } from "ai";
import { useRouter } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, H2, Text, View, YStack } from "tamagui";

export default function AIChatScreen() {
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const router = useRouter();
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
      headers: async () => ({
        "x-user-id": user?.id || "",
      }),
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  const handleSend = () => {
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <Text color="$red10">{error.message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Protect
        plan="pro"
        fallback={
          <View style={styles.content}>
            <YStack
              px="$4"
              py="$8"
              gap="$6"
              style={{ alignItems: "center", justifyContent: "center" }}
              flex={1}
            >
              <View style={styles.lockedIconContainer}>
                <MaterialIcons name="lock" size={64} color="#9ca3af" />
              </View>

              <YStack gap="$3" style={{ alignItems: "center" }}>
                <H2
                  fontSize={28}
                  fontWeight="700"
                  style={{ textAlign: "center" }}
                >
                  AI Chat Assistant
                </H2>
                <Text
                  fontSize={16}
                  color="$color10"
                  style={{ textAlign: "center", lineHeight: 24 }}
                  px="$4"
                >
                  Get intelligent insights, personalized journaling tips, and
                  thoughtful conversations about your entries
                </Text>
              </YStack>

              <Card
                elevate
                size="$4"
                bordered
                bg="$background"
                borderColor="$borderColor"
                padding="$5"
                width="90%"
                maxWidth={400}
              >
                <YStack gap="$4">
                  <YStack gap="$3">
                    <View style={styles.featureRow}>
                      <MaterialIcons
                        name="smart-toy"
                        size={20}
                        color="#904BFF"
                      />
                      <Text fontSize={15} color="$color11" flex={1}>
                        Chat with AI about your journal entries
                      </Text>
                    </View>
                    <View style={styles.featureRow}>
                      <MaterialIcons
                        name="insights"
                        size={20}
                        color="#904BFF"
                      />
                      <Text fontSize={15} color="$color11" flex={1}>
                        Get personalized insights and suggestions
                      </Text>
                    </View>
                    <View style={styles.featureRow}>
                      <MaterialIcons
                        name="psychology"
                        size={20}
                        color="#904BFF"
                      />
                      <Text fontSize={15} color="$color11" flex={1}>
                        Discover patterns in your mood and habits
                      </Text>
                    </View>
                    <View style={styles.featureRow}>
                      <MaterialIcons
                        name="lightbulb"
                        size={20}
                        color="#904BFF"
                      />
                      <Text fontSize={15} color="$color11" flex={1}>
                        Receive journaling tips and prompts
                      </Text>
                    </View>
                  </YStack>

                  <Button
                    size="$4"
                    bg="$purple9"
                    color="white"
                    fontWeight="600"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => {
                      Linking.openURL("http://localhost:8081/pricing");
                    }}
                  >
                    Upgrade to Pro
                  </Button>
                </YStack>
              </Card>

              <Text
                fontSize={13}
                color="$color9"
                style={{ textAlign: "center" }}
              >
                Unlock AI Chat and more premium features
              </Text>
            </YStack>
          </View>
        }
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View style={styles.content}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.length === 0 ? (
                <YStack gap="$4" style={{ alignItems: "center" }} mt="$12">
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <MaterialIcons name="smart-toy" size={40} color="#666" />
                    </View>
                  </View>
                  <Text
                    fontSize="$6"
                    fontWeight="600"
                    color="$color11"
                    style={{ textAlign: "center" }}
                  >
                    Start a conversation
                  </Text>
                  <Text
                    fontSize="$4"
                    color="$color9"
                    style={{ textAlign: "center", lineHeight: 22 }}
                    px="$6"
                  >
                    Ask me about journaling tips, mood tracking, or just chat
                    about your day
                  </Text>
                </YStack>
              ) : (
                messages.map((m) => (
                  <View
                    key={m.id}
                    style={[
                      styles.messageContainer,
                      m.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
                    ]}
                  >
                    {m.role === "assistant" && (
                      <View style={styles.messageAvatar}>
                        <MaterialIcons
                          name="smart-toy"
                          size={20}
                          color="#666"
                        />
                      </View>
                    )}
                    <View
                      style={[
                        styles.messageBubble,
                        m.role === "user"
                          ? styles.userBubble
                          : styles.assistantBubble,
                      ]}
                    >
                      {m.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <Markdown
                                key={`${m.id}-${i}`}
                                style={{
                                  body: {
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                    fontSize: 16,
                                    lineHeight: 22,
                                  },
                                  paragraph: {
                                    marginTop: 0,
                                    marginBottom: 0,
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                  },
                                  strong: {
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                    fontWeight: "bold",
                                  },
                                  em: {
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                    fontStyle: "italic",
                                  },
                                  link: {
                                    color:
                                      m.role === "user" ? "#cfe2ff" : "#904BFF",
                                  },
                                  bullet_list: {
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                  },
                                  ordered_list: {
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                  },
                                  list_item: {
                                    color:
                                      m.role === "user" ? "white" : "#1f2937",
                                  },
                                }}
                              >
                                {part.text}
                              </Markdown>
                            );
                          case "tool-getAllUserJournalEntries":
                            return (
                              <View
                                key={`${m.id}-${i}`}
                                style={styles.toolInvocation}
                              >
                                <MaterialIcons
                                  name="search"
                                  size={14}
                                  color="#666"
                                />
                                <Text fontSize="$2" color="$color9" ml="$2">
                                  Reviewing all journal entries...
                                </Text>
                              </View>
                            );
                          case "tool-getUserJournalEntries":
                            return (
                              <View
                                key={`${m.id}-${i}`}
                                style={styles.toolInvocation}
                              >
                                <MaterialIcons
                                  name="search"
                                  size={14}
                                  color="#666"
                                />
                                <Text fontSize="$2" color="$color9" ml="$2">
                                  Looking through journal entries...
                                </Text>
                              </View>
                            );
                          default:
                            return null;
                        }
                      })}
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  value={input}
                  onChange={(e) => setInput(e.nativeEvent.text)}
                  onSubmitEditing={handleSend}
                  onKeyPress={(e) => {
                    // CMD+Enter (Mac) or Ctrl+Enter (Windows/Linux) to send
                    const nativeEvent = e.nativeEvent as any;
                    if (
                      nativeEvent.key === "Enter" &&
                      (nativeEvent.metaKey || nativeEvent.ctrlKey)
                    ) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  autoFocus={false}
                  multiline={Platform.OS === "web"}
                  maxLength={1000}
                  returnKeyType="send"
                  blurOnSubmit={Platform.OS !== "web"}
                />
                <Button
                  size="$3"
                  bg={input.trim() ? "#904BFF" : "#cccccc"}
                  color="white"
                  onPress={handleSend}
                  disabled={!input.trim()}
                  circular
                  style={styles.sendButton}
                  pressStyle={{ scale: 0.95 }}
                >
                  ↑
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Protect>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  lockedIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
    gap: 8,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  assistantMessage: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#904BFF",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  toolInvocation: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginVertical: 4,
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#666",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 12 : 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#ffffff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 100,
    paddingVertical: 8,
    lineHeight: 22,
  },
  sendButton: {
    width: 36,
    height: 36,
    minHeight: 36,
    padding: 0,
    fontSize: 20,
  },
});
