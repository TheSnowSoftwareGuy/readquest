-- ReadQuest Gamification Schema
-- XP, Badges, Streaks, Quests, Challenges
-- ============================================================

-- ========================
-- Enum types
-- ========================
CREATE TYPE xp_event_type AS ENUM (
  'reading_session', 'book_completed', 'review_written', 'badge_earned',
  'daily_quest', 'weekly_challenge', 'streak_bonus', 'first_login', 'social_interaction'
);

CREATE TYPE badge_rarity   AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE badge_category AS ENUM ('reading', 'social', 'streak', 'genre', 'review', 'special');

CREATE TYPE quest_type AS ENUM (
  'read_minutes', 'read_pages', 'write_review', 'add_book', 'social_action'
);

-- ========================
-- XP event log
-- ========================
CREATE TABLE xp_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type  xp_event_type NOT NULL,
  xp_amount   integer NOT NULL,
  source_id   uuid,
  source_type varchar(50),
  description text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_events_user    ON xp_events(user_id);
CREATE INDEX idx_xp_events_type    ON xp_events(event_type);
CREATE INDEX idx_xp_events_created ON xp_events(created_at);

-- ========================
-- Badges (global catalog)
-- ========================
CREATE TABLE badges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar(100) NOT NULL UNIQUE,
  description text NOT NULL,
  icon_url    text NOT NULL,
  rarity      badge_rarity NOT NULL,
  category    badge_category NOT NULL,
  requirement text NOT NULL,          -- JSON criteria for auto-award
  xp_reward   integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ========================
-- User-earned badges
-- ========================
CREATE TABLE user_badges (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id  uuid NOT NULL REFERENCES badges(id),
  earned_at timestamptz NOT NULL DEFAULT now(),
  is_new    boolean NOT NULL DEFAULT true,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user  ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- ========================
-- Streaks (one row per user)
-- ========================
CREATE TABLE streaks (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak          integer NOT NULL DEFAULT 0,
  longest_streak          integer NOT NULL DEFAULT 0,
  last_read_date          date,
  streak_freeze_available integer NOT NULL DEFAULT 0,
  streak_freeze_used_at   timestamptz,
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ========================
-- Daily quests (3 per user per day)
-- ========================
CREATE TABLE daily_quests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_type    quest_type NOT NULL,
  description   text NOT NULL,
  target_value  integer NOT NULL,
  current_value integer NOT NULL DEFAULT 0,
  xp_reward     integer NOT NULL,
  coin_reward   integer NOT NULL DEFAULT 0,
  is_completed  boolean NOT NULL DEFAULT false,
  quest_date    date NOT NULL,
  completed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_quests_user ON daily_quests(user_id);
CREATE INDEX idx_daily_quests_date ON daily_quests(quest_date);

-- ========================
-- Challenges (teacher-created or system)
-- ========================
CREATE TABLE challenges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           varchar(255) NOT NULL,
  description     text NOT NULL,
  created_by      uuid NOT NULL REFERENCES profiles(id),
  class_id        uuid REFERENCES classes(id),
  school_id       uuid REFERENCES schools(id),
  challenge_type  varchar(50) NOT NULL,
  target_value    integer NOT NULL,
  xp_reward       integer NOT NULL,
  badge_id        uuid REFERENCES badges(id),
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_challenges_class  ON challenges(class_id);
CREATE INDEX idx_challenges_school ON challenges(school_id);
CREATE INDEX idx_challenges_active ON challenges(is_active);

-- ========================
-- Challenge progress per user
-- ========================
CREATE TABLE challenge_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_value integer NOT NULL DEFAULT 0,
  is_completed  boolean NOT NULL DEFAULT false,
  completed_at  timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_challenge_progress_challenge ON challenge_progress(challenge_id);
CREATE INDEX idx_challenge_progress_user      ON challenge_progress(user_id);

-- ========================
-- Sync XP total to profiles on insert
-- ========================
CREATE OR REPLACE FUNCTION public.sync_xp_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  new_total integer;
  new_level integer;
BEGIN
  SELECT COALESCE(SUM(xp_amount), 0) INTO new_total
  FROM public.xp_events WHERE user_id = NEW.user_id;

  -- Level curve: level = floor(sqrt(total_xp / 100)) + 1, capped at 100
  new_level := LEAST(FLOOR(SQRT(new_total::float / 100)) + 1, 100)::integer;

  UPDATE public.profiles
  SET xp = new_total, level = new_level, updated_at = now()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER after_xp_event_insert
  AFTER INSERT ON xp_events
  FOR EACH ROW EXECUTE FUNCTION public.sync_xp_to_profile();

-- Triggers
CREATE TRIGGER set_challenges_updated_at
  BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_challenge_progress_updated_at
  BEFORE UPDATE ON challenge_progress FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_streaks_updated_at
  BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
