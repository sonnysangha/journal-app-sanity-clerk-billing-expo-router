# AI Auto-Categorization System

## Overview

This document explains the AI-powered auto-categorization system that automatically assigns categories to journal entries when they are created or edited.

## How It Works

### Architecture

The auto-categorization system consists of three main components:

1. **API Endpoint** (`app/api/categorize+api.ts`)

   - Receives journal entry content and title
   - Fetches existing categories from Sanity
   - Uses OpenAI GPT-4o to intelligently determine the best category
   - Either returns an existing category or creates a new one

2. **Helper Function** (`lib/utils/categorize.ts`)

   - Provides a clean interface to call the categorization API
   - Handles error cases gracefully
   - Returns category ID and reasoning

3. **Integration** (`lib/sanity/journal.ts`)
   - Automatically calls categorization when creating entries
   - Re-categorizes when updating entries with new content
   - Gracefully continues if categorization fails

### Workflow

#### When Creating a New Entry

1. User writes a journal entry with title (optional) and content
2. System calls AI categorization API with the entry text
3. AI analyzes the content and compares against existing categories
4. AI either:
   - Selects an existing category if it's a good match
   - Creates a new category if none match well
5. Entry is saved with the category reference in the `aiGeneratedCategory` field
6. Entry appears with its category in the journal list

#### When Editing an Entry

1. User edits an existing journal entry (title or content)
2. System re-categorizes the entry with updated content
3. AI may assign a different category if the content theme changed
4. Updated entry is saved with the new category

## AI Decision Making

The AI follows these principles when categorizing:

### 1. Prefer Existing Categories

- Always check existing categories first
- Use an existing category if it's a reasonable match
- Avoid creating duplicate or overly similar categories

### 2. Only Create When Necessary

- New categories are only created when:
  - No existing category is a good match
  - The entry represents a distinct theme
  - The new category would be useful for future entries

### 3. Consistent Naming

- New categories follow the pattern: "Theme & Subtheme"
- Examples: "Work & Career", "Health & Wellness", "Travel & Adventure"
- Keep names concise (2-4 words max)

### 4. Meaningful Colors

- Each category gets a hex color that represents its theme
- Colors help users visually distinguish between categories

## Default Categories

The system comes with sample categories:

- **Work & Career** (#3B82F6) - Blue
- **Family & Relationships** (#EC4899) - Pink
- **Health & Wellness** (#10B981) - Green
- **Personal Growth** (#8B5CF6) - Purple
- **Travel & Adventure** (#F59E0B) - Orange
- **Daily Life** (#6B7280) - Gray
- **Goals & Dreams** (#EF4444) - Red

## Error Handling

The system is designed to fail gracefully:

- If categorization API fails, the entry is still saved without a category
- If AI returns invalid data, the error is logged but doesn't block saving
- Network issues won't prevent entry creation/updates
- All errors are logged for debugging

## Data Structure

### Category Schema

```typescript
{
  _type: "category",
  _id: string,
  title: string,
  color: string // hex color like "#3B82F6"
}
```

### Journal Entry Schema (relevant fields)

```typescript
{
  _type: "journalEntry",
  title?: string,
  content: Array<Block | Image>,
  mood: string,
  userId: string,
  aiGeneratedCategory: {
    _type: "reference",
    _ref: string // category _id
  },
  createdAt: string
}
```

## API Response Format

### Categorization API Response

```typescript
{
  categoryId: string,        // The category _id to use
  reasoning: string,          // AI's explanation for the choice
  action: "existing" | "new", // Whether existing or newly created
  categoryTitle: string       // The category title
}
```

## Usage Examples

### Automatic (Default Behavior)

No code changes needed! The system automatically categorizes all entries:

```typescript
// Just create an entry normally
await createJournalEntry({
  title: "My first day at the new job",
  content: "Started my new position today...",
  mood: "happy",
  userId: "user_123",
  images: [],
});
// → Automatically categorized as "Work & Career"
```

### Manual Categorization (If Needed)

You can also call the categorization function directly:

```typescript
import { categorizeJournalEntry } from "@/lib/utils/categorize";

const result = await categorizeJournalEntry(
  "Vacation in Hawaii",
  "We arrived in Maui today and the beaches are amazing...",
  "user_123"
);

console.log(result);
// {
//   categoryId: "travel-adventure",
//   action: "existing",
//   categoryTitle: "Travel & Adventure",
//   reasoning: "This entry describes a vacation experience..."
// }
```

## Monitoring & Debugging

All categorization operations are logged to the console:

```
Creating journal entry with auto-categorization...
Entry categorized as: Work & Career (existing)
Reasoning: The entry discusses starting a new job position...
Journal entry created successfully with ID: abc123
```

Check the console logs in your development environment to see:

- Which category was chosen
- Whether it was existing or newly created
- The AI's reasoning for the choice

## Performance Considerations

- Categorization adds ~1-3 seconds to entry creation/update
- The API call happens before saving the entry
- Failed categorizations don't block entry saving
- Multiple AI models could be used (currently using GPT-4o)

## Future Enhancements

Potential improvements to consider:

1. **Manual Override**: Allow users to change AI-assigned categories
2. **Category Suggestions**: Show AI reasoning in the UI
3. **Batch Re-categorization**: Re-categorize all existing entries
4. **Category Analytics**: Show most common categories, trends over time
5. **Custom Category Rules**: Allow users to define categorization rules
6. **Local Caching**: Cache categories to reduce API calls
7. **Multi-category Support**: Allow entries to have multiple categories

## Troubleshooting

### Category Not Assigned

1. Check console logs for categorization errors
2. Verify OpenAI API key is configured correctly
3. Ensure Sanity write permissions are set up
4. Check network connectivity

### Unwanted Categories Being Created

1. Review AI prompt in `app/api/categorize+api.ts`
2. Adjust the instructions to be more conservative
3. Consider adding a whitelist of allowed category names
4. Increase the preference for existing categories

### Categories Not Appearing in UI

1. Verify the GROQ queries include category references
2. Check that `aiGeneratedCategory->{ title, color }` is in queries
3. Ensure UI components display the category field
4. Check Sanity Studio for the category reference

## Configuration

### Changing the AI Model

Edit `app/api/categorize+api.ts`:

```typescript
const result = await generateObject({
  model: openai("gpt-4o-mini"), // Change to a different model
  // ... rest of config
});
```

### Adjusting Categorization Behavior

Edit the prompt in `app/api/categorize+api.ts` to:

- Make it more or less conservative
- Add specific category rules
- Change naming conventions
- Adjust color selection logic

## Testing

To test the auto-categorization:

1. Create a new journal entry with clear thematic content
2. Check the console logs for categorization result
3. View the entry in Sanity Studio to see the category reference
4. Create another entry with similar content to verify it reuses the category
5. Edit an entry's content to see if it gets re-categorized appropriately

## Cost Considerations

- Each categorization uses OpenAI API credits
- GPT-4o is more expensive but more accurate
- Consider using GPT-4o-mini for cost savings
- Failed categorizations don't consume credits
- Consider caching strategies for similar content
