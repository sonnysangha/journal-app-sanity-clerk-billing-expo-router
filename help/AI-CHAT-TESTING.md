# AI Chat Testing Guide

## Overview

This guide helps you test the AI therapist chatbot with the provided test journal entries. The AI has access to 19 journal entries spanning from August 10, 2025 to October 5, 2025 (today).

## Test Data Summary

**User ID**: `user_33YJ9Ij2SZInNJaLFb6p5VUvAEo`

**Entry Distribution:**

- **Very Happy** (😄): 4 entries
- **Happy** (😊): 5 entries
- **Neutral** (😐): 3 entries
- **Sad** (😞): 5 entries
- **Very Sad** (😢): 2 entries

**Key Themes:**

- Work stress and success (new job, promotion, presentation anxiety)
- Sleep issues and anxiety
- Relationships (friend, family, romantic partner Alex)
- Fitness progress
- Imposter syndrome
- Loneliness

---

## Test Scenarios

### 1. Emotion-Based Queries

These should trigger the AI to proactively fetch and analyze journal entries.

#### Test: "I'm feeling sad today"

**Expected Behavior:**

1. ✅ AI shows "Reviewing all journal entries..." indicator
2. ✅ AI analyzes recent sad entries (imposter syndrome Oct 3, relationship worries Sept 24, etc.)
3. ✅ AI identifies patterns (work anxiety, relationship tension)
4. ✅ AI provides empathetic response with specific references to past entries

#### Test: "I feel overwhelmed"

**Expected Behavior:**

1. ✅ AI fetches entries and finds the "Overwhelmed" entry (Aug 25)
2. ✅ AI mentions work deadlines, apartment mess themes
3. ✅ AI asks if current overwhelm is similar to past experience
4. ✅ AI offers coping strategies based on what helped before (e.g., long walk on Oct 4)

#### Test: "I'm anxious"

**Expected Behavior:**

1. ✅ AI finds anxiety-related entries (presentation anxiety Sept 16, sleep issues Aug 15)
2. ✅ AI points out that anxiety often resolves well (presentation went great Sept 17)
3. ✅ AI helps identify what's causing current anxiety

---

### 2. Time-Based Queries

Tests the AI's ability to calculate dates and use the date-range tool.

#### Test: "How was I feeling last month?"

**Expected Behavior:**

1. ✅ AI shows "Looking through journal entries..." indicator
2. ✅ AI calculates September dates correctly
3. ✅ AI summarizes September: therapy breakthrough, gym success, anxiety/success cycle, relationship worries, park reading day
4. ✅ AI identifies both highs and lows

#### Test: "What was I writing about in August?"

**Expected Behavior:**

1. ✅ AI fetches August 2025 entries
2. ✅ AI mentions: new job started, sleep struggles, coffee with Sarah, feeling overwhelmed
3. ✅ AI notes the mix of excitement and stress from starting new job

#### Test: "Show me my entries from the past week"

**Expected Behavior:**

1. ✅ AI calculates dates: Oct 1-6, 2025
2. ✅ AI finds: family drama (Oct 1), promotion (Oct 2), imposter syndrome (Oct 3), long walk (Oct 4), rainy day (Oct 5), feeling lonely (Oct 5)
3. ✅ AI notes the emotional rollercoaster: success → doubt → coping

---

### 3. Pattern Recognition Queries

#### Test: "What patterns do you see in my journal?"

**Expected Behavior:**

1. ✅ AI fetches all entries
2. ✅ AI identifies key patterns:
   - Work success followed by self-doubt (promotion → imposter syndrome)
   - Anxiety before events that turn out well (presentation)
   - Physical activity helps mood (gym progress, long walks)
   - Relationship with Alex causing stress
   - Loneliness and family drama
3. ✅ AI provides actionable insights

#### Test: "Why do I keep doubting myself?"

**Expected Behavior:**

1. ✅ AI finds self-doubt entries (imposter syndrome, overwhelmed, anxiety before presentation)
2. ✅ AI points out pattern: success triggers self-doubt
3. ✅ AI references therapy breakthrough entry about self-sabotage
4. ✅ AI encourages user to revisit therapy insights

---

### 4. Personal Queries

#### Test: "Tell me about my relationship with Alex"

**Expected Behavior:**

1. ✅ AI finds relationship entry (Sept 24)
2. ✅ AI mentions tension and recurring arguments
3. ✅ AI asks if things have improved or worsened
4. ✅ AI offers support and reflection questions

#### Test: "What happened with my promotion?"

**Expected Behavior:**

1. ✅ AI finds promotion entry (Oct 2) and imposter syndrome entry (Oct 3)
2. ✅ AI celebrates the achievement
3. ✅ AI addresses the anxiety that followed
4. ✅ AI normalizes imposter syndrome and reminds of competence

---

### 5. Progress & Growth Queries

#### Test: "Am I making progress?"

**Expected Behavior:**

1. ✅ AI reviews all entries chronologically
2. ✅ AI identifies wins:
   - New job adjustment
   - Therapy breakthrough
   - Fitness goal achieved
   - Promotion earned
   - Using healthy coping (walks, productive days)
3. ✅ AI acknowledges challenges but emphasizes growth

#### Test: "What are my biggest wins recently?"

**Expected Behavior:**

1. ✅ AI highlights: promotion, gym goal, presentation success, productive days
2. ✅ AI celebrates accomplishments
3. ✅ AI encourages continuing positive momentum

