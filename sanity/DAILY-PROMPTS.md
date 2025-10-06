# Daily Prompts Feature

## Overview

The Daily Prompts feature allows Sanity admins to create inspiring journal entry starters that are displayed as swipeable cards on the home screen. Users can tap on a prompt to begin a new journal entry with pre-filled content.

## Schema

The `dailyPrompt` schema includes:

- **Title**: A short, catchy title for the prompt (max 60 chars recommended)
- **Prompt Text**: The actual prompt text that inspires journal entries (10-200 chars)
- **Emoji Icon**: Optional emoji to display with the prompt (e.g., 💭, 🌟, ✨, 💡)
- **Category**: Optional reference to a category
- **Suggested Mood**: Optional mood suggestion for entries created with this prompt
- **Active**: Toggle to show/hide prompts from users
- **Weight**: Priority value (1-10) - higher weights appear more frequently
- **Tags**: Optional tags for filtering (e.g., "morning", "reflection", "gratitude")
- **Created At**: Timestamp of when the prompt was created

## How It Works

### Random Selection Algorithm

Prompts are selected using a weighted random algorithm:

1. Only **active** prompts are included
2. Each prompt's **weight** (1-10) determines its selection probability
3. Higher weights = higher chance of being selected
4. The algorithm ensures diverse prompt rotation while favoring popular ones

### User Experience

On the home screen, users see:

- 3 random daily prompts in swipeable cards
- A refresh button to load new prompts
- Tapping a card navigates to the new entry form with pre-filled content

## Adding Prompts

### Via Sanity Studio

1. Navigate to the "Daily Prompts" section in Sanity Studio
2. Click "Create" and fill in the fields
3. Set `isActive` to `true` to make it visible to users
4. Adjust `weight` to control how often it appears (1-10)
5. Publish the document

### Via Import (Sample Data)

Import the sample prompts provided:

```bash
# From the sanity directory
npx sanity dataset import ../sample_data/sample-daily-prompts.ndjson production --replace
```

Or for development:

```bash
npx sanity dataset import ../sample_data/sample-daily-prompts.ndjson development
```

## Best Practices

### Writing Effective Prompts

1. **Be specific but open-ended**: Give direction without limiting creativity
   - ✅ "What made you smile today? Describe that moment in detail."
   - ❌ "Write about today."

2. **Use engaging language**: Make it inviting and personal
   - ✅ "Think of someone who inspires you. What qualities do they have?"
   - ❌ "Describe an inspiring person."

3. **Keep it concise**: Aim for 10-150 characters
   - Users should quickly understand the prompt
   - Leave room for their own interpretation

4. **Vary the tone**: Mix reflective, gratitude-focused, and creative prompts
   - Balance heavy topics with lighter ones
   - Include both past and future-oriented prompts

### Managing Weights

- **Weight 10**: Reserved for universal, highly effective prompts (e.g., "What's on your mind?")
- **Weight 7-9**: Great prompts that work for most users
- **Weight 4-6**: Good prompts with more specific themes
- **Weight 1-3**: Experimental or niche prompts

### Using Tags Effectively

Tag prompts by:

- **Time of day**: "morning", "evening", "night"
- **Theme**: "gratitude", "reflection", "goals", "creativity"
- **Mood**: "uplifting", "contemplative", "energizing"
- **Activity**: "planning", "journaling", "mindfulness"

This allows for future filtering features (e.g., "Show me morning prompts").

## API Reference

### Fetch Active Prompts

```typescript
import {fetchActiveDailyPrompts} from '@/lib/sanity/dailyPrompts'

const prompts = await fetchActiveDailyPrompts()
```

### Get Random Prompts

```typescript
import {getRandomDailyPrompts} from '@/lib/sanity/dailyPrompts'

// Get 3 random prompts (default)
const prompts = await getRandomDailyPrompts(3)
```

### Get Single Random Prompt

```typescript
import {getRandomDailyPrompt} from '@/lib/sanity/dailyPrompts'

const prompt = await getRandomDailyPrompt()
```

### Get Prompts by Tag

```typescript
import {getDailyPromptsByTag} from '@/lib/sanity/dailyPrompts'

const morningPrompts = await getDailyPromptsByTag('morning')
```

## Component Usage

The `DailyPromptCards` component is already integrated into the home screen:

```tsx
import DailyPromptCards from '@/components/DailyPromptCards'
;<DailyPromptCards />
```

It automatically:

- Fetches 3 random prompts on mount
- Displays them as swipeable cards
- Handles navigation to new entry with pre-filled content
- Shows a refresh button to load new prompts

## Future Enhancements

Potential features to consider:

- **Time-based prompts**: Show different prompts based on time of day
- **User preferences**: Let users favorite or skip certain prompts
- **Prompt history**: Track which prompts a user has used
- **Seasonal prompts**: Activate/deactivate prompts based on date ranges
- **A/B testing**: Track which prompts lead to completed entries
- **Localization**: Support multiple languages
- **Smart ordering**: Use ML to show prompts based on user's journaling patterns

## Troubleshooting

### Prompts not showing

- Check that prompts have `isActive: true`
- Verify prompts exist in your Sanity dataset
- Check console for API errors
- Ensure Sanity client is configured correctly

### Same prompts appearing repeatedly

- Add more prompts to the dataset (15+ recommended)
- Vary the weights - avoid having all prompts at weight 10
- Check the random selection is working (refresh button should show new prompts)

### Formatting issues

- Keep titles under 60 characters
- Keep prompt text under 200 characters
- Use single emojis (avoid compound emojis)
- Test on different screen sizes

## Support

For issues or questions:

1. Check the Sanity Studio for data integrity
2. Review console logs for errors
3. Verify API permissions
4. Check the sample data format matches schema
