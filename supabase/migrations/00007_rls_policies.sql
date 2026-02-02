-- ReadQuest Row Level Security Policies
-- ============================================================
-- Policy naming convention:  {table}_{action}_{who}
-- auth.uid() = current Supabase Auth user id

-- ================================================================
-- PROFILES
-- ================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read profiles (needed for social features, leaderboards)
CREATE POLICY profiles_select_authenticated ON profiles
  FOR SELECT TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Teachers can update students in their classes
CREATE POLICY profiles_update_teacher_students ON profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_memberships cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.user_id = profiles.id
        AND c.teacher_id = auth.uid()
    )
  );

-- Parents can view their children
CREATE POLICY profiles_select_parent_children ON profiles
  FOR SELECT TO authenticated
  USING (parent_id = auth.uid());

-- ================================================================
-- SCHOOLS & DISTRICTS (read-only for authenticated, admin-writable)
-- ================================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY schools_select_authenticated ON schools
  FOR SELECT TO authenticated USING (true);

CREATE POLICY districts_select_authenticated ON districts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY schools_insert_admin ON schools
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'district_admin'))
  );

CREATE POLICY districts_insert_admin ON districts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'district_admin'))
  );

-- ================================================================
-- CLASSES
-- ================================================================
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Students & teachers in a school can see classes at that school
CREATE POLICY classes_select_school_members ON classes
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = classes.school_id)
  );

-- Teachers can create classes at their school
CREATE POLICY classes_insert_teacher ON classes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
    AND teacher_id = auth.uid()
  );

-- Teachers can update their own classes
CREATE POLICY classes_update_own ON classes
  FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- ================================================================
-- CLASS MEMBERSHIPS
-- ================================================================
ALTER TABLE class_memberships ENABLE ROW LEVEL SECURITY;

-- Users can see their own memberships
CREATE POLICY cm_select_own ON class_memberships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Teachers can see memberships for their classes
CREATE POLICY cm_select_teacher ON class_memberships
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM classes WHERE id = class_memberships.class_id AND teacher_id = auth.uid())
  );

-- Teachers can add students to their classes
CREATE POLICY cm_insert_teacher ON class_memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM classes WHERE id = class_id AND teacher_id = auth.uid())
  );

-- ================================================================
-- BOOKS (public read, admin/system write)
-- ================================================================
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY books_select_all ON books
  FOR SELECT TO authenticated USING (true);

-- Allow anon read too (for the public book search page)
CREATE POLICY books_select_anon ON books
  FOR SELECT TO anon USING (true);

-- Authenticated users can insert (cache from Open Library)
CREATE POLICY books_insert_authenticated ON books
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- ================================================================
-- BOOKSHELVES
-- ================================================================
ALTER TABLE bookshelves ENABLE ROW LEVEL SECURITY;

-- Users see their own shelves
CREATE POLICY bookshelves_select_own ON bookshelves
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Teachers can see shelves of students in their classes
CREATE POLICY bookshelves_select_teacher ON bookshelves
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_memberships cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.user_id = bookshelves.user_id AND c.teacher_id = auth.uid()
    )
  );

-- Users manage their own shelves
CREATE POLICY bookshelves_insert_own ON bookshelves
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY bookshelves_update_own ON bookshelves
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY bookshelves_delete_own ON bookshelves
  FOR DELETE TO authenticated USING (user_id = auth.uid() AND is_default = false);

-- ================================================================
-- SHELF ITEMS
-- ================================================================
ALTER TABLE shelf_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY shelf_items_select_own ON shelf_items
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY shelf_items_select_teacher ON shelf_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_memberships cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.user_id = shelf_items.user_id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY shelf_items_insert_own ON shelf_items
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY shelf_items_update_own ON shelf_items
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY shelf_items_delete_own ON shelf_items
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ================================================================
-- READING LOGS
-- ================================================================
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY reading_logs_select_own ON reading_logs
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY reading_logs_select_teacher ON reading_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_memberships cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.user_id = reading_logs.user_id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY reading_logs_select_parent ON reading_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = reading_logs.user_id AND parent_id = auth.uid())
  );

