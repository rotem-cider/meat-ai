# Meat & AI Meetup App — Full Development Chat Log

*Date: 2026-02-18*

## Initial Request

**User:**

> i want a simple app for creating a meat and ai meetup. people can register to participate and/or host the next meetup. someone can propose date for next meetup and then people can vote if can come/host. collect email, name and how much meat they bring (lbs and type), they can also put in other stuff like beers, drinks, snacks. for the meetup show a nice meter of how much meat is coming and list of other stuff people are bringing. sif we are above needs or below by calculating the recommended amount per person coming.
>
> if two or more people can host, add a random selector which can be run

**Assistant:**

Built the full app from scratch using the existing Next.js + Tailwind CSS v4 scaffolding:

### Architecture
- **Next.js 16** with App Router + Tailwind CSS v4
- **SQLite** (via `better-sqlite3`) for zero-config data persistence
- All API routes under `/api/meetups`

### Features Built

**Meetup Proposals**
- Landing page with a "Propose Next Meetup" button
- Form for title, date/time, location, and description
- List of all proposed meetups to click into

**Registration**
- Name and email (required)
- "I can host" checkbox (highlighted in amber)
- Meat: pounds + type (e.g., 2.5 lbs Ribeye)
- Other items: free text for beers, drinks, snacks, sides
- If the same email registers again, it updates the existing entry

**Meat Meter**
- Visual progress bar showing total meat vs. recommended (0.5 lbs/person)
- Color-coded: red (low), yellow (getting there), green (good), blue (feast mode)
- Shows exact surplus/deficit in lbs
- Separate "Meat Breakdown" card grouping contributions by type

**Other Goodies**
- Card listing who's bringing what (beers, chips, coleslaw, etc.)

**Attendee List**
- Shows each person with their contributions inline
- "Can Host" badge on volunteers
- Hover to reveal remove button

**Random Host Selector**
- If 0 hosts: shows "no volunteers yet"
- If 1 host: names them directly
- If 2+ hosts: animated slot-machine-style spinner that cycles through names with decelerating speed, then picks one randomly via the API and displays the winner with a celebration message

### Files Created/Modified

- `lib/db.ts` — SQLite database schema and helpers
- `app/api/meetups/route.ts` — GET (list) and POST (create) meetups
- `app/api/meetups/[id]/route.ts` — GET single meetup with stats, DELETE
- `app/api/meetups/[id]/register/route.ts` — POST register/update participant
- `app/api/meetups/[id]/register/[participantId]/route.ts` — DELETE participant
- `app/api/meetups/[id]/random-host/route.ts` — GET random host selection
- `app/components/CreateMeetup.tsx` — Meetup creation form
- `app/components/HostSelector.tsx` — Animated random host picker
- `app/components/MeatMeter.tsx` — Visual meat gauge
- `app/components/MeetupDashboard.tsx` — Full meetup view tying everything together
- `app/components/OtherItems.tsx` — List of non-meat contributions
- `app/components/ParticipantList.tsx` — Attendee list with details
- `app/components/RegisterForm.tsx` — Registration form
- `app/page.tsx` — Home page
- `app/layout.tsx` — Root layout with metadata
- `app/globals.css` — Tailwind + theme
- `next.config.ts` — Config for native module support
- `.gitignore` — Added SQLite file patterns

---

## Push to Main

**User:**

> push to main

**Assistant:**

Merged the feature branch into main via fast-forward and pushed.

---

## Fix: Create Meetup Not Working

**User:**

> create meetup doesn't do anything.. can you check why? i just go back to main screen
>
> also default meetup creating to 8pm

**Assistant:**

Found two issues:

1. **Create flow bug**: After creating a meetup, `onCreated` hides the form and fetches the list, but only auto-navigates if there's exactly 1 meetup total. Otherwise it just dumps you back to the list without selecting the new one.
2. **Date default**: No default time set.

### Fixes Applied

**`app/components/CreateMeetup.tsx`:**
- Changed `onCreated` prop to accept `(meetupId: number)` so the parent gets the new ID
- Date picker now defaults to one week from today at 20:00 (8 PM)
- After successful POST, reads the created meetup's ID from the response and passes it up

**`app/page.tsx`:**
- `onCreated` callback now calls `setSelectedMeetupId(newId)` to navigate directly to the new meetup dashboard

---

## Fix: SQLite Can't Open Database

**User:**

> SqliteError: unable to open database file ... code: 'SQLITE_CANTOPEN'

**Assistant:**

The issue was `process.cwd()` not being writable in the deployment environment.

### Fix Applied

**`lib/db.ts`:**
- Added `getDbPath()` function that tries three locations in order:
  1. `DB_PATH` env var (if set)
  2. `./data/meetup.db` in the project root
  3. `/tmp/meetup.db` as a guaranteed-writable fallback
- Creates directories with `fs.mkdirSync` and checks write permissions before using

**`.gitignore`:**
- Added `/data/` directory

---

## Fix: Navigation & Share Links

**User:**

> i can't go to all meetups if there is an active meetup.. help me go and create another one if needed. also i want a share link to share the specific meetup. make the icon work for sharing in social

**Assistant:**

### Navigation Fix
- Removed the auto-redirect that trapped users on a meetup when only one existed
- Home page at `/` always shows the full list of meetups plus the "Propose Next Meetup" button
- Meetup list items now use proper `<a>` tags with `router.push` for navigation

### Shareable URLs
- Created `/app/meetup/[id]/page.tsx` — each meetup now lives at `/meetup/[id]`
- Server-rendered page, so the link works when shared directly
- `generateMetadata` generates per-meetup OpenGraph and Twitter Card meta tags

