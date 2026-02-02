import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(import.meta.dirname, '..', 'supabase', 'migrations');

describe('Database Schema Migrations', () => {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  it('should have all expected migration files', () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
    expect(files[0]).toMatch(/00001_core_schema/);
    expect(files[1]).toMatch(/00002_books_and_shelves/);
    expect(files[2]).toMatch(/00003_reading_and_reviews/);
    expect(files[3]).toMatch(/00004_gamification/);
    expect(files[4]).toMatch(/00005_social/);
    expect(files[5]).toMatch(/00006_notifications_and_consent/);
    expect(files[6]).toMatch(/00007_rls_policies/);
    expect(files[7]).toMatch(/00008_seed_badges/);
  });

  it('should have migrations in sequential order', () => {
    for (let i = 0; i < files.length; i++) {
      const num = parseInt(files[i].substring(0, 5));
      expect(num).toBe(i + 1);
    }
  });

  describe('00001_core_schema.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[0]), 'utf8');

    it('should create user_role enum', () => {
      expect(sql).toContain("CREATE TYPE user_role AS ENUM");
      expect(sql).toContain("'student'");
      expect(sql).toContain("'teacher'");
      expect(sql).toContain("'parent'");
      expect(sql).toContain("'admin'");
    });

    it('should create districts table', () => {
      expect(sql).toContain('CREATE TABLE districts');
    });

    it('should create schools table', () => {
      expect(sql).toContain('CREATE TABLE schools');
      expect(sql).toContain('REFERENCES districts(id)');
    });

    it('should create profiles table referencing auth.users', () => {
      expect(sql).toContain('CREATE TABLE profiles');
      expect(sql).toContain('REFERENCES auth.users(id) ON DELETE CASCADE');
    });

    it('should have profile fields for gamification', () => {
      expect(sql).toContain('xp');
      expect(sql).toContain('level');
      expect(sql).toContain('book_coins');
      expect(sql).toContain('current_streak');
      expect(sql).toContain('longest_streak');
    });

    it('should create classes table', () => {
      expect(sql).toContain('CREATE TABLE classes');
      expect(sql).toContain('join_code');
      expect(sql).toContain('reading_goal_minutes_weekly');
    });

    it('should create class_memberships table', () => {
      expect(sql).toContain('CREATE TABLE class_memberships');
      expect(sql).toContain('UNIQUE(class_id, user_id)');
    });

    it('should create trigger for auto-profile on user signup', () => {
      expect(sql).toContain('handle_new_user');
      expect(sql).toContain('on_auth_user_created');
      expect(sql).toContain('AFTER INSERT ON auth.users');
    });

    it('should create updated_at trigger function', () => {
      expect(sql).toContain('set_updated_at');
    });
  });

  describe('00002_books_and_shelves.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[1]), 'utf8');

    it('should create books table with Open Library fields', () => {
      expect(sql).toContain('CREATE TABLE books');
      expect(sql).toContain('isbn_10');
      expect(sql).toContain('isbn_13');
      expect(sql).toContain('open_library_key');
      expect(sql).toContain('lexile_level');
      expect(sql).toContain('reading_level');
    });

    it('should create bookshelves table', () => {
      expect(sql).toContain('CREATE TABLE bookshelves');
      expect(sql).toContain("shelf_type");
    });

    it('should create shelf_items with progress tracking', () => {
      expect(sql).toContain('CREATE TABLE shelf_items');
      expect(sql).toContain('current_page');
      expect(sql).toContain('progress_percent');
      expect(sql).toContain('UNIQUE(user_id, book_id)');
    });

    it('should auto-create default shelves for new users', () => {
      expect(sql).toContain('create_default_shelves');
      expect(sql).toContain("'Currently Reading'");
      expect(sql).toContain("'Want to Read'");
      expect(sql).toContain("'Finished'");
    });
  });

  describe('00003_reading_and_reviews.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[2]), 'utf8');

    it('should create reading_logs table', () => {
      expect(sql).toContain('CREATE TABLE reading_logs');
      expect(sql).toContain('duration_minutes');
      expect(sql).toContain('pages_read');
      expect(sql).toContain('is_suspicious');
      expect(sql).toContain('xp_earned');
    });

    it('should create reviews table with rating constraint', () => {
      expect(sql).toContain('CREATE TABLE reviews');
      expect(sql).toContain('CHECK (rating >= 1 AND rating <= 5)');
      expect(sql).toContain('UNIQUE(user_id, book_id)');
    });

    it('should have a trigger to recalculate book ratings', () => {
      expect(sql).toContain('recalculate_book_rating');
    });
  });

  describe('00004_gamification.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[3]), 'utf8');

    it('should create xp_events table', () => {
      expect(sql).toContain('CREATE TABLE xp_events');
    });

    it('should create badges table', () => {
      expect(sql).toContain('CREATE TABLE badges');
      expect(sql).toContain('badge_rarity');
      expect(sql).toContain('badge_category');
    });

    it('should create user_badges with uniqueness', () => {
      expect(sql).toContain('CREATE TABLE user_badges');
      expect(sql).toContain('UNIQUE(user_id, badge_id)');
    });

    it('should create streaks table (one per user)', () => {
      expect(sql).toContain('CREATE TABLE streaks');
      expect(sql).toContain('streak_freeze_available');
    });

    it('should create daily_quests table', () => {
      expect(sql).toContain('CREATE TABLE daily_quests');
      expect(sql).toContain('quest_type');
      expect(sql).toContain('target_value');
    });

    it('should create challenges and progress tables', () => {
      expect(sql).toContain('CREATE TABLE challenges');
      expect(sql).toContain('CREATE TABLE challenge_progress');
      expect(sql).toContain('UNIQUE(challenge_id, user_id)');
    });

    it('should sync XP total to profiles on insert', () => {
      expect(sql).toContain('sync_xp_to_profile');
      expect(sql).toContain('AFTER INSERT ON xp_events');
    });
  });

  describe('00005_social.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[4]), 'utf8');

    it('should create feed_items table', () => {
      expect(sql).toContain('CREATE TABLE feed_items');
      expect(sql).toContain('feed_item_type');
    });

    it('should create reactions table with unique constraint', () => {
      expect(sql).toContain('CREATE TABLE reactions');
      expect(sql).toContain('UNIQUE(user_id, feed_item_id)');
    });

    it('should create friendships with same-school constraint', () => {
      expect(sql).toContain('CREATE TABLE friendships');
      expect(sql).toContain('school_id');
      expect(sql).toContain('CHECK (requester_id <> addressee_id)');
    });
  });

  describe('00007_rls_policies.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[6]), 'utf8');

    it('should enable RLS on all user-data tables', () => {
      const rlsTables = [
        'profiles', 'schools', 'districts', 'classes', 'class_memberships',
        'books', 'bookshelves', 'shelf_items', 'reading_logs', 'reviews',
        'xp_events', 'badges', 'user_badges', 'streaks', 'daily_quests',
        'challenges', 'challenge_progress', 'feed_items', 'reactions',
        'friendships', 'notifications', 'consent_records',
      ];
      for (const table of rlsTables) {
        expect(sql).toContain(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
      }
    });

    it('should have student self-access policies', () => {
      expect(sql).toContain('auth.uid()');
      expect(sql).toContain('reading_logs_select_own');
      expect(sql).toContain('shelf_items_select_own');
    });

    it('should have teacher-sees-class policies', () => {
      expect(sql).toContain('reading_logs_select_teacher');
      expect(sql).toContain('bookshelves_select_teacher');
      expect(sql).toContain('shelf_items_select_teacher');
    });

    it('should have parent-sees-child policies', () => {
      expect(sql).toContain('reading_logs_select_parent');
      expect(sql).toContain('parent_id = auth.uid()');
    });

    it('should allow anon read on books', () => {
      expect(sql).toContain('books_select_anon');
      expect(sql).toContain('TO anon');
    });
  });

  describe('00008_seed_badges.sql', () => {
    const sql = readFileSync(join(MIGRATIONS_DIR, files[7]), 'utf8');

    it('should seed badge records', () => {
      expect(sql).toContain('INSERT INTO badges');
      expect(sql).toContain("'First Chapter'");
      expect(sql).toContain("'Bookworm'");
      expect(sql).toContain("'legendary'");
      expect(sql).toContain("'Early Adopter'");
    });
  });
});
