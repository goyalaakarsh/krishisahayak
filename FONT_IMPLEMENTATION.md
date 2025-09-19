# DM Sans Font Implementation Guide

## Overview
This implementation provides DM Sans font support throughout the KrishiSahayak app using React Native best practices.

## Important Notes
- **React Native doesn't support global font inheritance** like CSS
- **All text must be wrapped in `<Text>` components** with explicit fontFamily
- **You cannot set a default font for an entire subtree** in React Native

## Font Variants Available
- `DM-Regular` (400 weight)
- `DM-Medium` (500 weight) 
- `DM-Bold` (700 weight)

## Usage Methods

### 1. Typography Component (Recommended)
```tsx
import Typography from '../components/Typography';

<Typography variant="h1">Heading 1</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="caption">Caption text</Typography>
```

### 2. Direct Style Props
```tsx
import { fonts } from '../utils/fonts';

<Text style={{ fontFamily: fonts.regular, fontSize: 16 }}>
  Regular text
</Text>
<Text style={{ fontFamily: fonts.medium, fontSize: 16 }}>
  Medium text
</Text>
<Text style={{ fontFamily: fonts.bold, fontSize: 16 }}>
  Bold text
</Text>
```

### 3. Tailwind Classes
```tsx
<Text className="font-dm-regular text-lg">Regular text</Text>
<Text className="font-dm-medium text-lg">Medium text</Text>
<Text className="font-dm-bold text-lg">Bold text</Text>
```

### 4. Typography Scale
```tsx
import { typography } from '../utils/fonts';

<Text style={typography.h1}>Heading 1</Text>
<Text style={typography.body}>Body text</Text>
<Text style={typography.caption}>Caption text</Text>
```

## Typography Variants
- `h1` - 32px, Bold
- `h2` - 28px, Bold
- `h3` - 24px, Bold
- `h4` - 20px, Bold
- `h5` - 18px, Medium
- `h6` - 16px, Medium
- `body` - 16px, Regular
- `bodyLarge` - 18px, Regular
- `bodySmall` - 14px, Regular
- `label` - 14px, Medium
- `caption` - 12px, Regular

## Migration Guide

### Before (Incorrect)
```tsx
// This won't work in React Native
<View>
  <Text>Some text</Text> {/* No font applied */}
</View>
```

### After (Correct)
```tsx
// Use Typography component
<Typography variant="body">Some text</Typography>

// Or use direct styles
<Text style={{ fontFamily: 'DM-Regular' }}>Some text</Text>

// Or use Tailwind
<Text className="font-dm-regular">Some text</Text>
```

## Best Practices

1. **Use Typography component** for consistent styling
2. **Always wrap text in Text components** - React Native requires this
3. **Use semantic variants** (h1, body, caption) instead of arbitrary sizes
4. **Test on both iOS and Android** - font rendering may differ
5. **Consider accessibility** - ensure sufficient contrast and readable sizes

## Troubleshooting

### Fonts not loading
- Check that fonts are properly loaded in `_layout.tsx`
- Verify font names match exactly: `'DM-Regular'`, `'DM-Medium'`, `'DM-Bold'`
- Ensure splash screen is hidden after fonts load

### Text not showing
- Make sure all text is wrapped in `<Text>` components
- Check that fontFamily is applied correctly
- Verify the font variant exists

### Styling issues
- Use explicit fontSize and lineHeight for custom sizing
- Test with different screen sizes
- Check Tailwind class conflicts

## Files Modified
- `app/_layout.tsx` - Font loading and splash screen management
- `tailwind.config.js` - Font family configuration
- `app/globals.css` - Font utilities (Tailwind)
- `app/utils/fonts.ts` - Font constants and typography scale
- `app/components/Text.tsx` - Custom Text component with DM Sans
- `app/components/Typography.tsx` - Typography component with variants
