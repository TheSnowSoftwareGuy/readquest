# ReadQuest Build Progress

**Company:** PSH Industries
**Product:** ReadQuest — AI-powered kids reading platform
**PRD:** phoenix-intel/biblionasium-killer-prd.md
**Live:** https://thesnowsoftwareguy.github.io/readquest/

---

## Phase 1: MVP (Front-End Demo → Functional Prototype)

### ✅ Completed
- [x] Landing page with hero, features, stats, testimonials, CTA
- [x] Interactive student dashboard demo (XP, streaks, badges, bookshelf, social feed, leaderboard, reading stats)
- [x] Teacher dashboard demo (class health, alerts, student table, reports)
- [x] Pricing page with tier cards and FAQ
- [x] Publishers page (placement types, media network, deal examples, analytics preview)
- [x] Discover by Show page (show-to-book pipeline)
- [x] Book detail pages
- [x] Navbar + Footer with PSH Industries branding
- [x] Real book covers via Open Library API
- [x] GitHub Pages deployment (CI/CD via GitHub Actions)
- [x] Responsive design (mobile + desktop)
- [x] **Supabase database schema** (8 SQL migrations)
  - [x] Core schema: profiles, schools, districts, classes, class_memberships
  - [x] Books & bookshelves: books, bookshelves, shelf_items
  - [x] Reading & reviews: reading_logs, reviews (with rating recalc trigger)
  - [x] Gamification: xp_events, badges, user_badges, streaks, daily_quests, challenges, challenge_progress
  - [x] Social: feed_items, reactions, friendships
  - [x] Notifications & consent: notifications, consent_records
  - [x] Row Level Security policies (22 tables, 50+ policies)
  - [x] Seed data: 27 badges across 6 categories
  - [x] Auto-triggers: profile creation, default shelves, XP sync, rating recalc, updated_at
- [x] **Supabase Edge Functions** (books-search, book-by-isbn, book-detail, create-student)
- [x] **Frontend Supabase client** (src/lib/supabase.js, auth.js, books.js)
- [x] **Tests** (53 passing — schema validation, auth library, books library)

### 🔨 In Progress
- [ ] **Supabase project creation** (Patrick to create project, get URL + anon key)
- [ ] **Wire frontend to live Supabase** (replace demo data with real queries)

### 📋 TODO — Core Backend
- [ ] **Authentication system (Supabase Auth)**
  - [x] Teacher registration + login (UI wired to Supabase Auth)
  - [x] Parent registration + login (UI wired to Supabase Auth)
  - [x] Google SSO via Supabase Auth (Login + Signup pages)
  - [x] OAuth callback handler (AuthCallback page)
  - [x] AuthGuard component (session check, role-based redirect, context provider)
  - [x] Teacher onboarding flow (school setup, class creation, student import, login code generation)
  - [ ] Student account creation (teacher creates via Edge Function — scaffolded)
  - [ ] Parent child linking
  - [ ] QR code login for K-2 students (placeholder UI in onboarding)
  - [ ] COPPA parental consent flow
  - [ ] Password reset flow (Supabase built-in — scaffolded)
  - [ ] Session timeout (30min inactivity)

- [ ] **Book database + search**
  - [x] Open Library API integration (Edge Functions + client lib)
  - [x] Book search (title, author, ISBN)
  - [x] Book detail pages (metadata, cover, description)
  - [ ] ISBN barcode scanner integration
  - [ ] Lexile / reading level mapping
  - [x] Book catalog caching layer (auto-caches in Supabase DB)

- [ ] **Virtual bookshelf (functional)**
  - [x] Add/remove books from shelf (schema ready)
  - [x] Shelf categories: Currently Reading, Want to Read, Finished (auto-created on signup)
  - [x] Reading progress tracking (page/percentage — schema ready)
  - [x] Move books between shelves (dropdown UI)
  - [x] Book search modal (Open Library API with debounce, fallback to mock)
  - [x] Stats bar (books finished, pages read, current streak)
  - [x] MyBookshelf.jsx page with Supabase integration + demo fallback
  - [ ] Custom shelf creation
  - [ ] Shelf statistics (books by genre, avg rating, pace)

- [ ] **Reading logs**
  - [x] Log reading session (book + minutes + pages — schema ready)
  - [x] Timer-based logging (start/pause/stop with animated UI)
  - [x] Manual entry for physical books (quick-log form)
  - [x] Calendar view (GitHub-style contribution heatmap — CalendarHeatmap.jsx)
  - [x] Daily/weekly/monthly summaries (ReadingLog.jsx)
  - [x] Reading streak tracking (current + longest streak display)
  - [x] ReadingLog.jsx page with Supabase integration + demo fallback
  - [x] ReadingTimer.jsx component (select book, start/pause/stop, save session)
  - [ ] Suspicious entry detection (is_suspicious flag in schema)

