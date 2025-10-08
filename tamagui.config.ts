import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, createTokens } from "tamagui";

// Create custom purple color tokens
const customTokens = createTokens({
  color: {
    purple1: "#faf5ff",
    purple2: "#f3e8ff",
    purple3: "#e9d5ff",
    purple4: "#d8b4fe",
    purple5: "#c084fc",
    purple6: "#a855f7",
    purple7: "#9333ea",
    purple8: "#7e22ce",
    purple9: "#904BFF",
    purple10: "#6b21a8",
    purple11: "#581c87",
    purple12: "#3b0764",
  },
  radius: defaultConfig.tokens.radius,
  zIndex: defaultConfig.tokens.zIndex,
  space: defaultConfig.tokens.space,
  size: defaultConfig.tokens.size,
});

// Get a base theme to copy structure from
const baseTheme = defaultConfig.themes.light_blue;

const config = {
  ...defaultConfig,
  tokens: customTokens,
  themes: {
    ...defaultConfig.themes,
    // Create purple theme with same structure as blue
    purple: {
      ...baseTheme,
      background: "#904BFF",
      backgroundHover: "#7e22ce",
      backgroundPress: "#6b21a8",
      backgroundFocus: "#904BFF",
      color: "#ffffff",
      colorHover: "#ffffff",
      colorPress: "#ffffff",
      colorFocus: "#ffffff",
      borderColor: "#904BFF",
      borderColorHover: "#7e22ce",
      borderColorPress: "#6b21a8",
      borderColorFocus: "#904BFF",
    },
  },
};

export const tamaguiConfig = createTamagui(config);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
