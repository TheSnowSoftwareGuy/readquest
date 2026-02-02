-- ReadQuest Core Schema
-- Profiles (extends Supabase auth.users), Schools, Districts, Classes
-- ============================================================

-- ========================
-- Custom enum types
-- ========================
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'admin', 'district_admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'pending_consent', 'deactivated');

-- ========================
-- Districts
-- ========================
CREATE TABLE districts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar(255) NOT NULL,
  state       varchar(50),
  country     varchar(100) NOT NULL DEFAULT 'US',
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ========================
-- Schools
-- ========================
CREATE TABLE schools (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid REFERENCES districts(id),
  name        varchar(255) NOT NULL,
  address     text,
  city        varchar(100),
  state       varchar(50),
  zip_code    varchar(20),
  country     varchar(100) NOT NULL DEFAULT 'US',
  grade_range varchar(20),        -- e.g. "K-5", "6-8"
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_schools_district ON schools(district_id);

-- ========================
-- Profiles (public extension of auth.users)
-- ========================
CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        varchar(50) NOT NULL UNIQUE,
  display_name    varchar(100) NOT NULL,
  role            user_role NOT NULL DEFAULT 'student',
  status          account_status NOT NULL DEFAULT 'active',
  avatar_url      text,
  grade_level     integer,
  date_of_birth   date,
  school_id       uuid REFERENCES schools(id),
  district_id     uuid REFERENCES districts(id),
  parent_id       uuid REFERENCES profiles(id),
  xp              integer NOT NULL DEFAULT 0,
  level           integer NOT NULL DEFAULT 1,
  book_coins      integer NOT NULL DEFAULT 0,
  current_streak  integer NOT NULL DEFAULT 0,
  longest_streak  integer NOT NULL DEFAULT 0,
  last_active_at  timestamptz,
  consent_given   boolean NOT NULL DEFAULT false,
  consent_date    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_username  ON profiles(username);
CREATE INDEX idx_profiles_role      ON profiles(role);
CREATE INDEX idx_profiles_school    ON profiles(school_id);
CREATE INDEX idx_profiles_parent    ON profiles(parent_id);

-- ========================
-- Classes
-- ========================
CREATE TABLE classes (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id                   uuid NOT NULL REFERENCES schools(id),
  teacher_id                  uuid NOT NULL REFERENCES profiles(id),
  name                        varchar(255) NOT NULL,
  grade_level                 integer,
  subject                     varchar(100),
  academic_year               varchar(20) NOT NULL,   -- e.g. "2025-2026"
  is_active                   boolean NOT NULL DEFAULT true,
  join_code                   varchar(10) NOT NULL UNIQUE,
  max_students                integer NOT NULL DEFAULT 35,
  reading_goal_minutes_weekly integer,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_school   ON classes(school_id);
CREATE INDEX idx_classes_teacher  ON classes(teacher_id);

-- ========================
-- Class memberships (students ↔ classes)
-- ========================
CREATE TABLE class_memberships (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id  uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(class_id, user_id)
);

CREATE INDEX idx_class_memberships_class ON class_memberships(class_id);
CREATE INDEX idx_class_memberships_user  ON class_memberships(user_id);

-- ========================
-- Auto-create profile on auth.users insert
-- ========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'::public.user_role)
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================
-- Auto-update updated_at columns
-- ========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_schools_updated_at
  BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_districts_updated_at
  BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_classes_updated_at
  BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
