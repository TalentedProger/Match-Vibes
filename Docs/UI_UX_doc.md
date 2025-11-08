# MatchVibe - UI/UX Design Specification

**Version:** 1.0.0  
**Last Updated:** 2025-01-08  
**Document Type:** Design System & User Experience Guide

---

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design System](#design-system)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Page Specifications](#page-specifications)
7. [Animations & Interactions](#animations--interactions)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [User Journey](#user-journey)

---

## Design Philosophy

### Core Principles

**1. Minimalism**

- Clean, uncluttered interfaces
- Focus on content and functionality
- Generous whitespace
- Clear visual hierarchy

**2. Telegram-Native Feel**

- Match Telegram's design language
- Use Telegram theme colors
- Consistent with Telegram UI patterns
- Seamless integration

**3. Playful & Engaging**

- Fun animations and micro-interactions
- Delightful visual feedback
- Gamification elements
- Positive emotional response

**4. Speed & Performance**

- Instant feedback
- Smooth animations (60fps)
- Fast page transitions
- Optimistic UI updates

**5. Mobile-First**

- Optimized for touch
- Thumb-friendly navigation
- Large tap targets (minimum 44x44px)
- Gesture-based interactions

---

## Design System

### Visual Style

**Overall Aesthetic:**

- Modern, clean, and minimal
- Soft shadows and subtle depth
- Rounded corners throughout
- Smooth gradients for accents
- Card-based layouts

**Key Visual Elements:**

- Rounded corners: `12px-24px`
- Shadows: Soft, layered (elevation system)
- Border radius: Consistent across components
- Icons: Lucide icon set
- Illustrations: AI-generated, unified style

---

## Color Palette

### Primary Colors

```css
:root {
  /* Telegram Theme Colors (Dynamic) */
  --tg-theme-bg-color: var(--telegram-bg);
  --tg-theme-text-color: var(--telegram-text);
  --tg-theme-hint-color: var(--telegram-hint);
  --tg-theme-link-color: var(--telegram-link);
  --tg-theme-button-color: var(--telegram-button);
  --tg-theme-button-text-color: var(--telegram-button-text);

  /* Brand Colors */
  --primary: 255 80 120; /* Hot Pink/Coral */
  --primary-foreground: 255 255 255;

  --secondary: 100 150 255; /* Soft Blue */
  --secondary-foreground: 255 255 255;

  --accent: 255 200 100; /* Warm Yellow */
  --accent-foreground: 50 50 50;

  /* Neutrals */
  --background: 250 250 250; /* Light background */
  --foreground: 30 30 30; /* Dark text */

  --card: 255 255 255;
  --card-foreground: 30 30 30;

  --muted: 240 240 245;
  --muted-foreground: 100 100 120;

  --border: 230 230 235;

  /* Semantic Colors */
  --success: 80 200 120; /* Green */
  --error: 255 90 90; /* Red */
  --warning: 255 180 80; /* Orange */
  --info: 100 150 255; /* Blue */
}

.dark {
  --background: 20 20 25;
  --foreground: 240 240 245;
  --card: 30 30 35;
  --card-foreground: 240 240 245;
  --muted: 40 40 45;
  --muted-foreground: 160 160 170;
  --border: 50 50 55;
}
```

### Category-Specific Colors

```css
/* Food & Drinks */
--category-food: 255 140 80;

/* Movies & Entertainment */
--category-movies: 200 100 255;

/* Animals */
--category-animals: 255 180 120;

/* Relationships */
--category-relationships: 255 120 150;

/* Travel & Leisure */
--category-travel: 100 180 255;

/* Self-Perception */
--category-self: 150 150 255;

/* Fun & Random */
--category-fun: 255 200 100;
```

---

## Typography

### Font Family

**Primary Font:** System font stack

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
  Arial, sans-serif;
```

**Why System Fonts?**

- Fast loading (no font download)
- Native feel
- Optimal readability
- Platform consistency

### Font Sizes

```css
/* Text Scales */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Usage

```css
/* Headings */
h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
}
h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
}
h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

/* Body */
body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}

/* Small Text */
.text-small {
  font-size: var(--text-sm);
}
.text-tiny {
  font-size: var(--text-xs);
}
```

---

## Component Library

### 1. Buttons

#### Primary Button

```
Visual: Solid background, bold text, rounded
Usage: Main actions (Start Game, Play Again)
Sizes: Small (32px), Medium (40px), Large (48px)
States: Default, Hover, Active, Disabled, Loading
```

**Specifications:**

```css
.button-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button

```
Visual: Outline or ghost style
Usage: Secondary actions (Cancel, Back)
```

#### Icon Button

```
Visual: Icon only, circular or square
Usage: Navigation, actions
Minimum size: 44x44px (touch target)
```

---

### 2. Cards

#### Standard Card

```
Visual: White background, soft shadow, rounded corners
Usage: Game results, profile sections, history items
Padding: 16-24px
Border radius: 16px
Shadow: 0 2px 12px rgba(0, 0, 0, 0.08)
```

#### Category Card

```
Visual: Image background, gradient overlay, title
Usage: Category selection
Aspect ratio: 3:2 or 4:3
Border radius: 20px
Overlay: Linear gradient from transparent to rgba(0,0,0,0.6)
```

#### Game Card (Swipeable)

```
Visual: Full-screen card, image + text
Usage: Game questions
Dimensions: Screen width - 32px margin
Border radius: 24px
Shadow: 0 8px 24px rgba(0, 0, 0, 0.12)
```

**Card Specifications:**

```css
.card {
  background: hsl(var(--card));
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-hover {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

---

### 3. Progress Indicators

#### Progress Bar

```
Visual: Horizontal bar, filled portion
Usage: Game progress (12 steps)
Height: 4-8px
Border radius: Full (pill shape)
Animation: Smooth fill
```

**Specifications:**

```css
.progress-bar {
  width: 100%;
  height: 6px;
  background: hsl(var(--muted));
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: hsl(var(--primary));
  transition: width 0.3s ease;
}
```

#### Timer (Circular)

```
Visual: Circular progress, countdown number
Usage: 20-second timer per question
Size: 60-80px diameter
Colors: Green → Yellow → Red as time runs out
```

---

### 4. Navigation

#### Bottom Navigation Bar

```
Visual: Fixed bottom bar, 3-4 icons with labels
Usage: Main app navigation
Height: 64px
Items: Home, Stats, Profile
Background: Blur effect (backdrop-filter)
Shadow: Top shadow
```

**Navigation Specifications:**

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 16px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: hsl(var(--muted-foreground));
  transition: color 0.2s;
}

.nav-item.active {
  color: hsl(var(--primary));
}
```

---

### 5. Modals & Dialogs

#### Standard Modal

```
Visual: Centered card, backdrop overlay
Usage: Confirmations, information
Max width: 400px
Padding: 24px
Border radius: 20px
Backdrop: rgba(0, 0, 0, 0.5) with blur
```

#### Bottom Sheet

```
Visual: Slides up from bottom
Usage: Mobile-friendly selections
Height: Auto, max 80vh
Border radius: 24px (top only)
```

---

### 6. Input Fields

#### Text Input

```
Visual: Rounded, subtle border
Usage: Username edit, search
Height: 44px
Padding: 12px 16px
Border radius: 12px
Border: 1px solid hsl(var(--border))
Focus: Border color changes, subtle shadow
```

---

### 7. Badges & Labels

#### Achievement Badge

```
Visual: Icon + label, colorful background
Usage: User achievements
Size: Small (32px), Medium (48px)
Border radius: 8px or circular
```

#### Match Percentage Badge

```
Visual: Large percentage number + label
Usage: Result display
Font size: 48px (percentage)
Font weight: Bold
Color: Gradient or solid primary
```

---

## Page Specifications

### 1. Home Page

**Layout:**

```
┌──────────────────────────┐
│   Logo / Header          │
├──────────────────────────┤
│                          │
│   "Готовы начать игру?"  │
│   (Illustration)         │
│                          │
│   [Погнали! Button]      │
│                          │
├──────────────────────────┤
│   Active Invitations     │
│   (if any)               │
├──────────────────────────┤
│   Recent Games           │
│   (Horizontal Carousel)  │
│                          │
└──────────────────────────┘
```

**Components:**

- Hero section with illustration
- Large primary button (Start Game)
- Invitation notification banner (conditional)
- Game history carousel
- Bottom navigation

**Colors:** Light background, primary accents

---

### 2. Category Selection Page

**Layout:**

```
┌──────────────────────────┐
│   ← Back   Категории     │
├──────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐ │
│  │ 🍕 │  │ 🎬 │  │ 🐶 │ │
│  │Food│  │Mov │  │Ani │ │
│  └────┘  └────┘  └────┘ │
│  ┌────┐  ┌────┐  ┌────┐ │
│  │ 💞 │  │ 🏖️ │  │ 💡 │ │
│  │Rel │  │Trv │  │Fun │ │
│  └────┘  └────┘  └────┘ │
└──────────────────────────┘
```

**Grid:**

- 2 columns on mobile
- 3-4 columns on tablet/desktop
- Gap: 16px
- Card aspect ratio: 3:2

**Card Elements:**

- Background image with gradient overlay
- Category icon (emoji or SVG)
- Category name
- Hover effect: Scale up slightly

---

### 3. Waiting Room

**Layout:**

```
┌──────────────────────────┐
│                          │
│   Ждём партнёра...       │
│                          │
│   (Animated Spinner      │
│    or Illustration)      │
│                          │
│   [Share Link Button]    │
│   [Cancel Button]        │
│                          │
└──────────────────────────┘
```

**Animation:**

- Pulsing animation on spinner
- Fade in when ready
- Countdown (3...2...1) before game starts

---

### 4. Game Room

**Layout:**

```
┌──────────────────────────┐
│  ●●●●●○○○○○○○  [20s]      │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │   [Card Image]     │  │
│  │                    │  │
│  │   Question Text    │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
│  ← Swipe Hints →         │
│                          │
└──────────────────────────┘
```

**Key Elements:**

- Progress dots (12 total)
- Timer (circular, top right)
- Large swipeable card
- Swipe indicators (👈 / 👉)
- Haptic feedback on swipe

**Card Interactions:**

- Drag to swipe
- Snap back if release too early
- Fly off screen on successful swipe
- Subtle rotation based on drag angle

---

### 5. Result Screen

**Layout:**

```
┌──────────────────────────┐
│   Ваши результаты        │
├──────────────────────────┤
│   Your Favorite:         │
│   🍕 Italian Food        │
│                          │
│   Partner's Favorite:    │
│   🍣 Japanese Food       │
│                          │
│   ────────────────       │
│                          │
│   💫 Ваш общий вайб:     │
│   🍝 Pasta               │
│                          │
│   ┌───────────────────┐  │
│   │       68%         │  │
│   │   Совпадение      │  │
│   └───────────────────┘  │
│                          │
│   [Share] [Play Again]   │
└──────────────────────────┘
```

**Animations:**

- Fade in elements sequentially
- Percentage counter animation (0 → 68%)
- Confetti effect for high matches (>70%)
- Smooth reveal

**Visual Hierarchy:**

- Large percentage badge (most prominent)
- Individual favorites (medium emphasis)
- Shared item (highlighted)

---

### 6. Profile Page

**Layout:**

```
┌──────────────────────────┐
│   Avatar   Username      │
│            [Edit]         │
├──────────────────────────┤
│   Stats:                 │
│   ┌────┐ ┌────┐ ┌────┐  │
│   │ 24 │ │ 18 │ │ 12 │  │
│   │Game│ │Mtch│ │Frnd│  │
│   └────┘ └────┘ └────┘  │
├──────────────────────────┤
│   Achievements           │
│   🏆 🎯 ⭐ 💎            │
├──────────────────────────┤
│   Favorites              │
│   (List of items)        │
└──────────────────────────┘
```

**Sections:**

- Profile header (avatar, name, edit button)
- Stats cards (games, matches, friends)
- Achievement badges
- Favorites list

---

### 7. Statistics Page

**Layout:**

```
┌──────────────────────────┐
│   Статистика             │
├──────────────────────────┤
│   Overall Match Rate:    │
│   ┌─────────────────┐    │
│   │   Pie Chart     │    │
│   │    65%          │    │
│   └─────────────────┘    │
├──────────────────────────┤
│   Fun Facts:             │
│   💡 You love Italian    │
│      food 87% of time    │
├──────────────────────────┤
│   Partners:              │
│   [Partner List]         │
└──────────────────────────┘
```

**Visualizations:**

- Pie chart for compatibility
- Bar charts for category preferences
- Timeline of games

---

## Animations & Interactions

### Animation Principles

1. **Duration:**
   - Micro-interactions: 150-200ms
   - Page transitions: 300-400ms
   - Complex animations: 400-600ms

2. **Easing:**
   - Default: `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)`
   - Bouncy: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
   - Spring: Use Framer Motion spring physics

3. **Performance:**
   - Use `transform` and `opacity` (GPU-accelerated)
   - Avoid animating `width`, `height`, `left`, `top`
   - Use `will-change` sparingly

### Key Animations

#### 1. Swipe Animation

```javascript
// Framer Motion config
const swipeVariants = {
  initial: { x: 0, rotate: 0, opacity: 1 },
  swipeLeft: {
    x: -window.innerWidth,
    rotate: -15,
    opacity: 0,
    transition: { duration: 0.3 },
  },
  swipeRight: {
    x: window.innerWidth,
    rotate: 15,
    opacity: 0,
    transition: { duration: 0.3 },
  },
}
```

#### 2. Page Transition

```javascript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}
```

#### 3. Button Press

```css
.button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}
```

#### 4. Percentage Counter

```javascript
// Animate from 0 to target percentage
// Use react-spring or Framer Motion
// Duration: 1.5-2 seconds
// Easing: ease-out
```

#### 5. Confetti Effect

```javascript
// Trigger on high match (>70%)
// Use react-confetti or similar
// Duration: 3 seconds
// Particles: 100-150
```

### Micro-Interactions

1. **Button Hover:** Slight lift + shadow increase
2. **Card Hover:** Lift + shadow increase
3. **Tap Feedback:** Scale down (0.95)
4. **Haptic Feedback:** On swipe, button press
5. **Loading States:** Skeleton screens, spinners
6. **Success/Error:** Toast notifications

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--mobile: 0px; /* Default */
--tablet: 640px; /* sm */
--desktop: 1024px; /* lg */
--wide: 1280px; /* xl */
```

