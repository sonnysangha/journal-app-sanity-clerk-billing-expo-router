import {
  fetchJournalEntries,
  fetchJournalEntriesWithDateRange,
} from "@/lib/sanity/journal";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages, userId }: { messages: UIMessage[]; userId?: string } =
    await req.json();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get current date/time for context
  const now = new Date();
  const currentDateTime = now.toISOString();
  const currentDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const result = streamText({
    model: openai("gpt-4o"),
    stopWhen: stepCountIs(10),
    system: `You are a compassionate AI therapist and journaling assistant with access to the user's complete journaling history.

CURRENT DATE AND TIME:
- Date: ${currentDate}
- Time: ${currentTime}
- ISO DateTime: ${currentDateTime}

Use this information to accurately calculate date ranges when users ask about past entries (e.g., "a year ago", "last month", "yesterday").

CORE RESPONSIBILITIES:

1. **Proactive Context Gathering**
   - When a user expresses an emotion (sad, anxious, happy, etc.), ACTIVELY use the tools to understand WHY
   - Look for patterns in their recent entries to provide context-aware support
   - Example: If user says "I'm feeling sad today", use getAllUserJournalEntries or getUserJournalEntries to review recent entries and identify potential causes or patterns

2. **Pattern Recognition & Analysis**
   - Identify recurring themes, triggers, and emotional patterns across their journal entries
   - Notice correlations between moods, events, and time periods
   - Help users see connections they might not notice themselves
   - Track progress and growth over time

3. **Intelligent Tool Usage**
   - Use getAllUserJournalEntries for: general questions, pattern analysis, mood trends, or when no specific timeframe is mentioned
   - Use getUserJournalEntries for: specific time periods, comparing past vs present, or when user mentions dates
   - DON'T wait to be asked - proactively fetch entries when it would help provide better support

4. **Therapeutic Support**
   - Provide empathetic, non-judgmental support based on their journaling history
   - Ask thoughtful questions that reference their past entries
   - Help users reflect on their emotional journey and growth
   - Offer evidence-based insights informed by their patterns
   - Validate feelings while helping them understand root causes

5. **Context-Aware Responses**
   - Reference specific entries when relevant (mention dates, themes, or moods)
   - Draw connections between current feelings and past experiences
   - Celebrate improvements and acknowledge challenges
   - Use their own words and experiences to guide conversations

6. **Professional Boundaries**
   - Maintain confidentiality and respect boundaries
   - Use a warm, conversational yet professional tone
   - You are here to support, not diagnose
   - Encourage professional help for serious mental health concerns

EXAMPLE INTERACTIONS:

User: "I'm feeling really anxious today"
You: *First uses getAllUserJournalEntries to check recent patterns* "I see you've been experiencing anxiety. Looking at your recent journal entries, I notice you mentioned [specific theme/event]. Would you like to talk about what's contributing to your anxiety today?"

User: "I don't know why I'm sad"
You: *Uses getUserJournalEntries for the past 2 weeks* "Let's explore this together. I've reviewed your recent entries and noticed you've been feeling [pattern]. On [date], you wrote about [theme]. Do you think any of these might be connected to how you're feeling now?"

Remember: Your access to their journal is a powerful tool for providing personalized, context-aware therapeutic support. Use it proactively and thoughtfully.`,
    messages: convertToModelMessages(messages),
    tools: {
      getAllUserJournalEntries: tool({
        description:
          "Fetch ALL of the user's journal entries without any date restrictions. Use this when the user asks general questions about their journaling history, patterns, or when they don't specify a time period. This returns all entries ordered by most recent first.",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            console.log(`Fetching all journal entries for user ${userId}`);

            const entries = await fetchJournalEntries(userId);

            console.log(`Found ${entries.length} total journal entries`);

            // Format entries for the AI to understand
            const formattedEntries = entries.map((entry) => {
              console.log(
                `Processing entry ${entry._id} from ${entry.createdAt}`
              );

              // Extract text content from blocks
              let content = "No content";
              if (entry.content && entry.content.length > 0) {
                const firstBlock = entry.content[0];
                if (
                  firstBlock &&
                  "_type" in firstBlock &&
                  firstBlock._type === "block" &&
                  "children" in firstBlock &&
                  firstBlock.children &&
                  firstBlock.children.length > 0
                ) {
                  content = firstBlock.children[0]?.text || "No content";
                }
              }

              return {
                date: entry.createdAt,
                title: entry.title,
                mood: entry.mood,
                content,
                category: entry.aiGeneratedCategory?.title,
              };
            });

            console.log(
              `Successfully formatted ${formattedEntries.length} entries`
            );

            return {
              count: formattedEntries.length,
              entries: formattedEntries,
            };
          } catch (error) {
            console.error("Error fetching all journal entries:", error);
            return {
              error: "Unable to fetch journal entries",
              count: 0,
              entries: [],
            };
          }
        },
      }),
      getUserJournalEntries: tool({
        description:
          "Fetch the user's journal entries within a specific date range. Use this when the user asks about past experiences, feelings, or events from their journal. The date range helps you find relevant entries from specific time periods.",
        inputSchema: z.object({
          startDate: z
            .string()
            .describe(
              "Start date in ISO format (YYYY-MM-DD or ISO datetime). Calculate this based on what the user asks (e.g., 'a year ago' would be 365 days before today)."
            ),
          endDate: z
            .string()
            .describe(
              "End date in ISO format (YYYY-MM-DD or ISO datetime). Usually today's date unless the user specifies otherwise."
            ),
        }),
        execute: async ({ startDate, endDate }) => {
          try {
            console.log(
              `Fetching journal entries for user ${userId} from ${startDate} to ${endDate}`
            );

            const entries = await fetchJournalEntriesWithDateRange(
              userId,
              startDate,
              endDate
            );

            console.log(`Found ${entries.length} journal entries`);

            // Format entries for the AI to understand
            const formattedEntries = entries.map((entry) => {
              // Extract text content from blocks
              let content = "No content";
              if (entry.content && entry.content.length > 0) {
                const firstBlock = entry.content[0];
                if (
                  firstBlock &&
                  "_type" in firstBlock &&
                  firstBlock._type === "block" &&
                  "children" in firstBlock &&
                  firstBlock.children &&
                  firstBlock.children.length > 0
                ) {
                  content = firstBlock.children[0]?.text || "No content";
                }
              }

              return {
                date: entry.createdAt,
                title: entry.title,
                mood: entry.mood,
                content,
                category: entry.aiGeneratedCategory?.title,
              };
            });

            return {
              count: formattedEntries.length,
              entries: formattedEntries,
            };
          } catch (error) {
            console.error("Error fetching journal entries:", error);
            return {
              error: "Unable to fetch journal entries",
              count: 0,
              entries: [],
            };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}
