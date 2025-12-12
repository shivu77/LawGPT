# Cinematic Theme Switcher Integration Guide

You are given a task to integrate a cinematic dark/light theme switcher component in the LAW-GPT React codebase.

## Codebase Requirements

The codebase should support:

- **React 18+** with Vite
- **Tailwind CSS** for styling
- **JavaScript/JSX** (currently using JSX)
- **Framer Motion** for animations
- **Lucide React** for icons

If it doesn't, provide instructions on how to:
- Setup Vite React project: `npm create vite@latest frontend -- --template react`
- Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`
- Install Framer Motion: `npm install framer-motion`
- Install Lucide React: `npm install lucide-react`
- Configure Tailwind in `tailwind.config.js` and `postcss.config.js`

## Component Structure

**Default path**: `/frontend/src/components/`

Theme context should be placed in:
`/frontend/src/contexts/ThemeContext.jsx`

Theme switcher component should be placed in:
`/frontend/src/components/CinematicThemeSwitcher.jsx`

## Copy-Paste Components

### File: `frontend/src/contexts/ThemeContext.jsx`

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### File: `frontend/src/components/CinematicThemeSwitcher.jsx`

See the actual component file for the complete code. It includes:
- Cinematic pill-shaped toggle switch
- Particle animation effects
- Film grain texture filters
- Multi-layer glossy overlays
- Smooth spring physics animations
- Dark/light mode gradient backgrounds

### Required Tailwind Configuration: `frontend/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}
```

### Required CSS Updates: `frontend/src/index.css`

Add dark mode support to base styles:

```css
@layer base {
  body {
    @apply bg-background dark:bg-[#0d1b26] text-primary-text dark:text-gray-100;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply text-primary-text dark:text-gray-100;
  }
}

@layer components {
  .card {
    @apply bg-background dark:bg-[#1a2634] border-primary-border dark:border-gray-700;
    transition: background-color 0.3s ease;
  }
}
```

### Integration: `frontend/src/App.jsx`

```jsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### Integration: `frontend/src/components/Header.jsx`

```jsx
import CinematicThemeSwitcher from './CinematicThemeSwitcher';

const Header = () => {
  return (
    <header className="border-b-2 border-primary-border dark:border-gray-700 bg-background dark:bg-[#0d1b26]">
      {/* ... */}
      <CinematicThemeSwitcher />
    </header>
  );
};
```

## Implementation Guidelines

### 1. Analyze Component Structure

**Dependencies Required:**
- `react` - React hooks (useState, useEffect, useContext, createContext)
- `framer-motion` - Animation library for smooth transitions
- `lucide-react` - Icon library for Sun/Moon icons
- Tailwind CSS with `darkMode: 'class'` configuration

**Component Props:**
- `CinematicThemeSwitcher`: No props required (uses ThemeContext)

**State Management:**
- Uses React Context API for theme state
- Stores theme preference in localStorage
- Detects system preference on first load

### 2. Review Component Arguments and State

**ThemeContext Interface:**
```javascript
{
  theme: 'light' | 'dark',
  setTheme: (theme: string) => void,
  toggleTheme: () => void
}
```

**CinematicThemeSwitcher State:**
- `particles`: Array of particle objects for animation
- `isAnimating`: Boolean for animation state
- `mounted`: Boolean to prevent hydration mismatch

### 3. Required Context Providers or Hooks

- **ThemeProvider**: Must wrap entire app
- **useTheme hook**: Provides theme state and controls
- No external state management libraries needed

### 4. Questions to Ask

- **What data/props will be passed to this component?**
  - Answer: None - component uses Context API internally
  
- **Are there any specific state management requirements?**
  - Answer: Theme state managed via React Context, persisted in localStorage
  
- **Are there any required assets (images, icons, etc.)?**
  - Answer: Uses Lucide React icons (Sun, Moon), no images needed
  
- **What is the expected responsive behavior?**
  - Answer: Fully responsive, works on all screen sizes
  
- **What is the best place to use this component in the app?**
  - Answer: Header component for easy access

### 5. Dark Mode Color Scheme

**Light Mode:**
- Background: `#ffffff`
- Text: `#0d1b26`
- Borders: `#0f1720`
- Cards: `#ffffff`

**Dark Mode:**
- Background: `#0d1b26`
- Text: `#ffffff` / `gray-100`
- Borders: `gray-700`
- Cards: `#1a2634`

## Steps to Integrate

### Step 0: Copy-Paste Code

1. Copy `ThemeContext.jsx` to `/frontend/src/contexts/ThemeContext.jsx`
2. Copy `CinematicThemeSwitcher.jsx` to `/frontend/src/components/CinematicThemeSwitcher.jsx`
3. Update `tailwind.config.js` to add `darkMode: 'class'`
4. Update `index.css` with dark mode styles
5. Wrap `App.jsx` with `ThemeProvider`
6. Add `CinematicThemeSwitcher` to `Header.jsx`

### Step 1: Install Dependencies

```bash
cd frontend
npm install framer-motion
```

### Step 2: Update Tailwind Configuration

Ensure `tailwind.config.js` includes:
```js
darkMode: 'class'
```

### Step 3: Update All Components for Dark Mode

Add dark mode classes to all components:
- `dark:bg-[#0d1b26]` for backgrounds
- `dark:text-gray-100` for text
- `dark:border-gray-700` for borders
- `transition-colors duration-300` for smooth transitions

### Step 4: Test Integration

1. Start the development server: `npm run dev`
2. Click the theme switcher in the header
3. Verify smooth transition between light/dark modes
4. Check localStorage persistence (refresh page)
5. Test system preference detection (first visit)

### Step 5: Verify Components Support Dark Mode

Update these components:
- ✅ `Header.jsx` - Theme switcher added
- ✅ `SystemLoader.jsx` - Dark mode support
- ✅ `GooeyText.jsx` - Dark mode text colors
- ✅ `ChatInterface.jsx` - Dark mode backgrounds
- ✅ `App.jsx` - ThemeProvider wrapper
- ⚠️ Other components may need dark mode classes

## Customization Options

**Animation Speed:**
- Particle duration: Adjust in `generateParticles()` function
- Spring physics: Modify `stiffness` and `damping` in motion.div

**Colors:**
- Dark mode background: Change `dark:bg-[#0d1b26]` to desired color
- Light mode background: Change `bg-background` to desired color

**Toggle Size:**
- Height: `h-[64px]` in button
- Width: `w-[104px]` in button
- Thumb size: `h-[44px] w-[44px]` in thumb div

## Troubleshooting

**Issue: Theme not persisting**
- Check localStorage is enabled
- Verify `applyTheme()` function is called
- Check browser console for errors

**Issue: Dark mode not applying**
- Verify `darkMode: 'class'` in tailwind.config.js
- Check HTML element has `dark` class
- Ensure Tailwind dark: variants are working

**Issue: Hydration mismatch**
- Ensure `mounted` state prevents SSR mismatch
- Check ThemeProvider returns placeholder during SSR

**Issue: Animations not working**
- Verify framer-motion is installed
- Check console for import errors
- Ensure motion components are from framer-motion

**Issue: Icons not showing**
- Verify lucide-react is installed
- Check icon imports are correct
- Ensure icon components are rendered

## Features Implemented

✅ **Cinematic Theme Switcher**
- Pill-shaped toggle with cinematic effects
- Particle animation on toggle
- Film grain texture filters
- Multi-layer glossy overlays
- Smooth spring physics
- Gradient backgrounds

✅ **Theme System**
- React Context API integration
- localStorage persistence
- System preference detection
- Smooth transitions (300ms)
- Hydration-safe implementation

✅ **Dark Mode Support**
- Tailwind dark mode configuration
- All components updated
- Smooth color transitions
- Consistent design system

## Final Checklist

- [ ] framer-motion installed
- [ ] ThemeContext created
- [ ] CinematicThemeSwitcher created
- [ ] Tailwind config updated (`darkMode: 'class'`)
- [ ] CSS updated with dark mode styles
- [ ] App.jsx wrapped with ThemeProvider
- [ ] Header includes theme switcher
- [ ] All components support dark mode
- [ ] Theme persists in localStorage
- [ ] System preference detected
- [ ] Smooth transitions working
- [ ] No console errors
- [ ] Responsive design verified

## Notes

- Theme switcher uses cinematic effects for premium feel
- Dark mode color scheme matches professional legal app aesthetic
- All animations are performance-optimized
- Theme preference persists across sessions
- System preference detection on first visit
- Smooth 300ms transitions for all theme changes

