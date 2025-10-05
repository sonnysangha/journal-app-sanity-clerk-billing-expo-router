import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, H1, H5, H6, Text, View } from "tamagui";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <H1>Welcome!</H1>
      <H5>To Journal.ai!</H5>

      <View>
        <Text marginBlockEnd={16}>
          Journal.ai is your AI-powered journal assistant. It helps you track
          your mood, thoughts, and feelings.
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        <Text marginBlockEnd={8}>From Sonny Sangha</Text>
        <H6>#PAPAFAM</H6>
      </View>

      <Link href="https://www.youtube.com/sonnysangha" asChild>
        <Button theme="blue">Watch the YouTube Video</Button>
      </Link>

      <Link href="https://www.papareact.com/journal-ai-form" asChild>
        <Button theme="red">Get the code here</Button>
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  divider: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 16,
  },
});
