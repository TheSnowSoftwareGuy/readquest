-- ReadQuest Social Schema
-- Activity Feed, Reactions, Friendships
-- ============================================================

-- ========================
-- Enum types
-- ========================
CREATE TYPE feed_item_type AS ENUM (
  'book_completed', 'review_posted', 'badge_earned', 'level_up',
  'streak_milestone', 'challenge_completed', 'book_added'
);

CREATE TYPE reaction_type AS ENUM ('like', 'love', 'wow', 'clap', 'book_emoji');

CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');

-- ========================
-- Feed items
-- ========================
CREATE TABLE feed_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type       feed_item_type NOT NULL,
  reference_id    uuid,
  reference_type  varchar(50),
  content         text NOT NULL,
  metadata        jsonb,
  class_id        uuid REFERENCES classes(id),
  school_id       uuid REFERENCES schools(id),
  is_visible      boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feed_items_user    ON feed_items(user_id);
CREATE INDEX idx_feed_items_class   ON feed_items(class_id);
CREATE INDEX idx_feed_items_school  ON feed_items(school_id);
CREATE INDEX idx_feed_items_created ON feed_items(created_at DESC);

-- ========================
-- Reactions on feed items
-- ========================
CREATE TABLE reactions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_item_id  uuid NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, feed_item_id)     -- one reaction per user per item
);

CREATE INDEX idx_reactions_feed_item ON reactions(feed_item_id);

-- ========================
-- Friendships (within same school only)
-- ========================
CREATE TABLE friendships (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status        friendship_status NOT NULL DEFAULT 'pending',
  school_id     uuid NOT NULL REFERENCES schools(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id <> addressee_id)
);

CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);

-- Triggers
CREATE TRIGGER set_friendships_updated_at
  BEFORE UPDATE ON friendships FOR EACH ROW EXECUTE FUNCTION set_updated_at();
