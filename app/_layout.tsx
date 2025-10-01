import { ModalProvider } from "@/contexts/ModalContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { tamaguiConfig } from "@/tamagui.config";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalProvider, TamaguiProvider } from "tamagui";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache}>
        <TamaguiProvider config={tamaguiConfig}>
          <PortalProvider shouldAddRootHost>
            <ModalProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Slot />
              </ThemeProvider>
            </ModalProvider>
          </PortalProvider>
        </TamaguiProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