### Layout Adjustments

**Mobile (< 640px):**

- Single column layout
- Full-width cards
- Bottom navigation
- Large touch targets
- Reduced padding

**Tablet (640px - 1024px):**

- 2-column grids
- Wider cards
- More whitespace
- Side navigation option

**Desktop (> 1024px):**

- 3-4 column grids
- Max-width container (720px for content)
- Centered layout
- Hover states active

---

## Accessibility

### WCAG 2.1 Level AA Compliance

1. **Color Contrast:**
   - Text on background: Minimum 4.5:1
   - Large text: Minimum 3:1
   - Interactive elements: 3:1

2. **Focus States:**
   - Visible focus indicators
   - Keyboard navigation support
   - Tab order logical

3. **Touch Targets:**
   - Minimum 44x44px
   - Adequate spacing (8px)

4. **Screen Readers:**
   - Semantic HTML
   - ARIA labels where needed
   - Alt text for images

5. **Motion:**
   - Respect `prefers-reduced-motion`
   - Optional animation toggle

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## User Journey

### Primary Flow

```
1. Open App (Telegram)
   ↓
2. Authenticate (Auto via Telegram)
   ↓
3. Home Page
   ↓
4. Tap "Let's Play"
   ↓
5. Select Category
   ↓
6. Create Room / Get Link
   ↓
7. Share Link to Partner
   ↓
8. Waiting Room (Partner Joins)
   ↓
9. Countdown (3, 2, 1)
   ↓
10. Game Loop:
    - View Card
    - Swipe Left/Right
    - Timer Countdown
    - Next Card
    (Repeat 12 times)
   ↓
11. Processing Results
   ↓
12. Result Screen
    - View Match %
    - View Favorites
    - View Shared Item
   ↓
13. Options:
    - Share Results
    - Play Again
    - View Profile
    - View Stats
```

