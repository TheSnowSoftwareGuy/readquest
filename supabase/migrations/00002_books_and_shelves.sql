-- ReadQuest Books & Bookshelves Schema
-- ============================================================

-- ========================
-- Enum types
-- ========================
CREATE TYPE shelf_type AS ENUM ('currently_reading', 'want_to_read', 'finished', 'custom');

-- ========================
-- Books (cached metadata from Open Library + enriched)
-- ========================
CREATE TABLE books (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             varchar(500) NOT NULL,
  authors           jsonb NOT NULL DEFAULT '[]'::jsonb,
  isbn_10           varchar(13),
  isbn_13           varchar(17),
  open_library_key  varchar(100),
  cover_url         text,
  cover_url_small   text,
  cover_url_medium  text,
  description       text,
  publisher         varchar(255),
  publish_date      varchar(50),
  page_count        integer,
  subjects          jsonb NOT NULL DEFAULT '[]'::jsonb,
  genres            jsonb NOT NULL DEFAULT '[]'::jsonb,
  lexile_level      integer,
  reading_level     varchar(20),
  age_range_min     integer,
  age_range_max     integer,
  language          varchar(10) NOT NULL DEFAULT 'en',
  average_rating    real,
  ratings_count     integer NOT NULL DEFAULT 0,
  reviews_count     integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_books_isbn10             ON books(isbn_10);
CREATE INDEX idx_books_isbn13             ON books(isbn_13);
CREATE INDEX idx_books_open_library_key   ON books(open_library_key);
CREATE INDEX idx_books_title              ON books(title);

-- ========================
-- Bookshelves
-- ========================
CREATE TABLE bookshelves (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        varchar(100) NOT NULL,
  shelf_type  shelf_type NOT NULL,
  description text,
  is_default  boolean NOT NULL DEFAULT false,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookshelves_user ON bookshelves(user_id);

-- ========================
-- Shelf items (book ↔ shelf assignments with progress)
-- ========================
CREATE TABLE shelf_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shelf_id        uuid NOT NULL REFERENCES bookshelves(id) ON DELETE CASCADE,
  book_id         uuid NOT NULL REFERENCES books(id),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_page    integer NOT NULL DEFAULT 0,
  total_pages     integer,
  progress_percent real NOT NULL DEFAULT 0,
  started_at      timestamptz,
  finished_at     timestamptz,
  sort_order      integer NOT NULL DEFAULT 0,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)         -- a user can only have a book on one shelf
);

CREATE INDEX idx_shelf_items_shelf ON shelf_items(shelf_id);
CREATE INDEX idx_shelf_items_user  ON shelf_items(user_id);
CREATE INDEX idx_shelf_items_book  ON shelf_items(book_id);

-- ========================
-- Auto-create default shelves for new profiles
-- ========================
CREATE OR REPLACE FUNCTION public.create_default_shelves()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.bookshelves (user_id, name, shelf_type, is_default, sort_order)
  VALUES
    (NEW.id, 'Currently Reading', 'currently_reading', true, 0),
    (NEW.id, 'Want to Read',      'want_to_read',      true, 1),
    (NEW.id, 'Finished',          'finished',          true, 2);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_shelves
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_shelves();

-- Triggers
CREATE TRIGGER set_books_updated_at
  BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_bookshelves_updated_at
  BEFORE UPDATE ON bookshelves FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_shelf_items_updated_at
  BEFORE UPDATE ON shelf_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
