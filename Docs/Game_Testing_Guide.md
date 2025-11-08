# Game Testing Guide - Stage 5

Quick guide to test the interactive card game functionality.

---

## Prerequisites

1. ✅ Supabase project configured
2. ✅ Database schema deployed
3. ✅ Categories seeded (5 categories)
4. ⚠️ **Questions NOT seeded yet** (need to run seed script)

---

## Step 1: Seed Questions Data

Run the questions seed file in Supabase SQL Editor:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `Docs/questions_seed.sql`
4. Execute the script
5. Verify: Should see message "✅ Questions seed data inserted successfully!"

**Expected Result:** 75 questions created (15 per category)

---

## Step 2: Start Development Server

```bash
pnpm dev
```

Server should start on `http://localhost:3002`

---

## Step 3: Test Game Flow

### Create a Room

1. Navigate to home page
2. Click "Создать комнату" or select a category
3. Select a category (e.g., "Еда и напитки")
4. Room should be created
5. Copy invitation link

### Join as Second Player

**Option A: Use incognito/different browser**

1. Open invitation link in incognito window
2. Login as different Telegram user
3. Join the room

**Option B: For quick testing**

- Manually add guest_id to room in Supabase
- Update room status to 'playing'

### Start Game

1. Once both players in room, game should start
2. You should see:
   - ✅ Circular timer (20s)
   - ✅ Progress dots (15 dots)
   - ✅ Swipeable card with image
   - ✅ Partner progress bar (if guest present)
   - ✅ Question counter at bottom

### Test Interactions

#### Swipe Gestures

- **Swipe Right:** Like (card should fly right, green heart appears)
- **Swipe Left:** Dislike (card should fly left, red X appears)
- **Weak Swipe:** Card snaps back to center

#### Timer

- Wait for timer to reach 0
- Should auto-submit "dislike" and advance
- Timer should reset to 20s for next question

#### Progress

- Progress dots should update as you advance
- Current question dot should be highlighted
- Partner progress should update in real-time

#### Animations

- New cards should fade in with scale animation
- Swipe should be smooth with rotation
- Timer should pulse when < 3 seconds

---

## Step 4: Verify Backend

### Check Responses Table

In Supabase:

```sql
SELECT * FROM responses
WHERE room_id = 'YOUR_ROOM_ID'
ORDER BY timestamp DESC;
```

Should see:

- One row per swipe
- `answer` = 0 (dislike) or 1 (like)
- `user_id` matches player
- `question_id` matches swiped card

### Check Room Status

```sql
SELECT * FROM rooms WHERE id = 'YOUR_ROOM_ID';
```

Should show:

- `status` = 'playing' (or 'completed' if both finished)
- `completed_at` = timestamp (if completed)

---

## Step 5: Test Real-Time Sync

**Setup:** Two browser windows side-by-side

1. Window 1: Player A swipes a card
2. Window 2: Should see Player A's progress update immediately
3. Both players swipe cards
4. Progress bars should stay in sync

---

## Expected Behavior

### ✅ Correct Behavior

- Card swipes smoothly
- Timer counts down from 20
- Auto-advances on timeout
- Progress updates correctly
- Partner progress shows in real-time
- No ability to skip questions
- Haptic feedback on Telegram
- Smooth 60fps animations
- Questions load from database
- Responses save immediately

### ❌ Issues to Watch For

- Timer not counting down → Check useTimer hook
- Cards not swiping → Check drag constraints
- Real-time not working → Check Supabase Realtime
- Questions not loading → Check API endpoint
- Progress bar stuck → Check game store state
- No haptic feedback → Check Telegram WebApp

---

## Debug Tips

### Console Logs

Open browser console to see:

- "New response:" when partner swipes
- "Room updated:" when room status changes
- Error messages from API calls

### React DevTools

Install React DevTools to inspect:

- useGameStore state
- useTimer values
- Component re-renders

### Supabase Logs

Check Supabase → Logs → Edge Functions for API errors

---

## Performance Checks

### Frame Rate

- Open Chrome DevTools → Performance
- Record during game session
- Should maintain ~60fps during animations

### Network

- Check Network tab
- API calls should be < 500ms
- Real-time connection should be persistent

### Memory

- Monitor memory usage in Task Manager
- Should not increase significantly over time
- No memory leaks in game loop

---

## Mobile Testing

Test on actual mobile device:

1. Expose local dev server
2. Connect via ngrok or similar
3. Test swipe gestures on touchscreen
4. Verify haptic feedback works
5. Check responsive layout
6. Test in Telegram WebApp

---

## Common Test Scenarios

### Scenario 1: Normal Game Flow

- ✅ Both players complete all 15 questions
- ✅ Room status updates to 'completed'
- ✅ Redirect to results page

### Scenario 2: Partial Completion

- ✅ Player A completes, Player B doesn't
- ✅ Player A can still see progress
- ✅ No redirect until both complete

### Scenario 3: Timer Expiry

- ✅ Let timer reach 0 on every question
- ✅ All should auto-submit as "dislike"
- ✅ Game should complete normally

### Scenario 4: Connection Loss

- ✅ Disconnect network
- ✅ Reconnect
- ✅ Real-time should resume
- ✅ Progress should sync

---

## Checklist Before Stage 6

Before moving to Match Algorithm:

- [ ] Questions seeded successfully
- [ ] Game loads without errors
- [ ] Swipe mechanic works smoothly
- [ ] Timer counts down correctly
- [ ] Auto-advance on timeout works
- [ ] Progress bar updates
- [ ] Partner progress shows
- [ ] Real-time sync working
- [ ] Responses save to database
- [ ] Room status updates
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Haptic feedback (on Telegram)

---

## Next Stage

Once all tests pass, proceed to **Stage 6: Match Algorithm**

This includes:

- Calculate compatibility percentage
- Find shared favorites
- Generate results
- Store in results table

---

**Happy Testing! 🎮**
