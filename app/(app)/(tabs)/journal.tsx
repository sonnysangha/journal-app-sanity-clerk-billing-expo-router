import React from "react";
import { View } from "tamagui";

// This tab is only used for the center plus button in the tab bar
// It doesn't render any content - the plus button navigates to /new-entry
export default function JournalTab() {
  return <View style={{ flex: 1 }} />;
}
