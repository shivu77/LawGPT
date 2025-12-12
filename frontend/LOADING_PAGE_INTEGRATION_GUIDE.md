# Loading Page Component Integration Guide

You are given a task to integrate a loading page component in the LAW-GPT React codebase.

## Codebase Requirements

The codebase should support:

- **React 18+** with Vite
- **Tailwind CSS** for styling
- **JavaScript/JSX** (currently using JSX, can be converted to TypeScript if needed)
- **Lucide React** for icons

If it doesn't, provide instructions on how to:
- Setup Vite React project: `npm create vite@latest frontend -- --template react`
- Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`
- Install Lucide React: `npm install lucide-react`
- Configure Tailwind in `tailwind.config.js` and `postcss.config.js`

## Component Structure

Determine the default path for components. 

**Default path**: `/frontend/src/components/`

If the component folder doesn't exist, create it. The loading component should be placed in:
`/frontend/src/components/SystemLoader.jsx`

## Copy-Paste This Component

### File: `frontend/src/components/SystemLoader.jsx`

```jsx
import React, { useEffect } from 'react';
import { Scale } from 'lucide-react';

const SystemLoader = ({ onReady }) => {
  useEffect(() => {
    // Simple delay for smooth transition
    const timer = setTimeout(() => {
      onReady();
    }, 800);

    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary-text/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-text border-t-transparent animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Scale className="w-8 h-8 text-primary-text" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-heading font-bold text-primary-text mb-2 animate-fade-in">
          LAW-GPT
        </h1>

        {/* Loading Text */}
        <p className="text-primary-textSecondary text-sm animate-pulse-text">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default SystemLoader;
```

### File: `frontend/src/App.jsx` (Integration Example)

```jsx
import React, { useState } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import SystemLoader from './components/SystemLoader';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [systemReady, setSystemReady] = useState(false);

  const handleSystemReady = () => {
    setSystemReady(true);
  };

  if (!systemReady) {
    return <SystemLoader onReady={handleSystemReady} />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      <main className="flex-1 flex flex-col">
        <ChatInterface 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

### Required CSS Animations: `frontend/src/index.css`

Add these animations to your CSS file:

```css
/* Slow Spin Animation */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

/* Pulse Text Animation */
@keyframes pulse-text {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-text {
  animation: pulse-text 2s ease-in-out infinite;
}

/* Fade In Animation */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in forwards;
}
```

## Implementation Guidelines

### 1. Analyze Component Structure

**Dependencies Required:**
- `react` - React hooks (useState, useEffect)
- `lucide-react` - Icon library for Scale icon
- Tailwind CSS classes for styling

**Component Props:**
- `onReady`: Callback function that gets called when loading is complete

**State Management:**
- Uses `useState` in parent component (`App.jsx`) to track `systemReady`
- Uses `useEffect` hook for timing the loading transition

### 2. Review Component Arguments and State

**Props Interface:**
```typescript
interface SystemLoaderProps {
  onReady: () => void;
}
```

**State in Parent Component:**
- `systemReady: boolean` - Controls when to show loading vs main app

### 3. Required Context Providers or Hooks

- No context providers needed
- Only requires React hooks
- No external state management libraries

### 4. Questions to Ask

- **What data/props will be passed to this component?**
  - Answer: Only `onReady` callback function
  
- **Are there any specific state management requirements?**
  - Answer: Parent component manages `systemReady` state
  
- **Are there any required assets (images, icons, etc.)?**
  - Answer: Uses `Scale` icon from `lucide-react`, no images needed
  
- **What is the expected responsive behavior?**
  - Answer: Fully responsive, centered layout works on all screen sizes
  
- **What is the best place to use this component in the app?**
  - Answer: At the root level (`App.jsx`) to show before main app loads

### 5. Customization Options

**Timing:**
- Current delay: 800ms
- Can be adjusted in `setTimeout` duration

**Animations:**
- Spinning border: 3s rotation
- Text pulse: 2s fade
- Title fade-in: 0.5s

**Styling:**
- Uses Tailwind CSS utility classes
- Follows existing design system colors (`primary-text`, `primary-textSecondary`, `background`)
- Fully customizable via className props

## Steps to Integrate

### Step 0: Copy-Paste Code

1. Copy `SystemLoader.jsx` to `/frontend/src/components/SystemLoader.jsx`
2. Update `App.jsx` to include SystemLoader integration
3. Add required CSS animations to `index.css`

### Step 1: Install Dependencies

```bash
cd frontend
npm install lucide-react
```

### Step 2: Verify Tailwind Configuration

Ensure `tailwind.config.js` includes:
- Custom colors: `primary-text`, `primary-textSecondary`, `background`
- Custom fonts: `font-heading`
- All animations are properly configured

### Step 3: Test Integration

1. Start the development server: `npm run dev`
2. Verify loading screen appears on initial load
3. Check that it transitions smoothly to main app after 800ms
4. Test on different screen sizes for responsiveness

### Step 4: Customize (Optional)

**Change Loading Duration:**
```jsx
// In SystemLoader.jsx, change the timeout duration
setTimeout(() => {
  onReady();
}, 1500); // Change from 800 to desired milliseconds
```

**Change Loading Text:**
```jsx
<p className="text-primary-textSecondary text-sm animate-pulse-text">
  Initializing Legal AI...
</p>
```

**Add More Animations:**
- Add floating animation to logo
- Add text shimmer effect
- Add progress indicator

## Alternative: Enhanced Loading Screen

If you want a more advanced loading screen with morphing text (similar to gooey-text-morphing), you can:

1. Create a JavaScript version of the gooey-text component
2. Integrate it into SystemLoader
3. Show rotating text like: "Loading...", "Initializing...", "Almost Ready..."

**Example Enhanced Version:**

```jsx
// Add morphing text array
const loadingTexts = ["Loading...", "Initializing AI...", "Almost Ready..."];

// Use in component with rotation effect
```

## Troubleshooting

**Issue: Loading screen doesn't appear**
- Check that `systemReady` starts as `false`
- Verify `SystemLoader` is imported correctly
- Check console for errors

**Issue: Animations not working**
- Verify CSS animations are in `index.css`
- Check Tailwind config includes custom animations
- Ensure `animate-spin-slow`, `animate-pulse-text`, `animate-fade-in` classes exist

**Issue: Icon not showing**
- Verify `lucide-react` is installed
- Check that `Scale` icon is imported correctly

**Issue: Styling looks wrong**
- Verify Tailwind custom colors are defined
- Check that `bg-background`, `text-primary-text` classes are configured
- Ensure design system colors match project theme

## Final Checklist

- [ ] SystemLoader component created
- [ ] App.jsx updated with loading logic
- [ ] CSS animations added to index.css
- [ ] lucide-react installed
- [ ] Component tested in browser
- [ ] Responsive design verified
- [ ] Smooth transition confirmed

## Notes

- Loading screen is intentionally simple and fast (800ms)
- No backend verification - just smooth visual transition
- Can be enhanced later with progress indicators or morphing text
- Fully integrated with existing design system