- [ ] **Reviews & ratings**
  - [x] Star rating (1-5 — schema ready, CHECK constraint)
  - [x] Written reviews with age-appropriate limits
  - [x] Emoji reactions for K-2 (emoji_rating field ready)
  - [x] Spoiler tags (has_spoilers flag ready)
  - [x] Review visibility controls (class/school — enum ready)
  - [x] ReviewForm.jsx component (star/emoji rating, character counter, spoiler toggle, visibility selector, Supabase + demo)
  - [x] ReviewsList.jsx component (star display, spoiler blur/reveal, helpful votes, sort by newest/helpful, Supabase + demo)
  - [x] Integrated into BookDetail.jsx (toggle review form, reviews list below book info)

- [ ] **Gamification engine**
  - [x] XP system (xp_events table + auto-sync trigger ready)
  - [x] Level system (level curve in sync_xp_to_profile function)
  - [x] Streak tracking with streak freeze (streaks table ready)
  - [x] Badge system (27 badges seeded, user_badges table ready)
  - [x] Daily quests (daily_quests table ready)
  - [x] Weekly challenges (challenges + challenge_progress ready)
  - [x] BookCoins virtual currency (book_coins field in profiles)
  - [x] Achievements.jsx page (full gamification dashboard — XP bar, streaks, badge grid, daily quests, weekly challenge, BookCoins, XP activity feed)
  - [x] XPProgressBar.jsx component (animated fill, level title, XP remaining, purple gradient)
  - [x] BadgeCard.jsx + BadgeModal components (rarity colors, earned glow vs locked, click for detail modal)
  - [x] /achievements route + Navbar integration (app nav + student nav, desktop + mobile)
  - [ ] Avatar customization (unlockable items)
  - [ ] Leaderboards (class, school)
  - [ ] Achievement milestones
  - [ ] Anti-gaming measures

- [ ] **Social feed**
  - [x] Activity feed (SocialFeed.jsx — 20 demo items, Supabase query, book_complete/review/badge/level_up/challenge types)
  - [x] Like/react to feed items (FeedItem.jsx — 📚⭐🎉👏🔥 toggle reactions with counts, Supabase insert/delete)
  - [x] Friend system within school boundary (FriendsList.jsx — friends list, online indicator, pending requests, add friend search, Supabase + demo)
  - [x] Class feed (class_id filter on feed — "My Class" tab)
  - [x] Friend activity filter ("Friends" tab on social feed)
  - [x] Load more / pagination (8 items per page with "Load More" button)
  - [x] Trending books sidebar + class stats sidebar
  - [x] /feed route + Navbar integration (app nav + student nav, desktop + mobile)
  - [ ] Content moderation (AI + queue)
  - [ ] Block/report user

- [ ] **Teacher dashboard (functional)**
  - [x] Class overview with reading status indicators (TeacherClassView.jsx — green/yellow/red based on minutes/week)
  - [x] Individual student detail view (expandable rows — current books, recent logs, badges, XP)
  - [x] Class selector dropdown (multiple classes support)
  - [x] Class stats cards (total students, avg min/week, class streak, books this month)
  - [x] Reading trends mini-chart (bar chart, last 4 weeks)
  - [x] Sortable student table (name, books, minutes, streak, level, status columns)
  - [x] Challenge creation/management (CreateChallengeModal.jsx — type selector, target, date range, assign to class/students, badge reward, preview)
  - [x] Export report (generates printable text summary with all student data)
  - [x] Demo data: 15 students with realistic reading patterns
  - [x] Supabase integration + demo fallback
  - [x] /teacher/class route + Teacher navbar integration
  - [ ] Reading goal management
  - [ ] Book list curation
  - [ ] Google Classroom roster sync
  - [ ] Bulk actions