### Alternative Flows

**Join via Invitation:**

```
1. Receive Link (Telegram)
   ↓
2. Tap Link → Open App
   ↓
3. Authenticate
   ↓
4. Join Room
   ↓
5. [Continue from step 8]
```

**View Statistics:**

```
Home → Bottom Nav (Stats) → Statistics Page
```

**Edit Profile:**

```
Home → Bottom Nav (Profile) → Profile Page → Edit
```

---

## Loading States

### Skeleton Screens

Use skeleton screens instead of spinners for better perceived performance:

```
┌──────────────────────────┐
│   ▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓      │  (Animated shimmer)
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓         │
│                          │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│   ▓▓▓▓▓▓▓▓▓             │
└──────────────────────────┘
```

### Progress Indicators

- **Determinate:** Progress bar (game progress)
- **Indeterminate:** Spinner (loading data)
- **Skeleton:** Content placeholder (initial load)

---

## Error States

### Empty States

```
┌──────────────────────────┐
│         📭               │
│   No games yet           │
│   Start playing!         │
│                          │
│   [Start Game Button]    │
└──────────────────────────┘
```

### Error Messages

```
┌──────────────────────────┐
│         ⚠️               │
│   Something went wrong   │
│   Please try again       │
│                          │
│   [Retry Button]         │
└──────────────────────────┘
```

**Tone:** Friendly, helpful, not technical

---

## Notes

- All measurements in rem for accessibility
- Test on real devices (iOS, Android)
- Respect Telegram theme colors
- Smooth performance on mid-range devices
- Battery-conscious animations

---

**Cross-References:**

- See `/Docs/Implementation.md` for development stages
- See `/Docs/project_structure.md` for component locations
- See `/Docs/tech_stack.md` for UI library details
- See `/Docs/PRD.md` for feature requirements