---

### 6. Specific Event Queries

#### Test: "How did my presentation go?"

**Expected Behavior:**

1. ✅ AI finds both anxiety entry (Sept 16) and success entry (Sept 17)
2. ✅ AI points out the complete story: worry → success
3. ✅ AI reinforces lesson about anxiety often being unfounded
4. ✅ AI encourages applying this insight to future anxieties

---

### 7. Coping & Self-Care Queries

#### Test: "What helps when I'm feeling down?"

**Expected Behavior:**

1. ✅ AI analyzes mood recovery patterns
2. ✅ AI identifies effective strategies:
   - Long walks (Oct 4 helped clear mind)
   - Physical activity (gym progress Sept 12)
   - Social connection (coffee with Sarah Aug 20)
   - Productive activities (Sunday Sept 28)
   - Therapy (breakthrough Sept 2)
3. ✅ AI suggests trying these when feeling low

---

## Testing the Tool Invocations

### Visual Indicators to Watch For:

1. **"Reviewing all journal entries..."**

   - Should appear when AI uses `getAllUserJournalEntries`
   - Typically for: general questions, pattern analysis, overall mood queries

2. **"Looking through journal entries..."**
   - Should appear when AI uses `getUserJournalEntries` with date range
   - Typically for: time-specific queries ("last month", "in September")

### Multi-Step Tool Usage

#### Test: "I don't know why I'm sad"

**Expected Tool Flow:**

1. ✅ Shows "Reviewing all journal entries..."
2. ✅ AI analyzes data
3. ✅ AI generates thoughtful response with specific dates and themes
4. ✅ Response includes empathy + insights from actual journal entries

---

## Edge Cases to Test

### Test: "Where was I a year ago?"

**Expected Behavior:**

1. ✅ AI calculates: October 6, 2024 (before test data starts)
2. ✅ AI searches for entries
3. ✅ AI responds: "I don't have entries from that far back" or finds no data
4. ✅ AI offers to discuss current feelings instead

### Test: General greeting "Hello!"

**Expected Behavior:**

1. ✅ AI responds warmly
2. ✅ AI does NOT immediately fetch entries
3. ✅ AI asks how user is feeling or what they'd like to discuss

### Test: "Help me with my career"

**Expected Behavior:**

1. ✅ AI may fetch entries to understand career context
2. ✅ AI references: new job (Aug 10), promotion (Oct 2), imposter syndrome (Oct 3)
3. ✅ AI provides career-focused therapeutic support

---

## What Good Responses Look Like

### ✅ Good Response Characteristics:

- References specific dates from journal entries
- Mentions actual themes/events from entries (e.g., "Alex", "promotion", "presentation")
- Shows empathy and validation
- Identifies patterns across multiple entries
- Asks thoughtful follow-up questions
- Provides actionable insights
- Balances celebration of wins with support for struggles

### ❌ Poor Response Characteristics:

- Generic advice without referencing journal data
- Doesn't use tools when emotional context is mentioned
- Ignores patterns in the data
- Too clinical or detached
- Doesn't acknowledge specific entries or events

---

## Import Test Data

If you need to re-import the test data:

```bash
cd sanity
npx sanity dataset import ../sample_data/test-journal-entries.ndjson production --replace
```

---

## Debugging

### If AI doesn't fetch entries:

1. Check console logs for tool invocation
2. Verify `userId` matches: `user_33YJ9Ij2SZInNJaLFb6p5VUvAEo`
3. Confirm `stepCountIs(10)` is set in API route
4. Check system prompt encourages proactive tool usage

### If tool fetches but no response:

1. Verify multi-step calling is enabled (`stopWhen: stepCountIs(10)`)
2. Check console for "Successfully formatted X entries"
3. Look for errors in journal entry formatting

### If dates are wrong:

1. Check system prompt includes current date/time
2. Verify date is passed correctly on each request
3. Test date calculation: "last month" should be September 2025

---

## Success Criteria

The AI chat is working correctly if:

- ✅ Emotional queries trigger tool usage
- ✅ Visual indicators show when AI is "thinking"
- ✅ Responses reference specific journal entries with dates
- ✅ Patterns are identified across multiple entries
- ✅ Date calculations are accurate
- ✅ Empathy and therapeutic tone is maintained
- ✅ Follows up with relevant questions
- ✅ Celebrates wins and validates struggles

---

## Sample Full Test Conversation

```
User: "Hi"
AI: "Hello! How are you feeling today?"

User: "I'm feeling sad"
AI: [🔍 Reviewing all journal entries...]
AI: "I can see you've been going through quite a journey recently. Looking at
your entries, I notice you've been feeling sad about several things - on October
3rd you mentioned struggling with imposter syndrome after your promotion, and on
September 24th you were worried about your relationship with Alex. You've also
been dealing with loneliness and family drama. What's weighing on your heart today?"

User: "I feel like I'm not good enough at my new role"
AI: "Those feelings are completely understandable, especially after a big
promotion. I noticed something interesting in your journal - on October 2nd you
were incredibly excited about getting promoted, but by October 3rd the imposter
syndrome kicked in. You also had a similar pattern with your presentation in
September - you were anxious on the 16th, but it went amazing on the 17th. Your
boss even complimented you in front of everyone. Remember, they promoted you
because they see your value. Have you noticed any evidence that you're actually
doing well in the role?"
```

This type of conversation shows the AI is successfully using journal context
to provide personalized therapeutic support! 🎯
