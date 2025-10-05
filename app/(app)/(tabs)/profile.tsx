import { SignOutButton } from "@/components/SignOutButton";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "tamagui";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1}>
        <Text>Profile</Text>
      </View>

      <SignOutButton />
    </SafeAreaView>
  );
}
