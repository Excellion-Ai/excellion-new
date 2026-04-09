

## Plan: Fix Builder Course Generation Pipeline

### Problem
The builder is failing to generate courses due to three issues:
1. The homepage "Start Building Free" button only scrolls to #how-it-works instead of navigating to the builder
2. Guided mode data (duration, format, price, experience, attachments) is not passed through to the generation edge function
3. Error messages are generic and unhelpful

### Changes

#### 1. Fix HeroSection.tsx — Wire CTAs to the builder
- Import `useNavigate`, `useAuth`, `useSubscription`, `supabase`, `toast`
- Replace `handleGenerate()` with real builder navigation logic:
  - If user is allowed (founder email or subscribed): store the prompt + guided data as a structured JSON object in `localStorage` key `builder-draft`, create a `builder_projects` row, and navigate to `/studio/:id`
  - If user exists but not subscribed: trigger `startCheckout`
  - If no user: navigate to `/auth`
- Keep "See how it works" as scroll-only
- Store guided state (duration, format, price, experience, link, file content) alongside the prompt

#### 2. Update SecretBuilderHub.tsx — Read structured draft
- In `handleGenerate`, store draft as structured JSON (prompt + guided options) in `builder-draft` localStorage key instead of just `builder-initial-idea`
- Pass guided options via router state to `/studio/:id`

#### 3. Update BuilderShell.tsx — Use guided options in auto-trigger
- Read structured draft from `localStorage` key `builder-draft` (fall back to `builder-initial-idea` for backward compat)
- Extract guided options (duration, format, audiencePainPoint) from the draft
- Pass them into the auto-trigger `handleGenerateCourseRef.current(options)` call instead of hardcoded defaults
- Improve error handling in the catch block to show specific messages for 401 (auth), 429 (rate limit), 504 (timeout), and parse failures

#### 4. Deploy edge function
- Redeploy `generate-course` to ensure latest fixes are live (the JSON parse fix, rate limit fix, and fitness gate removal)

### Technical details

**Structured draft format** (stored in `localStorage` as JSON):
```json
{
  "prompt": "Help busy moms lose 10 lbs",
  "guided": {
    "duration": "8 weeks",
    "format": "Video",
    "price": "$97-$147",
    "taughtBefore": "Yes",
    "existingLink": "https://...",
    "attachmentText": "extracted PDF content..."
  }
}
```

**Auto-trigger options mapping** in BuilderShell:
- `draft.guided.duration` → parse to `duration_weeks` number
- `draft.guided.format` → `lessonFormat`
- `draft.guided.attachmentText` → passed as `attachmentContent`

**Error toast improvements**:
- 401 → "Session expired. Please sign in again."
- 429 → Show the rate limit message from the server
- 504 → "Generation timed out. Please try again."
- Default → Show the server error message

**Files modified**: `src/components/HeroSection.tsx`, `src/pages/SecretBuilderHub.tsx`, `src/components/secret-builder/BuilderShell.tsx`

