-- ReadQuest Notifications & COPPA Consent Schema
-- ============================================================

-- ========================
-- Enum types
-- ========================
CREATE TYPE notification_type AS ENUM (
  'streak_reminder', 'challenge_deadline', 'achievement_earned', 'friend_request',
  'class_announcement', 'reading_goal_progress', 'new_badge', 'level_up', 'weekly_summary'
);

CREATE TYPE consent_type AS ENUM (
  'coppa_parental', 'terms_of_service', 'privacy_policy', 'data_collection', 'social_features'
);

CREATE TYPE consent_method AS ENUM (
  'email_verification', 'signed_form', 'in_app', 'school_authorization'
);

-- ========================
-- Notifications
-- ========================
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       varchar(255) NOT NULL,
  body        text NOT NULL,
  metadata    jsonb,
  is_read     boolean NOT NULL DEFAULT false,
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user    ON notifications(user_id);
CREATE INDEX idx_notifications_unread  ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ========================
-- COPPA Consent records
-- ========================
CREATE TABLE consent_records (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id       uuid REFERENCES profiles(id),
  consent_type    consent_type NOT NULL,
  consent_method  consent_method NOT NULL,
  is_granted      boolean NOT NULL DEFAULT false,
  granted_at      timestamptz,
  revoked_at      timestamptz,
  ip_address      inet,
  user_agent      text,
  metadata        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_consent_records_user   ON consent_records(user_id);
CREATE INDEX idx_consent_records_parent ON consent_records(parent_id);
CREATE INDEX idx_consent_records_type   ON consent_records(consent_type);

-- Triggers
CREATE TRIGGER set_consent_records_updated_at
  BEFORE UPDATE ON consent_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
