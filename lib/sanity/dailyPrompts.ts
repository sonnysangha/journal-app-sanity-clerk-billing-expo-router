import { defineQuery } from "groq";
import type {
  ACTIVE_DAILY_PROMPTS_QUERYResult,
  DAILY_PROMPT_BY_ID_QUERYResult,
  DAILY_PROMPTS_BY_TAG_QUERYResult,
} from "../../sanity/sanity.types";
import { sanityClient } from "./client";

// GROQ Queries - defined as module-level constants for Sanity typegen
export const ACTIVE_DAILY_PROMPTS_QUERY = defineQuery(`*[
  _type == "dailyPrompt" 
  && isActive == true
] | order(weight desc) {
  _id,
  title,
  prompt,
  emoji,
  category->{
    title,
    color
  },
  suggestedMood,
  isActive,
  weight,
  tags,
  createdAt
}`);

export const DAILY_PROMPT_BY_ID_QUERY = defineQuery(`*[
  _type == "dailyPrompt" 
  && _id == $promptId
][0]{
  _id,
  title,
  prompt,
  emoji,
  category->{
    title,
    color
  },
  suggestedMood,
  isActive,
  weight,
  tags,
  createdAt
}`);

export const DAILY_PROMPTS_BY_TAG_QUERY = defineQuery(`*[
  _type == "dailyPrompt" 
  && isActive == true
  && $tag in tags
] | order(weight desc) {
  _id,
  title,
  prompt,
  emoji,
  category->{
    title,
    color
  },
  suggestedMood,
  isActive,
  weight,
  tags,
  createdAt
}`);

/**
 * Fetch all active daily prompts
 */
export const fetchActiveDailyPrompts =
  async (): Promise<ACTIVE_DAILY_PROMPTS_QUERYResult> => {
    try {
      const prompts = await sanityClient.fetch(ACTIVE_DAILY_PROMPTS_QUERY);
      return prompts;
    } catch (error) {
      console.error("Error fetching daily prompts:", error);
      throw error;
    }
  };

/**
 * Get a weighted random daily prompt
 * Prompts with higher weights have a higher chance of being selected
 */
export const getRandomDailyPrompt = async (): Promise<
  ACTIVE_DAILY_PROMPTS_QUERYResult[0] | null
> => {
  try {
    const prompts = await fetchActiveDailyPrompts();

    if (prompts.length === 0) {
      return null;
    }

    // Calculate total weight
    const totalWeight = prompts.reduce(
      (sum, prompt) => sum + (prompt.weight ?? 1),
      0
    );

    // Generate random number between 0 and total weight
    let random = Math.random() * totalWeight;

    // Select prompt based on weight
    for (const prompt of prompts) {
      random -= prompt.weight ?? 1;
      if (random <= 0) {
        return prompt;
      }
    }

    // Fallback to first prompt (shouldn't happen, but just in case)
    return prompts[0];
  } catch (error) {
    console.error("Error getting random daily prompt:", error);
    throw error;
  }
};

/**
 * Get multiple random daily prompts without repeating
 * @param count Number of prompts to fetch
 */
export const getRandomDailyPrompts = async (
  count: number = 3
): Promise<ACTIVE_DAILY_PROMPTS_QUERYResult> => {
  try {
    const allPrompts = await fetchActiveDailyPrompts();

    if (allPrompts.length === 0) {
      return [];
    }

    // Shuffle array using Fisher-Yates algorithm with weights
    const selectedPrompts: ACTIVE_DAILY_PROMPTS_QUERYResult = [];
    const availablePrompts = [...allPrompts];

    for (let i = 0; i < Math.min(count, availablePrompts.length); i++) {
      const totalWeight = availablePrompts.reduce(
        (sum, prompt) => sum + (prompt.weight ?? 1),
        0
      );
      let random = Math.random() * totalWeight;

      let selectedIndex = 0;
      for (let j = 0; j < availablePrompts.length; j++) {
        random -= availablePrompts[j].weight ?? 1;
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }

      selectedPrompts.push(availablePrompts[selectedIndex]);
      availablePrompts.splice(selectedIndex, 1);
    }

    return selectedPrompts;
  } catch (error) {
    console.error("Error getting random daily prompts:", error);
    throw error;
  }
};

/**
 * Get a specific daily prompt by ID
 */
export const getDailyPromptById = async (
  promptId: string
): Promise<DAILY_PROMPT_BY_ID_QUERYResult> => {
  try {
    const prompt = await sanityClient.fetch(DAILY_PROMPT_BY_ID_QUERY, {
      promptId,
    });
    return prompt;
  } catch (error) {
    console.error("Error fetching daily prompt by ID:", error);
    throw error;
  }
};

/**
 * Get daily prompts filtered by tag
 */
export const getDailyPromptsByTag = async (
  tag: string
): Promise<DAILY_PROMPTS_BY_TAG_QUERYResult> => {
  try {
    const prompts = await sanityClient.fetch(DAILY_PROMPTS_BY_TAG_QUERY, {
      tag,
    } as Record<string, any>);
    return prompts;
  } catch (error) {
    console.error("Error fetching daily prompts by tag:", error);
    throw error;
  }
};
