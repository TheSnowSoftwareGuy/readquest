/**
 * ReadQuest — Database Types (auto-generated shape, manually authored)
 *
 * These types mirror the Supabase schema defined in supabase/migrations/.
 * After connecting to a real Supabase project, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 *
 * Until then, this hand-written version keeps the front-end type-safe.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enum Types
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'district_admin';
export type AccountStatus = 'active' | 'suspended' | 'pending_consent' | 'deactivated';
export type ShelfStatus = 'reading' | 'want_to_read' | 'finished';
export type ReadingSource = 'timer' | 'manual' | 'automatic';
export type ReviewVisibility = 'class' | 'school' | 'public' | 'private';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = 'reading' | 'social' | 'streak' | 'genre' | 'review' | 'special';
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';
export type ConsentType = 'coppa_parental' | 'terms_of_service' | 'privacy_policy' | 'data_collection' | 'social_features';
export type ConsentMethod = 'email_verification' | 'signed_form' | 'in_app' | 'school_authorization';
export type FeedItemType = 'book_completed' | 'review_posted' | 'badge_earned' | 'level_up' | 'streak_milestone' | 'challenge_completed' | 'book_added';
export type NotificationType = 'streak_reminder' | 'challenge_deadline' | 'achievement_earned' | 'friend_request' | 'class_announcement' | 'reading_goal_progress' | 'new_badge' | 'level_up' | 'weekly_summary';
export type QuestType = 'read_minutes' | 'read_pages' | 'write_review' | 'add_book' | 'social_action';

// ─────────────────────────────────────────────────────────────────────────────
// Database Schema Type (Supabase client generic)
// ─────────────────────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      districts: {
        Row: {
          id: string;
          name: string;
          state: string | null;
          country: string;
          settings: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          state?: string | null;
          country?: string;
          settings?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          state?: string | null;
          country?: string;
          settings?: Record<string, unknown>;
          is_active?: boolean;
          updated_at?: string;
        };
      };

      schools: {
        Row: {
          id: string;
          district_id: string | null;
          name: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string;
          grade_range: string | null;
          settings: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          district_id?: string | null;
          name: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          grade_range?: string | null;
          settings?: Record<string, unknown>;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          district_id?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          grade_range?: string | null;
          settings?: Record<string, unknown>;
          is_active?: boolean;
        };
      };

      profiles: {
        Row: {
          id: string;
          role: UserRole;
          status: AccountStatus;
          display_name: string;
          username: string | null;
          avatar_url: string | null;
          school_id: string | null;
          district_id: string | null;
          grade: number | null;
          reading_level: string | null;
          date_of_birth: string | null;
          parent_id: string | null;
          book_coins: number;
          last_active_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          status?: AccountStatus;
          display_name: string;
          username?: string | null;
          avatar_url?: string | null;
          school_id?: string | null;
          district_id?: string | null;
          grade?: number | null;
          reading_level?: string | null;
          date_of_birth?: string | null;
          parent_id?: string | null;
          book_coins?: number;
        };
        Update: {
          display_name?: string;
          username?: string | null;
          avatar_url?: string | null;
          school_id?: string | null;
          district_id?: string | null;
          grade?: number | null;
          reading_level?: string | null;
          date_of_birth?: string | null;
          parent_id?: string | null;
          book_coins?: number;
          last_active_at?: string | null;
          status?: AccountStatus;
        };
      };

      classes: {
        Row: {
          id: string;
          name: string;
          teacher_id: string;
          school_id: string;
          grade: number | null;
          subject: string | null;
          academic_year: string;
          join_code: string | null;
          max_students: number;
          reading_goal_minutes_weekly: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          teacher_id: string;
          school_id: string;
          grade?: number | null;
          subject?: string | null;
          academic_year: string;
          join_code?: string | null;
          max_students?: number;
          reading_goal_minutes_weekly?: number | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          grade?: number | null;
          subject?: string | null;
          academic_year?: string;
          join_code?: string | null;
          max_students?: number;
          reading_goal_minutes_weekly?: number | null;
          is_active?: boolean;
        };
      };

      class_members: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          is_active: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
          is_active?: boolean;
          joined_at?: string;
        };
        Update: {
          is_active?: boolean;
        };
      };

      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          authors: string[];
          isbn10: string | null;
          isbn13: string | null;
          open_library_id: string | null;
          cover_url: string | null;
          cover_url_small: string | null;
          cover_url_medium: string | null;
          description: string | null;
          publisher: string | null;
          publish_date: string | null;
          page_count: number | null;
          genres: string[];
          subjects: string[];
          lexile_level: number | null;
          reading_level: string | null;
          age_range_min: number | null;
          age_range_max: number | null;
          language: string;
          average_rating: number | null;
          ratings_count: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          authors?: string[];
          isbn10?: string | null;
          isbn13?: string | null;
          open_library_id?: string | null;
          cover_url?: string | null;
          cover_url_small?: string | null;
          cover_url_medium?: string | null;
          description?: string | null;
          publisher?: string | null;
          publish_date?: string | null;
          page_count?: number | null;
          genres?: string[];
          subjects?: string[];
          lexile_level?: number | null;
          reading_level?: string | null;
          age_range_min?: number | null;
          age_range_max?: number | null;
          language?: string;
        };
        Update: {
          title?: string;
          author?: string;
          authors?: string[];
          isbn10?: string | null;
          isbn13?: string | null;
          open_library_id?: string | null;
          cover_url?: string | null;
          cover_url_small?: string | null;
          cover_url_medium?: string | null;
          description?: string | null;
          publisher?: string | null;
          publish_date?: string | null;
          page_count?: number | null;
          genres?: string[];
          subjects?: string[];
          lexile_level?: number | null;
          reading_level?: string | null;
          age_range_min?: number | null;
          age_range_max?: number | null;
          language?: string;
          average_rating?: number | null;
          ratings_count?: number;
          reviews_count?: number;
        };
      };

      bookshelves: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          is_default?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          sort_order?: number;
        };
      };

      shelf_items: {
        Row: {
          id: string;
          bookshelf_id: string;
          book_id: string;
          user_id: string;
          status: ShelfStatus;
          current_page: number;
          total_pages: number | null;
          progress_percent: number;
          sort_order: number;
          notes: string | null;
          started_at: string | null;
          finished_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bookshelf_id: string;
          book_id: string;
          user_id: string;
          status?: ShelfStatus;
          current_page?: number;
          total_pages?: number | null;
          sort_order?: number;
          notes?: string | null;
          started_at?: string | null;
        };
        Update: {
          bookshelf_id?: string;
          status?: ShelfStatus;
          current_page?: number;
          total_pages?: number | null;
          progress_percent?: number;
          sort_order?: number;
          notes?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
        };
      };

      reading_logs: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          duration_minutes: number;
          pages_read: number;
          start_page: number | null;
          end_page: number | null;
          source: ReadingSource;
          notes: string | null;
          xp_earned: number;
          is_suspicious: boolean;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          duration_minutes: number;
          pages_read?: number;
          start_page?: number | null;
          end_page?: number | null;
          source?: ReadingSource;
          notes?: string | null;
          logged_at?: string;
        };
        Update: {
          duration_minutes?: number;
          pages_read?: number;
          start_page?: number | null;
          end_page?: number | null;
          source?: ReadingSource;
          notes?: string | null;
          logged_at?: string;
        };
      };

      reviews: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          emoji_rating: string | null;
          has_spoilers: boolean;
          visibility: ReviewVisibility;
          status: ReviewStatus;
          moderated_at: string | null;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          rating: number;
          title?: string | null;
          content?: string | null;
          emoji_rating?: string | null;
          has_spoilers?: boolean;
          visibility?: ReviewVisibility;
          status?: ReviewStatus;
        };
        Update: {
          rating?: number;
          title?: string | null;
          content?: string | null;
          emoji_rating?: string | null;
          has_spoilers?: boolean;
          visibility?: ReviewVisibility;
          status?: ReviewStatus;
          moderated_at?: string | null;
          helpful_count?: number;
        };
      };

      xp_events: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          xp_amount: number;
          source_id: string | null;
          source_type: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          xp_amount: number;
          source_id?: string | null;
          source_type?: string | null;
          description?: string | null;
        };
        Update: never; // immutable
      };

      user_levels: {
        Row: {
          user_id: string;
          current_level: number;
          current_xp: number;
          total_xp: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_level?: number;
          current_xp?: number;
          total_xp?: number;
        };
        Update: {
          current_level?: number;
          current_xp?: number;
          total_xp?: number;
        };
      };

      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          rarity: BadgeRarity;
          category: BadgeCategory;
          criteria_json: Record<string, unknown>;
          xp_reward: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          rarity?: BadgeRarity;
          category?: BadgeCategory;
          criteria_json: Record<string, unknown>;
          xp_reward?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          icon?: string;
          rarity?: BadgeRarity;
          category?: BadgeCategory;
          criteria_json?: Record<string, unknown>;
          xp_reward?: number;
          is_active?: boolean;
        };
      };

      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          is_new: boolean;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          is_new?: boolean;
          earned_at?: string;
        };
        Update: {
          is_new?: boolean;
        };
      };

      streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_read_date: string | null;
          streak_freeze_available: number;
          streak_freeze_used_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_read_date?: string | null;
          streak_freeze_available?: number;
        };
        Update: {
          current_streak?: number;
          longest_streak?: number;
          last_read_date?: string | null;
          streak_freeze_available?: number;
          streak_freeze_used_at?: string | null;
        };
      };

      daily_quests: {
        Row: {
          id: string;
          user_id: string;
          quest_type: QuestType;
          description: string | null;
          target: number;
          progress: number;
          xp_reward: number;
          coin_reward: number;
          completed: boolean;
          completed_at: string | null;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_type: QuestType;
          description?: string | null;
          target: number;
          progress?: number;
          xp_reward?: number;
          coin_reward?: number;
          completed?: boolean;
          date?: string;
        };
        Update: {
          progress?: number;
          completed?: boolean;
          completed_at?: string | null;
        };
      };

      challenges: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: string;
          target: number;
          xp_reward: number;
          badge_id: string | null;
          start_date: string;
          end_date: string;
          created_by: string;
          class_id: string | null;
          school_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: string;
          target: number;
          xp_reward?: number;
          badge_id?: string | null;
          start_date: string;
          end_date: string;
          created_by: string;
          class_id?: string | null;
          school_id?: string | null;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          type?: string;
          target?: number;
          xp_reward?: number;
          badge_id?: string | null;
          start_date?: string;
          end_date?: string;
          class_id?: string | null;
          school_id?: string | null;
          is_active?: boolean;
        };
      };

      challenge_progress: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          progress: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          progress?: number;
          completed_at?: string | null;
        };
        Update: {
          progress?: number;
          completed_at?: string | null;
        };
      };

      feed_items: {
        Row: {
          id: string;
          user_id: string;
          type: FeedItemType;
          reference_id: string | null;
          reference_type: string | null;
          content: string | null;
          data_json: Record<string, unknown>;
          class_id: string | null;
          school_id: string | null;
          is_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: FeedItemType;
          reference_id?: string | null;
          reference_type?: string | null;
          content?: string | null;
          data_json?: Record<string, unknown>;
          class_id?: string | null;
          school_id?: string | null;
          is_visible?: boolean;
        };
        Update: {
          content?: string | null;
          data_json?: Record<string, unknown>;
          is_visible?: boolean;
        };
      };

      reactions: {
        Row: {
          id: string;
          feed_item_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          feed_item_id: string;
          user_id: string;
          emoji: string;
        };
        Update: never; // immutable — delete and re-create
      };

      friendships: {
        Row: {
          id: string;
          user_a_id: string;
          user_b_id: string;
          status: FriendshipStatus;
          school_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_a_id: string;
          user_b_id: string;
          status?: FriendshipStatus;
          school_id?: string | null;
        };
        Update: {
          status?: FriendshipStatus;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string | null;
          data_json: Record<string, unknown>;
          read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body?: string | null;
          data_json?: Record<string, unknown>;
          read?: boolean;
        };
        Update: {
          read?: boolean;
          read_at?: string | null;
        };
      };

      consent_records: {
        Row: {
          id: string;
          student_id: string;
          parent_id: string | null;
          consent_type: ConsentType;
          consent_method: ConsentMethod;
          granted: boolean;
          granted_at: string | null;
          revoked_at: string | null;
          ip_address: string | null;
          user_agent: string | null;
          permissions_json: Record<string, unknown>;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          parent_id?: string | null;
          consent_type: ConsentType;
          consent_method?: ConsentMethod;
          granted?: boolean;
          granted_at?: string | null;
          permissions_json?: Record<string, unknown>;
          metadata?: Record<string, unknown>;
        };
        Update: {
          granted?: boolean;
          granted_at?: string | null;
          revoked_at?: string | null;
          permissions_json?: Record<string, unknown>;
          metadata?: Record<string, unknown>;
        };
      };
    };

    Views: Record<string, never>;

    Functions: {
      get_user_role: {
        Args: { uid: string };
        Returns: UserRole;
      };
      get_user_school: {
        Args: { uid: string };
        Returns: string | null;
      };
      is_teacher_of_class: {
        Args: { teacher_uid: string; cid: string };
        Returns: boolean;
      };
      is_student_in_class: {
        Args: { student_uid: string; cid: string };
        Returns: boolean;
      };
      teacher_has_student: {
        Args: { teacher_uid: string; student_uid: string };
        Returns: boolean;
      };
      is_parent_of: {
        Args: { parent_uid: string; child_uid: string };
        Returns: boolean;
      };
      is_school_admin: {
        Args: { uid: string; sid: string };
        Returns: boolean;
      };
    };

    Enums: {
      user_role: UserRole;
      account_status: AccountStatus;
      shelf_status: ShelfStatus;
      reading_source: ReadingSource;
      review_visibility: ReviewVisibility;
      review_status: ReviewStatus;
      badge_rarity: BadgeRarity;
      badge_category: BadgeCategory;
      friendship_status: FriendshipStatus;
      consent_type: ConsentType;
      consent_method: ConsentMethod;
      feed_item_type: FeedItemType;
      notification_type: NotificationType;
      quest_type: QuestType;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience type aliases
// ─────────────────────────────────────────────────────────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Row type shortcuts
export type Profile = Tables<'profiles'>;
export type District = Tables<'districts'>;
export type School = Tables<'schools'>;
export type Class = Tables<'classes'>;
export type ClassMember = Tables<'class_members'>;
export type Book = Tables<'books'>;
export type Bookshelf = Tables<'bookshelves'>;
export type ShelfItem = Tables<'shelf_items'>;
export type ReadingLog = Tables<'reading_logs'>;
export type Review = Tables<'reviews'>;
export type XpEvent = Tables<'xp_events'>;
export type UserLevel = Tables<'user_levels'>;
export type Badge = Tables<'badges'>;
export type UserBadge = Tables<'user_badges'>;
export type Streak = Tables<'streaks'>;
export type DailyQuest = Tables<'daily_quests'>;
export type Challenge = Tables<'challenges'>;
export type ChallengeProgress = Tables<'challenge_progress'>;
export type FeedItem = Tables<'feed_items'>;
export type Reaction = Tables<'reactions'>;
export type Friendship = Tables<'friendships'>;
export type Notification = Tables<'notifications'>;
export type ConsentRecord = Tables<'consent_records'>;