CREATE POLICY reading_logs_insert_own ON reading_logs
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY reading_logs_update_own ON reading_logs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ================================================================
-- REVIEWS
-- ================================================================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public reviews are visible to all authenticated; class/school scoped accordingly
CREATE POLICY reviews_select_public ON reviews
  FOR SELECT TO authenticated
  USING (visibility = 'public');

CREATE POLICY reviews_select_own ON reviews
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY reviews_insert_own ON reviews
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY reviews_update_own ON reviews
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY reviews_delete_own ON reviews
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ================================================================
-- XP EVENTS
-- ================================================================
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY xp_events_select_own ON xp_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Insert handled by triggers/edge functions (service role), but allow user inserts too
CREATE POLICY xp_events_insert_own ON xp_events
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ================================================================
-- BADGES (global catalog — read-only for users)
-- ================================================================
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY badges_select_all ON badges
  FOR SELECT TO authenticated USING (true);

-- ================================================================
-- USER BADGES
-- ================================================================
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_badges_select_own ON user_badges
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Let classmates see each other's badges (for social features)
CREATE POLICY user_badges_select_classmates ON user_badges
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_memberships cm1
      JOIN class_memberships cm2 ON cm1.class_id = cm2.class_id
      WHERE cm1.user_id = auth.uid() AND cm2.user_id = user_badges.user_id
    )
  );

-- ================================================================
-- STREAKS
-- ================================================================
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY streaks_select_own ON streaks
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY streaks_insert_own ON streaks
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY streaks_update_own ON streaks
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ================================================================
-- DAILY QUESTS
-- ================================================================
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY daily_quests_select_own ON daily_quests
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY daily_quests_update_own ON daily_quests
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ================================================================
-- CHALLENGES & PROGRESS
-- ================================================================
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;

-- Challenges visible to class/school members
CREATE POLICY challenges_select_class ON challenges
  FOR SELECT TO authenticated
  USING (
    class_id IS NULL -- school-wide/global
    OR EXISTS (
      SELECT 1 FROM class_memberships WHERE class_id = challenges.class_id AND user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );

CREATE POLICY challenges_insert_teacher ON challenges
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
    AND created_by = auth.uid()
  );

CREATE POLICY challenge_progress_select_own ON challenge_progress
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY challenge_progress_insert_own ON challenge_progress
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY challenge_progress_update_own ON challenge_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Teachers can see progress in their challenges
CREATE POLICY challenge_progress_select_teacher ON challenge_progress
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM challenges WHERE id = challenge_progress.challenge_id AND created_by = auth.uid())
  );

-- ================================================================
-- FEED ITEMS
-- ================================================================
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

-- Users see feed items from their class
CREATE POLICY feed_items_select_class ON feed_items
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (class_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM class_memberships WHERE class_id = feed_items.class_id AND user_id = auth.uid()
    ))
    OR (school_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND school_id = feed_items.school_id
    ))
  );

CREATE POLICY feed_items_insert_own ON feed_items
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ================================================================
-- REACTIONS
-- ================================================================
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY reactions_select_on_visible_feed ON reactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM feed_items fi WHERE fi.id = reactions.feed_item_id AND fi.is_visible = true
    )
  );

CREATE POLICY reactions_insert_own ON reactions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY reactions_delete_own ON reactions
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ================================================================
-- FRIENDSHIPS
-- ================================================================
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY friendships_select_own ON friendships
  FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY friendships_insert_own ON friendships
  FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid());

CREATE POLICY friendships_update_parties ON friendships
  FOR UPDATE TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- ================================================================
-- NOTIFICATIONS
-- ================================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ================================================================
-- CONSENT RECORDS
-- ================================================================
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY consent_select_own ON consent_records
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR parent_id = auth.uid());

CREATE POLICY consent_insert_parent ON consent_records
  FOR INSERT TO authenticated
  WITH CHECK (parent_id = auth.uid());
