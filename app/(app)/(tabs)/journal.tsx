import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "tamagui";
import JournalListScreen from "../journal-list";

export default function JournalTab() {
  return (
    <View bg="$background" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <JournalListScreen />
      </SafeAreaView>
    </View>
  );
}