### Social Share Buttons
Created `app/components/ShareButton.tsx`:
- **Copy Link** — copies the `/meetup/[id]` URL to clipboard
- **X / Twitter** — opens tweet composer with meetup title, date, and link
- **WhatsApp** — opens WhatsApp share with details
- **Telegram** — opens Telegram share
- Dropdown menu with click-outside-to-close behavior
- Each platform has its proper SVG icon

### Files Created/Modified
- `app/meetup/[id]/page.tsx` — New shareable meetup page
- `app/components/ShareButton.tsx` — New share dropdown component
- `app/components/MeetupDashboard.tsx` — Removed `onBack` prop, uses `<Link href="/">` instead, added ShareButton
- `app/page.tsx` — Removed auto-redirect, uses `useRouter` for navigation

---

## Fix: Vercel Database Persistence & Edit Registration

**User:**

> when going to https://meat-ai.vercel.app/meetup/1 i see meetup not found.
>
> also i want to be able to change what im bringing

**Assistant:**

### Database: SQLite → libsql

The root cause: `better-sqlite3` writes to local filesystem, which is ephemeral on Vercel serverless. Replaced with `@libsql/client` which supports both local SQLite files and hosted Turso databases.

**`lib/db.ts` rewrite:**
- Uses `createClient()` from `@libsql/client`
- Connects to `TURSO_DATABASE_URL` env var (Turso hosted) or falls back to `file:./data/meetup.db` (local dev)
- All DB calls are now async
- Schema init uses `executeMultiple()`

**All API routes rewritten** to use async `db.execute()` with parameterized queries:
- `app/api/meetups/route.ts`
- `app/api/meetups/[id]/route.ts`
- `app/api/meetups/[id]/register/route.ts`
- `app/api/meetups/[id]/register/[participantId]/route.ts`
- `app/api/meetups/[id]/random-host/route.ts`

**`app/meetup/[id]/page.tsx`** — `generateMetadata` now uses async DB calls with try/catch fallback

**`next.config.ts`** — Removed `serverExternalPackages: ["better-sqlite3"]`

### Edit Registration

**`app/components/RegisterForm.tsx`:**
- Added `editing` and `onCancelEdit` props
- When editing, form pre-fills with existing data via `useEffect`
- Email field is disabled during edit (it's the upsert key)
- Header changes to "Update Registration" with a Cancel button
- Submit button text changes to "Update My Info"
- `resetForm()` helper clears all fields

**`app/components/ParticipantList.tsx`:**
- Added `onEdit` prop
- Each participant row now shows pencil (edit) and X (delete) icons

**`app/components/MeetupDashboard.tsx`:**
- Added `editing` state and `formRef` for scroll-to-form
- `handleEdit` sets editing participant and scrolls to form
- `handleRegistered` clears editing state
- Wired up `onEdit` on ParticipantList and `editing`/`onCancelEdit` on RegisterForm

---

## Fix: Edit/Delete Buttons Not Visible on Mobile

**User:**

> i can't see the edit and delete buttons
>
> i'm on mobile

**Assistant:**

The buttons were hidden behind `opacity-0 group-hover:opacity-100`, which only works on desktop hover — completely invisible on touch devices.

**Fix in `app/components/ParticipantList.tsx`:**
- Changed `className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"` to `className="flex items-center gap-1"` — buttons are now always visible.

---

## Custom Favicon & OG Image for Social Sharing

**User:**

> can you make the icon a meat and ai. for sharing currently is the vercel icon

**Assistant:**

### Custom SVG Favicon (`public/icon.svg`)
- Orange-to-red gradient background with rounded corners
- White steak/ellipse shape with amber marbling lines
- AI circuit nodes and connecting lines underneath
- Replaces all old Next.js/Vercel default SVGs

### Dynamic OG Image Route (`app/api/og/route.tsx`)
- Edge runtime for fast generation
- Uses Next.js `ImageResponse` to generate 1200×630 images
- Accepts `title`, `date`, and `attendees` query params
- Shows 🥩🤖 emojis, meetup title, date, attendee count
- "RSVP · Bring Meat · Talk AI" tagline
- Rich orange/red gradient background

### Metadata Updates

**`app/layout.tsx`:**
- Added `metadataBase` pointing to `https://meat-ai.vercel.app`
- Added `icons` config pointing to `/icon.svg`
- Added default OG and Twitter card images pointing to `/api/og`

**`app/meetup/[id]/page.tsx`:**
- `generateMetadata` now generates per-meetup OG image URLs with title and date params

### Cleanup
- Deleted `public/file.svg`, `public/next.svg`, `public/window.svg`, `public/vercel.svg`, `public/globe.svg`

---

## Summary of All Commits

1. `feat: Meat & AI meetup organizer app` — Initial full app build
2. `fix: navigate to meetup after creation, default date to 8pm`
3. `fix: use writable path for SQLite database`
4. `feat: shareable meetup URLs, social share buttons, fix navigation`
5. `feat: switch to libsql for Vercel persistence, add edit registration`
6. `fix: make edit/delete buttons always visible for mobile`
7. `feat: custom Meat & AI favicon and OG image for social sharing`

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Database:** @libsql/client (local SQLite / Turso hosted)
- **Runtime:** Node.js + Edge (for OG image generation)
- **Deployment:** Vercel

## Environment Variables (for Vercel)

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | Turso database URL (e.g. `libsql://your-db.turso.io`) |
| `TURSO_AUTH_TOKEN` | Turso authentication token |
| `NEXT_PUBLIC_BASE_URL` | Base URL for OG images (defaults to `https://meat-ai.vercel.app`) |
