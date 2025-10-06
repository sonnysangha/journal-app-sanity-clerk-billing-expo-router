# Image Upload Setup Guide

## 📦 Required Packages

Install the necessary packages for image handling:

```bash
# Image picker for camera/gallery access
npx expo install expo-image-picker

# Sanity client for data operations
npm install @sanity/client

# Already included in your project:
# - expo-image (for displaying images)
# - @clerk/clerk-expo (for user authentication)
```

## 🔑 Environment Setup

### 1. Create Sanity API Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project (`ybgfg3ak`)
3. Go to **API** → **Tokens**
4. Click **Add API Token**
5. Name it "Expo App"
6. Set permissions to **Editor** (for read/write)
7. Copy the token

### 2. Add Environment Variables

Create/update `.env.local` in your project root:

```bash
# Add your Sanity write token
EXPO_PUBLIC_SANITY_TOKEN=your_token_here
```

⚠️ **Important**: Add `.env.local` to your `.gitignore` to keep tokens secure!

## 🚀 Usage

### Basic Implementation

```tsx
import { JournalEntryForm } from "@/components/JournalEntryForm";
import { createJournalEntry } from "@/utils/sanity";

// In your component
const handleSave = async (entry) => {
  try {
    await createJournalEntry(entry);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

<JournalEntryForm onSave={handleSave} onCancel={handleCancel} />;
```

### Navigation Setup

Add to your navigation structure:

```tsx
// In your tab navigator or stack
<Stack.Screen
  name="new-entry"
  options={{
    title: "New Journal Entry",
    presentation: "modal", // Makes it feel like a modal
  }}
/>
```

## 📱 Features Included

### ✅ Text Input

- Title (optional)
- Rich text content (required)
- Character limits and validation

### ✅ Image Handling

- **Camera**: Take photos directly
- **Gallery**: Pick from photo library
- **Captions**: Add descriptions to images
- **Remove**: Delete images before saving
- **Preview**: See images before saving

### ✅ Mood Selection

- 5 emoji mood levels (😢 😞 😐 😊 😄)
- Required selection
- Visual feedback

### ✅ User Experience

- **Permissions**: Automatic camera/gallery permission requests
- **Validation**: Form validation with helpful error messages
- **Loading States**: Visual feedback during save
- **Responsive Design**: Works on all screen sizes

## 🔄 Data Flow

1. **User Input**: Text + Images + Mood selection
2. **Image Upload**: Images uploaded to Sanity CDN
3. **Content Creation**: Mixed content blocks (text + images)
4. **Save**: Complete journal entry saved to Sanity
5. **Navigation**: Return to previous screen

## 🎨 Customization

The form is fully customizable:

- **Styles**: Modify `styles` object in `JournalEntryForm.tsx`
- **Colors**: Update theme colors
- **Layout**: Adjust component structure
- **Validation**: Add custom validation rules
- **Fields**: Add/remove form fields as needed

## 🐛 Troubleshooting

### Common Issues:

1. **"Permission denied"**: Check camera/gallery permissions
2. **"Upload failed"**: Verify Sanity token and network connection
3. **"User not found"**: Ensure Clerk authentication is working
4. **Images not displaying**: Check Sanity project ID and dataset

### Debug Mode:

Add `console.log` statements in `utils/sanity.ts` to debug upload process.

Your journal app now supports rich multimedia entries! 🎉📸
