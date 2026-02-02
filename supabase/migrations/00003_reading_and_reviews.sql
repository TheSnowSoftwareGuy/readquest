-- ReadQuest Reading Logs & Reviews Schema
-- ============================================================

-- ========================
-- Enum types
-- ========================
CREATE TYPE reading_source  AS ENUM ('physical', 'ebook', 'audiobook', 'in_app');
CREATE TYPE log_entry_type  AS ENUM ('manual', 'timer', 'automatic');
CREATE TYPE review_visibility AS ENUM ('class', 'school', 'public', 'private');

-- ========================
-- Reading logs
-- ========================
CREATE TABLE reading_logs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id           uuid NOT NULL REFERENCES books(id),
  duration_minutes  integer NOT NULL,
  pages_read        integer NOT NULL DEFAULT 0,
  start_page        integer,
  end_page          integer,
  source            reading_source NOT NULL DEFAULT 'physical',
  entry_type        log_entry_type NOT NULL DEFAULT 'manual',
  session_date      date NOT NULL DEFAULT CURRENT_DATE,
  started_at        timestamptz,
  ended_at          timestamptz,
  notes             text,
  xp_earned         integer NOT NULL DEFAULT 0,
  is_suspicious     boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reading_logs_user      ON reading_logs(user_id);
CREATE INDEX idx_reading_logs_book      ON reading_logs(book_id);
CREATE INDEX idx_reading_logs_date      ON reading_logs(session_date);
CREATE INDEX idx_reading_logs_user_date ON reading_logs(user_id, session_date);

-- ========================
-- Reviews
-- ========================
CREATE TABLE reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id       uuid NOT NULL REFERENCES books(id),
  rating        integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         varchar(200),
  content       text,
  emoji_rating  varchar(10),      -- emoji-only review for K-2
  has_spoilers  boolean NOT NULL DEFAULT false,
  visibility    review_visibility NOT NULL DEFAULT 'class',
  is_approved   boolean NOT NULL DEFAULT true,
  moderated_at  timestamptz,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)        -- one review per user per book
);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_book ON reviews(book_id);

-- ========================
-- Recalculate book ratings after review insert/update/delete
-- ========================
CREATE OR REPLACE FUNCTION public.recalculate_book_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  target_book_id uuid;
BEGIN
  target_book_id := COALESCE(NEW.book_id, OLD.book_id);
  UPDATE public.books
  SET
    average_rating = (SELECT AVG(rating)::real   FROM public.reviews WHERE book_id = target_book_id),
    ratings_count  = (SELECT COUNT(*)::integer   FROM public.reviews WHERE book_id = target_book_id),
    reviews_count  = (SELECT COUNT(*)::integer   FROM public.reviews WHERE book_id = target_book_id AND content IS NOT NULL),
    updated_at = now()
  WHERE id = target_book_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER after_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_book_rating();

-- Triggers
CREATE TRIGGER set_reading_logs_updated_at
  BEFORE UPDATE ON reading_logs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();
