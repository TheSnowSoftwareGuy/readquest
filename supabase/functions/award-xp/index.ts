/**
 * ReadQuest Edge Function: award-xp
 *
 * Calculates and awards XP for user actions, handles level-ups,
 * streak updates, and badge checks.
 *
 * Called via: POST /award-xp
 * Auth: Requires valid JWT (service_role or user token)
 *
 * Body:
 *   {
 *     user_id: string,
 *     action: string,           // e.g. 'reading_session', 'book_completed', 'review_written'
 *     source_id?: string,       // FK to the triggering record
 *     source_type?: string,     // e.g. 'reading_log', 'review'
 *     metadata?: {              // action-specific data
 *       duration_minutes?: number,
 *       pages_read?: number,
 *       book_id?: string,
 *     }
 *   }
 *
 * Response: { xp_awarded, new_total_xp, new_level, leveled_up, badges_earned[] }
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// ─────────────────────────────────────────────────────────────────────────────
// XP Configuration — tune these values to balance the economy
// ─────────────────────────────────────────────────────────────────────────────

const XP_RATES: Record<string, (meta: Record<string, unknown>) => number> = {
  // 2 XP per minute read (min 5, max 120)
  reading_session: (meta) => {
    const minutes = Math.min((meta.duration_minutes as number) ?? 0, 120);
    return Math.max(Math.floor(minutes * 2), 5);
  },
  // Flat 50 XP for completing a book
  book_completed: () => 50,
  // 25 XP for writing a review
  review_written: () => 25,
  // 10 XP for adding a book to shelf
  book_added: () => 10,
  // 5 XP for social interactions
  social_interaction: () => 5,
  // Streak bonus: 5 XP per streak day (up to 50)
  streak_bonus: (meta) => {
    const streak = (meta.streak_days as number) ?? 1;
    return Math.min(streak * 5, 50);
  },
  // Daily quest completion
  daily_quest: () => 25,
  // Challenge completion
  challenge_completed: () => 100,
  // First login of the day
  daily_login: () => 5,
};

// ─────────────────────────────────────────────────────────────────────────────
// Level thresholds — XP required to reach each level
// Level N requires: 100 * N * (N + 1) / 2 total XP (quadratic curve)
// ─────────────────────────────────────────────────────────────────────────────

function xpForLevel(level: number): number {
  // XP needed to go FROM level to level+1
  return 100 * level;
}

function calculateLevel(totalXp: number): { level: number; currentXp: number } {
  let level = 1;
  let xpRemaining = totalXp;

  while (xpRemaining >= xpForLevel(level) && level < 100) {
    xpRemaining -= xpForLevel(level);
    level++;
  }

  return { level, currentXp: xpRemaining };
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AwardXpRequest {
  user_id: string;
  action: string;
  source_id?: string;
  source_type?: string;
  metadata?: Record<string, unknown>;
}

interface BadgeEarned {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  xp_reward: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge checking logic
// ─────────────────────────────────────────────────────────────────────────────

async function checkAndAwardBadges(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  _action: string,
  _metadata: Record<string, unknown>
): Promise<BadgeEarned[]> {
  const earned: BadgeEarned[] = [];

  // Get all badges the user hasn't earned yet
  const { data: unearned } = await supabase
    .from('badges')
    .select('*')
    .eq('is_active', true)
    .not('id', 'in', `(SELECT badge_id FROM user_badges WHERE user_id = '${userId}')`);

  if (!unearned || unearned.length === 0) return earned;

  // Get user stats for badge criteria evaluation
  const [
    { count: booksCompleted },
    { count: reviewsWritten },
    { count: friendsCount },
    { data: streakData },
    { data: readingStats },
  ] = await Promise.all([
    supabase.from('shelf_items').select('*', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'finished'),
    supabase.from('reviews').select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase.from('friendships').select('*', { count: 'exact', head: true })
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`).eq('status', 'accepted'),
    supabase.from('streaks').select('current_streak, longest_streak').eq('user_id', userId).single(),
    supabase.rpc('get_user_reading_stats', { uid: userId }).maybeSingle(),
  ]);

  const stats = {
    books_completed: booksCompleted ?? 0,
    reviews_written: reviewsWritten ?? 0,
    friends_made: friendsCount ?? 0,
    streak_days: Math.max(streakData?.current_streak ?? 0, streakData?.longest_streak ?? 0),
    pages_read: (readingStats as Record<string, number>)?.total_pages ?? 0,
  };

  // Evaluate each unearned badge
  for (const badge of unearned) {
    const criteria = badge.criteria_json as Record<string, unknown>;
    const criteriaType = criteria.type as string;
    const criteriaCount = (criteria.count as number) ?? 0;
    let qualifies = false;

    switch (criteriaType) {
      case 'books_completed':
        qualifies = stats.books_completed >= criteriaCount;
        break;
      case 'pages_read':
        qualifies = stats.pages_read >= criteriaCount;
        break;
      case 'reviews_written':
        qualifies = stats.reviews_written >= criteriaCount;
        break;
      case 'streak_days':
        qualifies = stats.streak_days >= criteriaCount;
        break;
      case 'friends_made':
        qualifies = stats.friends_made >= criteriaCount;
        break;
      case 'account_created':
        qualifies = true; // awarded on signup
        break;
      // Add more criteria types as needed
      default:
        break;
    }

    if (qualifies) {
      const { error } = await supabase
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badge.id });

      if (!error) {
        earned.push({
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          rarity: badge.rarity,
          xp_reward: badge.xp_reward,
        });
      }
    }
  }

  return earned;
}

// ─────────────────────────────────────────────────────────────────────────────
// Streak update logic
// ─────────────────────────────────────────────────────────────────────────────

async function updateStreak(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ current_streak: number; is_new_day: boolean }> {
  const today = new Date().toISOString().split('T')[0];

  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) {
    // Create streak record (shouldn't happen — trigger creates on signup)
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_read_date: today,
    });
    return { current_streak: 1, is_new_day: true };
  }

  const lastDate = streak.last_read_date;

  if (lastDate === today) {
    // Already read today — no streak change
    return { current_streak: streak.current_streak, is_new_day: false };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak: number;
  if (lastDate === yesterdayStr) {
    // Consecutive day — increment
    newStreak = streak.current_streak + 1;
  } else {
    // Streak broken — check for freeze
    if (streak.streak_freeze_available > 0) {
      newStreak = streak.current_streak + 1;
      await supabase
        .from('streaks')
        .update({
          streak_freeze_available: streak.streak_freeze_available - 1,
          streak_freeze_used_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } else {
      newStreak = 1; // reset
    }
  }

  const newLongest = Math.max(newStreak, streak.longest_streak);

  await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_read_date: today,
    })
    .eq('user_id', userId);

  return { current_streak: newStreak, is_new_day: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Use service_role to bypass RLS for XP/level/badge writes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify the calling user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: AwardXpRequest = await req.json();
    const { user_id, action, source_id, source_type, metadata = {} } = body;

    if (!user_id || !action) {
      return new Response(
        JSON.stringify({ error: 'user_id and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate XP amount
    const xpCalculator = XP_RATES[action];
    if (!xpCalculator) {
      return new Response(
        JSON.stringify({ error: `Unknown action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xpAmount = xpCalculator(metadata);

    // 1. Insert XP event
    await supabase.from('xp_events').insert({
      user_id,
      action,
      xp_amount: xpAmount,
      source_id: source_id ?? null,
      source_type: source_type ?? null,
      description: `Earned ${xpAmount} XP for ${action}`,
    });

    // 2. Update user level
    const { data: currentLevel } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', user_id)
      .single();

    const oldLevel = currentLevel?.current_level ?? 1;
    const newTotalXp = (currentLevel?.total_xp ?? 0) + xpAmount;
    const { level: newLevel, currentXp: newCurrentXp } = calculateLevel(newTotalXp);
    const leveledUp = newLevel > oldLevel;

    await supabase
      .from('user_levels')
      .upsert({
        user_id,
        current_level: newLevel,
        current_xp: newCurrentXp,
        total_xp: newTotalXp,
      });

    // 3. Update streak if this is a reading action
    let streakInfo = null;
    if (['reading_session', 'book_completed'].includes(action)) {
      streakInfo = await updateStreak(supabase, user_id);

      // Award streak bonus XP if it's a new day
      if (streakInfo.is_new_day && streakInfo.current_streak > 1) {
        const streakXp = XP_RATES.streak_bonus({ streak_days: streakInfo.current_streak });
        await supabase.from('xp_events').insert({
          user_id,
          action: 'streak_bonus',
          xp_amount: streakXp,
          description: `${streakInfo.current_streak}-day streak bonus!`,
        });
      }
    }

    // 4. Check for new badges
    const badgesEarned = await checkAndAwardBadges(supabase, user_id, action, metadata);

    // Award XP for each badge earned
    for (const badge of badgesEarned) {
      if (badge.xp_reward > 0) {
        await supabase.from('xp_events').insert({
          user_id,
          action: 'badge_earned',
          xp_amount: badge.xp_reward,
          source_id: badge.id,
          source_type: 'badge',
          description: `Earned badge: ${badge.name}`,
        });
      }
    }

    // 5. Create notification if leveled up
    if (leveledUp) {
      await supabase.from('notifications').insert({
        user_id,
        type: 'level_up',
        title: `Level Up! 🎉`,
        body: `You reached Level ${newLevel}!`,
        data_json: { old_level: oldLevel, new_level: newLevel },
      });

      // Create feed item for level up
      await supabase.from('feed_items').insert({
        user_id,
        type: 'level_up',
        content: `reached Level ${newLevel}!`,
        data_json: { level: newLevel },
      });
    }

    // 6. Create notifications for badges
    for (const badge of badgesEarned) {
      await supabase.from('notifications').insert({
        user_id,
        type: 'new_badge',
        title: `New Badge: ${badge.name} ${badge.icon}`,
        body: `You earned the ${badge.name} badge!`,
        data_json: { badge_id: badge.id, badge_name: badge.name, rarity: badge.rarity },
      });

      await supabase.from('feed_items').insert({
        user_id,
        type: 'badge_earned',
        reference_id: badge.id,
        reference_type: 'badge',
        content: `earned the ${badge.name} badge! ${badge.icon}`,
        data_json: { badge_name: badge.name, badge_icon: badge.icon, rarity: badge.rarity },
      });
    }

    return new Response(
      JSON.stringify({
        xp_awarded: xpAmount,
        new_total_xp: newTotalXp,
        new_level: newLevel,
        new_current_xp: newCurrentXp,
        xp_to_next_level: xpForLevel(newLevel),
        leveled_up: leveledUp,
        streak: streakInfo,
        badges_earned: badgesEarned,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('award-xp error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
