# Image Handling in Your AI Journal App

## How It Works: Sanity + Expo/React Native

### 1. **Schema Setup** ✅

Your `journalEntry` now supports:

- Rich text blocks
- Inline images with hotspot cropping
- Alt text for accessibility
- Optional captions

### 2. **Required Packages**

```bash
# Already in your project:
expo-image          # High-performance image component
expo-image-picker   # Camera/gallery access (add this)

# Install for image picking:
npx expo install expo-image-picker
```

### 3. **Sanity Image URLs**

Sanity provides powerful image transformation URLs:

```typescript
// Basic image URL
const imageUrl = urlFor(image).url();

// With transformations
const optimizedUrl = urlFor(image)
  .width(800)
  .height(600)
  .quality(80)
  .format("webp")
  .url();
```

### 4. **React Native Implementation Example**

```tsx
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

// Displaying Sanity images
<Image
  source={{ uri: urlFor(journalEntry.image).width(400).url() }}
  style={{ width: "100%", height: 200 }}
  contentFit="cover"
  transition={200}
/>;

// Image picker for new entries
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    // Upload to Sanity and add to journal entry
    uploadImageToSanity(result.assets[0]);
  }
};
```

### 5. **Benefits**

- **Automatic CDN**: Images served from Sanity's global CDN
- **Responsive**: Multiple sizes generated automatically
- **Optimized**: WebP, AVIF support with fallbacks
- **Hotspot Cropping**: Smart cropping in Sanity Studio
- **Accessibility**: Alt text support built-in

### 6. **GROQ Query Example**

```typescript
const JOURNAL_ENTRIES_QUERY = `*[
  _type == "journalEntry" 
  && userId == $userId
] | order(createdAt desc) {
  _id,
  title,
  content[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  },
  mood,
  createdAt,
  aiGeneratedCategory->{title, color}
}`;
```

This setup gives you a professional image handling system perfect for a journal app! 📸✨
