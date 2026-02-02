# ReadQuest — Supabase Backend

## Overview

This directory contains the complete Supabase backend scaffolding for ReadQuest:

- **`migrations/`** — SQL migration files for the database schema
- **`functions/`** — Supabase Edge Functions for server-side logic
- **`config.toml`** — Supabase CLI configuration

## Schema Architecture

```
districts
  └── schools
       └── profiles (extends auth.users)
       └── classes
            └── class_members

books (catalog)
  └── shelf_items → bookshelves (per user)
  └── reading_logs (per user)
  └── reviews (per user)

Gamification:
  xp_events → user_levels
  badges → user_badges
  streaks
  daily_quests
  challenges → challenge_progress

Social:
  feed_items → reactions
  friendships
  notifications

Compliance:
  consent_records (COPPA)
```

## Migrations

Files are numbered sequentially and run in order:

| # | File | Description |
|---|------|-------------|
| 1 | `create_enums` | Custom PostgreSQL enum types |
| 2 | `create_core_tables` | Districts, schools, profiles, classes |
| 3 | `create_books_tables` | Books, bookshelves, shelf items, reading logs, reviews |
| 4 | `create_gamification_tables` | XP, levels, badges, streaks, quests, challenges |
| 5 | `create_social_tables` | Feed, reactions, friendships, notifications |
| 6 | `create_consent_tables` | COPPA consent records |
| 7 | `create_functions` | Helper functions, triggers, auto-setup on signup |
| 8 | `create_rls_policies` | Row Level Security for all tables |
| 9 | `seed_badges` | Initial badge catalog (30+ badges) |

## RLS Policy Summary

| Role | Own Data | Class Data | School Data | District Data |
|------|----------|------------|-------------|---------------|
| Student | R/W | Read (class feed) | — | — |
| Teacher | R/W | R/W (their classes) | — | — |
| Parent | R/W | — (read child's) | — | — |
| Admin | R/W | Read | Read | — |
| District Admin | R/W | Read | Read | Read |

## Edge Functions

### `books-search`
Proxy to Open Library API with in-memory caching + DB upsert.

```
GET /books-search?q=harry+potter&page=1&limit=20
GET /books-search?isbn=9780439708180
GET /books-search?title=hobbit&author=tolkien
```

### `award-xp`
XP calculation, level-ups, streak tracking, and badge checking.

```
POST /award-xp
{
  "user_id": "uuid",
  "action": "reading_session",
  "source_id": "reading-log-uuid",
  "source_type": "reading_log",
  "metadata": { "duration_minutes": 30, "pages_read": 20 }
}
```

## Setup

1. Install Supabase CLI: `npm i -g supabase`
2. Link to project: `supabase link --project-ref <ref>`
3. Push migrations: `supabase db push`
4. Deploy functions: `supabase functions deploy`
5. Copy `.env.example` to `.env.local` and add your keys
