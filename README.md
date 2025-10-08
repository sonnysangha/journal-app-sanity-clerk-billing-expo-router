# AI-Powered Journal App — Built with Expo, Sanity CMS, Clerk & OpenAI

A beautiful, intelligent journaling app for iOS and Android. Features AI-powered therapeutic chat, automatic mood categorization, daily writing prompts, and rich media support. Built with Expo (React Native), Sanity CMS, Clerk authentication with billing, and OpenAI GPT.

> **Note:** This is a native mobile app. The web portion of Expo is only used for pricing/billing pages and subscription management through Clerk.

## 👇🏼 DO THIS Before you get started

> Note: Using the referral links below helps support the development of this project through affiliate partnerships, allowing me to provide these tutorials for free!

### 1) Set up Clerk using our link! (It supports us in doing this for FREE!)

Create a Clerk account at [Clerk](https://go.clerk.com/PcP73s8) for authentication and billing

### 2) Set up Sanity

Create a Sanity account at [Sanity](https://www.sanity.io/sonny?utm_source=youtube&utm_medium=video&utm_content=ai-journal) for content management

### 3) Set up OpenAI

Create an OpenAI account at [OpenAI](https://openai.com) for AI chat and auto-categorization

## Features

### For Users

- **AI Therapist Chat** 🤖: Intelligent therapeutic assistant that analyzes your journal history and provides personalized insights
- **Daily Writing Prompts** ✨: Inspiring journal starters displayed as beautiful swipeable cards
- **Rich Journal Entries**: Write entries with mood tracking, categories, and image attachments
- **Auto-Categorization**: AI automatically suggests categories for your entries
- **Mood & Emotion Tracking**: Track your emotional journey with emoji-based mood selection
- **Streak Tracking**: Monitor your journaling consistency and build healthy habits
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Native Mobile App**: Optimized for iOS and Android with smooth native performance
- **Web Billing Portal**: Seamless subscription management through web-based pricing pages

### AI Features

- **Context-Aware Support**: AI proactively analyzes journal entries to understand patterns and provide personalized insights
- **Emotion Recognition**: Automatically fetches relevant entries when you express emotions (sad, anxious, happy, etc.)
- **Pattern Analysis**: Identifies recurring themes, triggers, and emotional patterns across your journaling history
- **Time-Based Queries**: Ask about specific periods ("How was I feeling last month?", "What happened in September?")
- **Multi-Step Tool Calling**: AI uses sophisticated tools to gather and analyze journal data before responding
- **Real-time Streaming**: Responses stream in with visual indicators showing when AI is "thinking"
- **Smart Categorization**: AI suggests relevant categories as you write journal entries

### Technical Features

- **Expo SDK 54** with React 19 and file-based routing
- **Clerk** for authentication and user management with **Clerk Billing** for subscription management (Stripe-powered)
- **Sanity CMS** for content management, schema definitions, and rich media handling
- **OpenAI GPT** for AI-powered chat and auto-categorization
- **Tamagui** for cross-platform UI components
- **TypeScript** end-to-end with Zod validation
- **Dual App Architecture**: Expo app for users + Sanity Studio app for admins (same repo)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- **iOS Simulator** (Mac only with Xcode) or **Android Emulator** (Android Studio)
- Accounts: Clerk, Sanity, OpenAI

> **Important:** This is a native mobile app. You'll need either an iOS simulator or Android emulator to run the app. Web is only used for the pricing/billing portal.

### 1) Clone & Install

Install dependencies for **both** apps:

```bash
# Install Expo app dependencies
npm install

# Install Sanity Studio dependencies
cd sanity
npm install
cd ..
```

### 2) Environment Variables

Create a `.env` file in the **project root** (for Expo app):

```env
# Clerk Authentication & Billing
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXhhbXBsZS1jbGVyay1wdWJsaXNoYWJsZS1rZXktMTIzNDU2
CLERK_SECRET_KEY=sk_test_ZXhhbXBsZS1jbGVyay1zZWNyZXQta2V5LTEyMzQ1Ng

# Sanity CMS
EXPO_PUBLIC_SANITY_PROJECT_ID=abc123de
EXPO_PUBLIC_SANITY_DATASET=production
EXPO_PUBLIC_SANITY_TOKEN=skABcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdefghijklmnopqrstuvwxyz

# OpenAI for AI Features
OPENAI_API_KEY=sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz
```

**Important Notes:**

- **EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY**: Found in Clerk Dashboard → API Keys (starts with `pk_test_` for test mode or `pk_live_` for production)
- **CLERK_SECRET_KEY**: Found in Clerk Dashboard → API Keys (starts with `sk_test_` or `sk_live_`) - **Never expose this publicly!**
- **EXPO_PUBLIC_SANITY_PROJECT_ID**: Found in Sanity project settings (8-character alphanumeric ID)
- **EXPO_PUBLIC_SANITY_DATASET**: Usually `production` or `development` - matches your Sanity dataset name
- **EXPO_PUBLIC_SANITY_TOKEN**: Create in Sanity → API → Tokens with **Editor** permissions (required for write operations)
- **OPENAI_API_KEY**: Found in OpenAI Dashboard → API Keys (starts with `sk-proj-` or `sk-`)

> **Security:** The `EXPO_PUBLIC_` prefix makes these variables available in client-side code. Only use this prefix for non-sensitive data like project IDs and publishable keys. Never prefix secret keys with `EXPO_PUBLIC_`!

### 3) Configure Clerk

1. Create a new application at [Clerk](https://go.clerk.com/PcP73s8)
2. Enable **Email** and **Google** as authentication providers
3. Copy the **Publishable Key** and **Secret Key** into `.env`
4. Set up **Clerk Billing** with Stripe integration:
   - Navigate to Billing in Clerk Dashboard
   - Configure **Starter** (Free) and **Pro** ($9.99/month) plans
   - Set feature gates for AI chat (Pro only)
5. Configure **OAuth redirect URLs** for Expo:
   - Add custom scheme: `sanityclerkbillingjournalappexpo://` (for mobile)
   - Add web URL: `http://localhost:8081` (for pricing/billing pages only)
   - In production, add your deployed web URL for pricing pages
6. Set up **webhooks** for billing events (point to your deployed API routes)

### 4) Configure Sanity

1. Create a Sanity account at [Sanity](https://www.sanity.io)
2. Initialize your Sanity project:

```bash
cd sanity
npm run dev
# Follow prompts to create project
```

3. Copy your **Project ID** and add to `.env` as `EXPO_PUBLIC_SANITY_PROJECT_ID`
4. Create an **API token** with **Editor** permissions:
   - Go to [manage.sanity.io](https://manage.sanity.io)
   - Select your project → API → Tokens
   - Create token with Editor permissions
   - Add to `.env` as `EXPO_PUBLIC_SANITY_TOKEN`
5. Deploy GraphQL API (optional):

```bash
npm run deploy-graphql
```

6. Import sample data:

```bash
# Import daily prompts
npm run import-prompts
# or manually:
npx sanity dataset import ../sample_data/sample-daily-prompts.ndjson production

# Import categories
npx sanity dataset import ../sample_data/sample-categories.ndjson production

# Import test journal entries (optional, for AI testing)
npx sanity dataset import ../sample_data/test-journal-entries.ndjson production
```

### 5) Configure OpenAI

1. Create an OpenAI account at [OpenAI](https://openai.com)
2. Generate an **API key** from the API dashboard
3. Add to `.env` as `OPENAI_API_KEY`
4. Ensure you have access to **GPT-4o** model for best results (or modify code to use GPT-4 or GPT-3.5)

### 6) Run the Apps

**Development mode runs both apps separately:**

**Terminal 1 - Expo App:**

```bash
npm start
# Then press:
# - 'i' for iOS simulator
# - 'a' for Android emulator
# - 'w' for web browser (only for pricing/billing pages)
```

**Terminal 2 - Sanity Studio:**

```bash
cd sanity
npm run dev
# Sanity Studio opens at http://localhost:3333
```

**Production:**

```bash
# Build Expo app
npx expo export

# Deploy Sanity Studio
cd sanity
npm run deploy
```

## Tech Stack Deep Dive

### Native Mobile Frontend (iOS & Android)

- **Expo SDK 54** with new architecture enabled
- **React Native** for native mobile development
- **React 19** with React Compiler
- **Expo Router** for file-based routing and navigation
- **Tamagui** for cross-platform styled components
- **React Native Reanimated** for smooth animations
- **Expo Image** for optimized image handling
- **React Native Markdown** for rich text display

### Web (Pricing/Billing Only)

- **Expo Web** for subscription management pages
- **Clerk Billing** integrated pricing portal
- **Stripe** checkout flow

### Backend & Services

- **Sanity CMS** for content storage and management
- **Clerk** for authentication, user management, and billing
- **OpenAI GPT-4o** for AI chat and categorization
- **Expo API Routes** for serverless edge functions

### AI & Data

- **AI SDK by Vercel** for streaming AI responses
- **Vercel AI SDK React (Expo)** for `useChat` hook with streaming
- **GROQ** for powerful Sanity queries
- **Zod** for runtime type validation

### Developer Experience

- **TypeScript** with strict mode
- **ESLint** with Expo config
- **Sanity Typegen** for auto-generated types
- **Hot Reload** for instant development feedback

## Common Issues

### Expo App Issues

- **Metro bundler errors**: Clear cache with `npx expo start -c`
- **iOS build fails**: Ensure Xcode is up to date and run `npx expo prebuild --clean`
- **Android emulator crashes**: Increase RAM allocation in AVD Manager
- **Missing environment variables**: Check `.env` file exists in project root
- **Clerk auth not working**: Verify OAuth redirect URLs match your scheme

### Sanity Issues

- **Schema changes not reflecting**: Restart Sanity dev server
- **Import fails**: Check NDJSON file format and dataset name
- **Image uploads failing**: Verify API token has write permissions
- **CORS errors**: Add your local/deployed URLs to Sanity CORS settings
- **Typegen errors**: Run `npm run typegen` in sanity directory

### AI Issues

- **Chat not streaming**: Check `expo/fetch` polyfill is loaded in `polyfills.js`
- **Tool calls not working**: Verify OpenAI API key has access to function calling
- **No journal entries found**: Check user ID matches between Clerk and Sanity documents
- **Rate limit errors**: Implement retry logic or upgrade OpenAI plan

## Sample Data

The project includes three sample datasets in `sample_data/`:

### 1. Daily Prompts (`sample-daily-prompts.ndjson`)

15 inspiring journal prompts with varied weights and themes:

- Gratitude prompts (weight 8-10)
- Reflection prompts (weight 6-8)
- Creative prompts (weight 4-6)
- Goal-setting prompts (weight 5-7)

### 2. Categories (`sample-categories.ndjson`)

Common journal categories with beautiful colors:

- Personal Growth 🌱
- Relationships 💙
- Work & Career 💼
- Health & Fitness 🏃
- Gratitude 🙏
- Mental Health 🧠
- Travel & Adventure ✈️

### 3. Test Journal Entries (`test-journal-entries.ndjson`)

19 realistic journal entries for testing AI chat:

- Spans 2 months (Aug-Oct 2025)
- Various moods (very sad to very happy)
- Recurring themes (work, relationships, anxiety, growth)
- Perfect for testing AI pattern recognition

Import with:

```bash
cd sanity
npx sanity dataset import ../sample_data/[filename].ndjson production
```

## Testing the AI Chat

See comprehensive testing guide in [`help/AI-CHAT-TESTING.md`](help/AI-CHAT-TESTING.md)

**Quick test scenarios:**

- "I'm feeling sad today" → AI analyzes recent entries
- "What patterns do you see in my journal?" → Identifies themes
- "How was I feeling last month?" → Summarizes date range
- "Tell me about my relationship with Alex" → References specific entries

## 🚀 Join the World's Best Developer Course & Community - Zero to Full Stack Hero!

### Transform Your Career with Modern Full-Stack Development

Ready to build production-ready applications like this AI Journal App? Join **Zero to Full Stack Hero** - the ultimate course that teaches you to build real-world, revenue-generating applications using the latest technologies.

### 🎯 What You'll Learn:

- **React Native & Expo** - Build cross-platform mobile apps for iOS, Android, and Web
- **AI Integration** - Build intelligent apps with OpenAI, Claude, and custom AI workflows
- **Full-Stack Architecture** - From frontend to backend, databases to deployment
- **Modern Authentication** - Clerk, Auth0, and custom auth solutions
- **CMS Integration** - Sanity, Contentful, and headless CMS architectures
- **Database Mastery** - SQL, NoSQL, Prisma, Convex, and more
- **Payment Integration** - Stripe, subscription models, and billing systems
- **Real-Time Features** - WebSockets, live updates, and collaborative apps
- **Deployment & DevOps** - Vercel, AWS, Docker, and CI/CD pipelines

### 👥 Join the PAPAFAM Community:

- **1,000+ Active Developers** helping each other succeed
- **Weekly Live Coding Sessions** with Sonny Sangha
- **Code Reviews & Feedback** from industry professionals
- **Job Placement Support** and career guidance
- **Exclusive Discord Community** with 24/7 support
- **Networking Opportunities** with like-minded developers

### 💼 Career Transformation:

- **$50k-$150k+ Salary Increases** reported by graduates
- **Portfolio Projects** that impress employers
- **Interview Preparation** and technical assessment practice
- **Freelancing Guidance** to start your own business
- **Lifetime Access** to all course materials and updates

### 🎁 Special Bonuses:

- **100+ Hours** of premium video content
- **Private GitHub Repositories** with complete source code
- **Exclusive Templates & Boilerplates** to accelerate development
- **Monthly Q&A Sessions** with industry experts
- **Certificate of Completion** to showcase your skills

---

**Ready to level up your development skills and build the future?**

[🚀 **Join Zero to Full Stack Hero NOW**](https://www.papareact.com/course)

_Join thousands of developers who've transformed their careers with PAPAFAM!_

## 🏆 Take It Further - Challenge Time!

- Add voice journaling with speech-to-text (Expo AV)
- Implement collaborative journaling with friends
- Add mood analytics with beautiful charts and graphs (Victory Native)
- Build a companion web app for desktop journaling
- Integrate calendar view for browsing entries by date
- Add reminders and push notifications for daily journaling (Expo Notifications)
- Implement journal templates for specific use cases
- Add export functionality (PDF, plain text, backup)
- Build AI-generated weekly/monthly summaries
- Add biometric authentication (Face ID, Touch ID with Expo LocalAuthentication)
- Implement offline mode with sync when online (WatermelonDB)
- Add search and filtering with advanced queries
- Build a recommendation engine for prompts based on mood patterns
- Add widgets for iOS/Android home screens
- Implement Apple Watch or Wear OS companion app

## 📄 License & Commercial Use

This project is provided for **educational and learning purposes only**.

### 🚨 Important Licensing Information:

- **Personal Learning**: You are free to use this code for personal learning, experimentation, and portfolio demonstration
- **Commercial Use**: Any commercial use, redistribution, or deployment of this code requires **explicit written permission** from Sonny Sangha
- **No Resale**: You may not sell, redistribute, or claim ownership of this codebase
- **Attribution Required**: If showcasing this project, proper attribution to Sonny Sangha and the original tutorial must be included

### 📧 For Commercial Licensing:

If you wish to use this code commercially or have licensing questions, please contact us at **team@papareact.com** with details about your intended use case.

**Violation of these terms may result in legal action.**

---

## Support

For support, email team@papareact.com

Built with ❤️ for the PAPAFAM

---
