🧭 MatchVibe — Full Application Map (Telegram Mini App)

1. Overview

App type: Telegram Mini App (WebApp)
Goal: Help users find shared interests, preferences, and emotions through quick interactive games.
Max players per room: 2
Main interaction: Swipe right (like) / Swipe left (dislike)
Core idea: Match by vibe — find what connects you.

2. Global App Structure
   MatchVibe
   │
   ├── Home
   │ ├── Invitation Banner
   │ ├── Start Button (“Let’s Play!”)
   │ ├── Active Invitations Popup
   │ ├── Past Sessions Section
   │ └── Results Summary (after game)
   │
   ├── Category Selection
   │ ├── Category Grid (Food, Movies, Music, etc.)
   │ ├── Category Details
   │ └── Start Test Button
   │
   ├── Game Room
   │ ├── Waiting Screen (for second player)
   │ ├── Countdown / Ready State
   │ ├── Game Stage (cards + swipes)
   │ ├── Timer (20 seconds per card)
   │ ├── Progress Bar (12+ steps)
   │ ├── Result Calculation
   │ └── Result Screen
   │
   ├── Profile
   │ ├── User Info (Name, Avatar)
   │ ├── Achievements
   │ ├── Stats Summary
   │ ├── Favorites
   │ ├── Settings
   │ └── Share Profile
   │
   ├── Statistics
   │ ├── Overview Metrics
   │ ├── Compatibility Graph (pie chart)
   │ ├── Partner Sort Option
   │ ├── Fun Facts Section
   │ └── Analytics Insights
   │
   └── Premium Zone
   ├── Real-Time Partner View
   ├── Create Custom Tests
   ├── Extended Analytics
   ├── Unique Themes
   └── Telegram Stars Integration

3. Page-by-Page Breakdown
   🏠 3.1 Home Page

Purpose: Entry point for users to start or join a session.

Elements:

App logo

Header: “Ready to start the game?”

Illustration image

Primary CTA: “Let’s Play!” button → creates a new room

Active invitations popup (if someone sent a link)

Recent games carousel at bottom (cards showing test names & results)

After completing a game:

Result summary widget

“Play Again” button

Actions:

Start Game → goes to Category Selection

Join Invitation → opens Game Room (waiting state)

🎯 3.2 Category Selection

Purpose: Choose which topic to play.

Layout:

Grid or scrollable list of categories (with icons/images).

Each category card includes:

Image (AI-generated)

Category name

Short tagline (e.g., “Discover your food vibe!”)

Main Categories:

Food & Drinks

Entertainment & Culture

Animals

Relationships & Personality

Leisure & Travel

Self-Perception

Fun & Random

Actions:

Tap on a category → open Category Details

“Start Test” button → creates new Game Room and generates test cards

🕹️ 3.3 Game Room

Purpose: Core gameplay — two users interact simultaneously.

Sub-States:

1. Waiting Screen

Shown to the host while waiting for the second player.

Display: animated “Waiting for your partner…”

When both join → transition to Countdown.

2. Countdown / Ready State

“Get Ready!” animation (3…2…1).

Then automatically starts the first card.

3. Game Stage

Each stage shows:

Image + short text (AI-generated card)

Timer (20 sec)

Swipe right = 👍 Like / Agree

Swipe left = 👎 Dislike / Disagree

No skipping allowed.

Progress bar shows completion percentage.

Responses are recorded for both players.

4. Result Calculation

Algorithm compares both answer sets.

Calculates match percentage.

Selects each user’s “favorite element”.

Finds a “shared element” liked by both.

5. Result Screen

Displays:

Player A’s favorite item

Player B’s favorite item

“Perfect match” item (with %)

Example:

🎵 Your shared vibe: Indie Music (55% match)

“Play Again” button → back to Category Selection

“Share Results” → send formatted message to Telegram chat

👤 3.4 Profile Page

Purpose: Display personal data, progress, and favorites.

Sections:

Section Description
User Info Telegram name + avatar (editable name only)
Stats Overview Total games played, total matches, # of friends
Achievements Visual badges for milestones (e.g., “10 matches reached”)
Favorites Collected “favorite items” from all categories
Settings Language switch (RU/EN), notification toggles
Share Profile Generates sharable link to “Favorites” page

Actions:

Edit name

View achievements

Share favorites via message

📊 3.5 Statistics Page

Purpose: Show analytical insights about user matches and behavior.

Sections:

Overview Metrics

Games completed

Matches found

Total partners played with

Compatibility Graph

Circular diagram displaying % of overall compatibility

Partners View

Sort by partner name or play date

Fun Facts

Small text cards with playful insights (e.g., “You and Alex agreed 90% on desserts!”)

Analytics Insights

Optional AI-generated observations (“You often like Asian cuisine.”)

💎 3.6 Premium Zone

Purpose: Unlock advanced interaction and personalization.

Features:

Feature Description
Real-Time Partner View See partner’s swipe in real time
Custom Tests Users can create and share personalized quizzes
Extended Analytics Deep compatibility breakdown per category
Exclusive Themes Access rare/seasonal content
Telegram Stars Payment & upgrade system integration

Note: Premium is subscription-based (Freemium model).

4. User Flow Summary
   Launch App
   └──> Home
   ├── “Let’s Play” → Category Selection → Game Room
   ├── “Join via Link” → Game Room (Waiting)
   ├── After Game → Results → Home
   ├── Profile → Favorites / Settings
   └── Statistics → Analytics

5. Core Interactions
   Action Trigger Result
   Swipe Right Like Save positive answer
   Swipe Left Dislike Save negative answer
   Timer Expiry No action Auto-record as “neutral”
   Room Join Invitation Link Sync with host’s room
   Game Complete All stages done Show results screen
   Share Results “Share” button Send Telegram message
   Save Favorite End of test Add to “Favorites” list
   Start Premium Trial Premium section Activate premium features
6. Data & Storage Model (Simplified)
   Entity Fields
   User id, telegram_id, name, avatar_url, stats, premium_status
   Room id, category, players[], state, start_time, end_time
   Response user_id, question_id, answer (1/0), timestamp
   Category id, name, description, image
   Result room_id, match_percentage, shared_item, user_a_fav, user_b_fav
   Favorites user_id, item_name, category, date_added
7. Visual & UX Guidelines

UI Style: clean, rounded, modern

Colors: pastel tones with accent highlights per category

Typography: large readable headers, clean sans-serif text

Animation: smooth swipe transitions, soft loading effects

Illustrations: AI-generated, unified aesthetic

8. Notifications & Messaging

In-App Popups:

“Your friend invited you to play!”

“New match found!”

“You’ve completed 10 games — achievement unlocked!”

Telegram Message Templates:

“We just matched 68% on ‘Favorite Movies’! Try it yourself 👉 [Bot Link]”

“Find your vibe with me on MatchVibe!”

9. Future Extensions (Post-MVP)

Friend search by compatibility

Seasonal themes (e.g., “Winter Vibes”)

Audio/video content in cards

Multi-language support (English version)

Achievements with Telegram stickers

10. Navigation Summary (Visual Tree)
    Home
    │
    ├── Start Game → Category Selection → Game Room
    │ └── Result Screen
    │
    ├── Profile
    │ ├── Favorites
    │ ├── Achievements
    │ └── Settings
    │
    ├── Statistics
    │ ├── Overview
    │ ├── Graphs
    │ └── Fun Facts
    │
    └── Premium Zone
    ├── Real-Time View
    ├── Custom Tests
    ├── Analytics
    └── Stars Integration
