# Official Sanity Image Handling Setup

## 📦 Required Packages

Install the official Sanity packages for proper image handling:

```bash
# Official Sanity image URL builder (REQUIRED)
npm install @sanity/image-url

# Portable Text renderer for React Native (REQUIRED)
npm install @portabletext/react-native

# Image picker for camera/gallery access
npx expo install expo-image-picker

# Sanity client for data operations
npm install @sanity/client

# Already included in your project:
# - expo-image (for displaying images)
# - @clerk/clerk-expo (for user authentication)
```

## 🎯 Why Use Official Packages?

Following [Sanity's official documentation](https://www.sanity.io/docs/apis-and-sdks/presenting-images):

### ✅ **@sanity/image-url Benefits:**
- **Automatic crop/hotspot handling** - Respects editor settings
- **Performance optimization** - Cached transformations
- **Format detection** - Auto WebP/AVIF with fallbacks  
- **Responsive images** - Multiple sizes for different screens
- **CDN optimization** - Global edge caching

### ✅ **Method Chaining API:**
```typescript
// Clean, intuitive syntax
urlFor(image)
  .width(800)
  .height(400)
  .fit('crop')
  .auto('format')
  .url()
```

## 🔧 Implementation

### **1. Sanity Utils (utils/sanity.ts)**
```typescript
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Create image URL builder using official package
const builder = imageUrlBuilder(sanityClient);

// Export the official urlFor function
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper with common optimizations
export const getImageUrl = (asset: any, width = 800) => {
  if (!asset) return null;
  return urlFor(asset).width(width).auto('format').url();
};
```

### **2. Portable Text Rendering**
```typescript
// In your JournalEntryDisplay component
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      const imageUrl = urlFor(value)
        .width(800)
        .height(400)
        .fit('crop')
        .auto('format')
        .url();

      return (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          contentFit="cover"
        />
      );
    },
  },
};
```

### **3. Responsive Images Example**
```typescript
// Multiple sizes for different screen densities
function ResponsiveJournalImage({ image }: { image: any }) {
  return (
    <Image
      source={{ 
        uri: urlFor(image).width(800).auto('format').url() 
      }}
      style={styles.image}
      contentFit="cover"
      // Expo Image automatically handles different densities
    />
  );
}
```

## 🚀 Advanced Features

### **Image Transformations:**
```typescript
// Crop to square thumbnail
urlFor(image).width(200).height(200).fit('crop').url()

// Blur for loading states  
urlFor(image).blur(20).width(400).url()

// Quality optimization
urlFor(image).width(800).quality(80).auto('format').url()

// Specific format
urlFor(image).width(800).format('webp').url()
```

### **Hotspot & Crop Handling:**
The official builder automatically respects:
- **Editor crops** - Custom cropping in Sanity Studio
- **Hotspots** - Important areas that should stay in frame
- **Focal points** - Smart cropping around subjects

## 📱 Performance Benefits

### **1. CDN Optimization:**
- Images served from global edge locations
- Automatic caching and compression
- WebP/AVIF format detection

### **2. Bandwidth Savings:**
- Only load appropriate sizes for device
- Progressive loading support
- Optimized formats reduce file sizes by 30-80%

### **3. Developer Experience:**
- TypeScript support out of the box
- Consistent API across all platforms
- Automatic error handling

## 🐛 Troubleshooting

### **Common Issues:**

1. **"Cannot resolve @sanity/image-url"**
   ```bash
   npm install @sanity/image-url
   ```

2. **Images not loading:**
   - Check project ID matches your Sanity config
   - Verify dataset name ("production")
   - Ensure images exist in Content Lake

3. **TypeScript errors:**
   ```typescript
   import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
   ```

### **Debug Mode:**
```typescript
// Log the generated URL to debug
const imageUrl = urlFor(value).width(800).url();
console.log('Generated image URL:', imageUrl);
```

## 🎉 Complete Setup

Your journal app now uses:
- ✅ **Official Sanity image URL builder**
- ✅ **Portable Text renderer for rich content**  
- ✅ **Optimized image transformations**
- ✅ **Automatic format detection**
- ✅ **Global CDN delivery**

This follows Sanity's best practices and gives you enterprise-grade image handling! 🚀

## 📚 References

- [Sanity Image Documentation](https://www.sanity.io/docs/apis-and-sdks/presenting-images)
- [@sanity/image-url Package](https://www.npmjs.com/package/@sanity/image-url)
- [Portable Text React Native](https://www.sanity.io/plugins/portabletext-react-native)
