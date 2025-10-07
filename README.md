# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Features

### AI Therapist Chat 🤖

An intelligent AI-powered therapeutic journaling assistant that provides personalized support based on your journal history.

**Key Features:**

- **Context-Aware Support**: AI proactively analyzes your journal entries to understand patterns and provide personalized insights
- **Emotion Recognition**: Automatically fetches relevant entries when you express emotions (sad, anxious, happy, etc.)
- **Pattern Analysis**: Identifies recurring themes, triggers, and emotional patterns across your journaling history
- **Time-Based Queries**: Ask about specific periods ("How was I feeling last month?", "What happened in September?")
- **Multi-Step Tool Calling**: AI uses sophisticated tools to gather and analyze your journal data before responding
- **Real-time Streaming**: Responses stream in with visual indicators showing when AI is "thinking"

**Setup:**

1. **Environment Variables**: Add your OpenAI API key to `.env`:

   ```bash
   OPENAI_API_KEY=your_key_here
   ```

2. **Test with Sample Data**: Import 19 test journal entries to try the AI chat:

   ```bash
   cd sanity
   npx sanity dataset import ../sample_data/test-journal-entries.ndjson production --replace
   ```

3. **Testing Guide**: See comprehensive testing instructions in [sample_data/AI-CHAT-TESTING.md](sample_data/AI-CHAT-TESTING.md)

**Example Queries:**

- "I'm feeling sad today" → AI analyzes recent entries to understand why
- "What patterns do you see in my journal?" → Identifies themes and trends
- "Tell me about my relationship with Alex" → References specific entries
- "Am I making progress?" → Tracks growth over time

**Technical Details:**

- Built with AI SDK by Vercel for Expo
- Streaming responses with `expo/fetch`
- Custom tools for fetching journal entries (all entries or date-range specific)
- GPT-4o model with enhanced therapeutic system prompt
- Multi-step reasoning with up to 10 steps per conversation

### Daily Prompts

This app includes a **Daily Prompts** feature that displays inspiring journal entry starters on the home screen as swipeable cards.

- **Admin-managed**: Create and manage prompts via Sanity Studio
- **Weighted random selection**: Control which prompts appear more frequently
- **Pre-filled entries**: Tap a prompt to start a journal entry with suggested content
- **Sample data included**: Import 15 ready-to-use prompts to get started

For detailed documentation, see [sanity/DAILY-PROMPTS.md](sanity/DAILY-PROMPTS.md).

To import sample prompts:

```bash
cd sanity
npx sanity dataset import ../sample_data/sample-daily-prompts.ndjson production
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