- [ ] **Parent dashboard**
  - [x] Child reading overview (ParentDashboard.jsx — per-child overview cards, current book, streak, XP, books/month)
  - [x] Multi-child view (child selector tabs, 2 demo children ages 7 and 11)
  - [x] Weekly reading summary (bar chart for last 4 weeks — minutes, pages, sessions)
  - [x] Permission management (toggle social features, review visibility, push notifications)
  - [x] Reading goal visibility (teacher-set + parent-set goals with progress bars)
  - [x] Set Reading Goal modal (minutes per day slider, AAP recommendation tip)
  - [x] ChildOverviewCard component (avatar, name, grade, school, streak, level, XP bar, books/month)
  - [x] Recent activity feed (last 10 items per child)
  - [x] Achievement highlights (most recent 5 badges with rarity colors)
  - [x] Current bookshelf preview (3 most recent books)
  - [x] Supabase integration + demo fallback
  - [x] /parent route + Parent navbar with role badge
  - [ ] Weekly reading summary notifications (email/push — needs backend)

- [ ] **Push notifications**
  - [ ] Streak reminders (notification types enum ready)
  - [ ] Challenge deadlines
  - [ ] Achievement earned
  - [ ] Quiet hours for under-13

### 📋 TODO — Infrastructure
- [ ] **Supabase project** (DB + Auth + Storage + Edge Functions)
- [ ] **File storage** (Supabase Storage for book covers, avatars)
- [ ] **Email service** (Resend / SendGrid — parent consent, reports)
- [ ] **Error monitoring** (Sentry)
- [ ] **Analytics** (PostHog / Plausible — COPPA-safe)

### 📋 TODO — Compliance & Legal
- [x] Privacy Policy draft (PrivacyPolicy.jsx — 10 sections, COPPA-specific, parental rights, data retention, PSH Industries branding)
- [x] Terms of Service draft (TermsOfService.jsx — 12 sections, service description, accounts, acceptable use, IP, liability, termination)
- [x] COPPA compliance documentation (COPPACompliance.jsx — 9 sections, consent process, data minimization table, third-party services, FTC complaint info)
- [x] Footer links updated (Privacy Policy, Terms, COPPA → actual route pages)
- [x] Routes added: /privacy, /terms, /coppa
- [ ] FERPA compliance documentation
- [ ] Data retention policy
- [ ] Cookie policy

---

## Phase 2: Growth (Months 6-12)

- [ ] In-app reading (EPUB reader)
- [ ] Audiobook player
- [ ] AI book recommendations engine
- [ ] AI discussion prompts
- [ ] Reading level assessment
- [ ] Family accounts
- [ ] Classroom book clubs
- [ ] District dashboard
- [ ] LMS integrations (Google Classroom, Clever, ClassLink)
- [ ] Content moderation AI
- [ ] Content licensing (publishers)

---

## Phase 3: Scale (Months 12-18)

- [ ] Direct school sales portal
- [ ] Public API
- [ ] User-generated content platform
- [ ] Author events
- [ ] Impact reporting
- [ ] White-label solution
- [ ] International / multilingual (Spanish first)
- [ ] AR experiences

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | Supabase Auth | Built-in email/pw, Google SSO, magic link, session mgmt — no custom JWT |
| Database | Supabase PostgreSQL | Managed Postgres with RLS, real-time subscriptions, auto-generated API |
| Data isolation | Row Level Security | 50+ RLS policies enforce student/teacher/parent/admin boundaries |
| Server logic | Supabase Edge Functions (Deno) | Serverless, co-located with DB, service-role access for admin ops |
| Frontend DB | @supabase/supabase-js | Direct client-to-DB with RLS — no API middleware for most CRUD |
| Book data | Open Library API | Free, no API key, comprehensive catalog — cached in our books table |
| Schema | SQL migrations (supabase/migrations/) | Version-controlled, sequential, auditable |

## Build Log

| Date | Feature | Status | Notes |
|------|---------|--------|-------|
| 2026-02-02 | Front-end demo site | ✅ Done | Landing, student demo, teacher demo, pricing, publishers |
| 2026-02-02 | PSH Industries rebrand | ✅ Done | Removed Phoenix Intel, updated emails |
| 2026-02-02 | Revenue data cleanup | ✅ Done | Removed internal revenue from public site |
| 2026-02-02 | Backend scaffolding (Express) | ❌ Scrapped | Replaced by Supabase architecture |
| 2026-02-02 | Supabase schema + RLS + Edge Functions | ✅ Done | 8 migrations, 4 edge functions, 53 tests passing |
| 2026-02-02 | Frontend Supabase client lib | ✅ Done | auth.js, books.js, supabase.js |
| 2026-02-02 | Auth UI pages | ✅ Done | Login, Signup, AuthCallback, AuthGuard, TeacherOnboarding |
| 2026-02-02 | Supabase graceful fallback | ✅ Done | supabase.ts warns instead of crashing when credentials missing |
| 2026-02-02 | Navbar auth links | ✅ Done | Sign In + Get Started Free buttons in landing navbar |
| 2026-02-02 | Bookshelf page (MyBookshelf.jsx) | ✅ Done | 3 shelves, add/remove/move books, progress tracking, search modal, stats bar, Supabase + demo fallback |
| 2026-02-02 | Reading Log page (ReadingLog.jsx) | ✅ Done | Timer, manual entry, calendar heatmap, weekly/monthly summaries, streak display, recent sessions |
| 2026-02-02 | BookSearchModal component | ✅ Done | Debounced Open Library search, shelf selector, graceful fallback to mock data |
| 2026-02-02 | ReadingTimer component | ✅ Done | Start/pause/stop, animated pulse, book selector, auto-save session on stop |
| 2026-02-02 | CalendarHeatmap component | ✅ Done | 12-week grid, color intensity, hover tooltips, responsive, legend |
| 2026-02-02 | Routes + Navbar update | ✅ Done | /bookshelf, /reading-log routes; navbar links for app pages + student nav |
| 2026-02-02 | ReviewForm component | ✅ Done | Star rating (hover preview), emoji rating (6 emojis), textarea with char counter, spoiler toggle, visibility selector, Supabase + demo |
| 2026-02-02 | ReviewsList component | ✅ Done | Star display, reviewer info, spoiler blur/reveal, helpful votes, sort newest/helpful, Supabase + demo |
| 2026-02-02 | BookDetail reviews integration | ✅ Done | Toggle review form, reviews list below book info |
| 2026-02-02 | Achievements page | ✅ Done | Full gamification dashboard — XP bar, streaks w/ fire animation, badge grid (27 badges, rarity colors), daily quests, weekly challenge, BookCoins, XP feed |
| 2026-02-02 | XPProgressBar component | ✅ Done | Animated fill, level number + title, XP remaining, purple gradient |
| 2026-02-02 | BadgeCard + BadgeModal components | ✅ Done | Rarity border colors (common/rare/epic/legendary), earned glow vs locked, click for detail modal |
| 2026-02-02 | Routes + Navbar update | ✅ Done | /achievements route; navbar links in app nav + student nav (desktop + mobile) |
| 2026-02-02 | Social Feed page (SocialFeed.jsx) | ✅ Done | 20 demo feed items, 6 types, filter tabs (all/class/friends), load more, trending sidebar, class stats, Supabase + demo |
| 2026-02-02 | FeedItem component | ✅ Done | Type-specific layouts (book_complete, review, badge_earned, level_up, challenge_complete, started_reading), emoji reactions (📚⭐🎉👏🔥), relative timestamps |
| 2026-02-02 | FriendsList component | ✅ Done | Friends list w/ online indicators, pending requests (accept/decline), add friend search, compact mode, tabs, Supabase + demo |
| 2026-02-02 | TeacherClassView page | ✅ Done | 15 demo students, class selector, sortable student table, expandable detail rows, reading health chart, 4-week trends bar chart, export report |
| 2026-02-02 | CreateChallengeModal component | ✅ Done | Type selector (books/minutes/streak/bingo), target slider, date range, assign to class/students, badge reward picker, XP reward, preview step |
| 2026-02-02 | Routes + Navbar update | ✅ Done | /feed, /teacher/class routes; Social Feed in app nav + student nav; Class View in teacher nav |
| 2026-02-02 | Parent Dashboard (ParentDashboard.jsx) | ✅ Done | 2 demo children, child selector tabs, overview cards, weekly bar chart, bookshelf preview, activity feed, badges, reading goals, permission toggles, set goal modal, Supabase + demo |
| 2026-02-02 | ChildOverviewCard component | ✅ Done | Avatar, name, grade, school, streak, XP bar, books/month, current book cover, View Details link |
| 2026-02-02 | Privacy Policy page | ✅ Done | 10 sections, COPPA-specific, parental rights, data collection/use/sharing, retention, security, PSH Industries contact |
| 2026-02-02 | Terms of Service page | ✅ Done | 12 sections, service description, accounts, acceptable use, IP, content moderation, liability, termination |
| 2026-02-02 | COPPA Compliance page | ✅ Done | 9 sections, consent process (5 steps), data minimization table, third-party services table, social safety, FTC complaint info |
| 2026-02-02 | Routes + Navbar + Footer update | ✅ Done | /parent, /privacy, /terms, /coppa routes; Parent navbar with role badge; Footer legal links wired to actual pages |
