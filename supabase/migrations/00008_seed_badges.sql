-- ReadQuest Seed Data: Badge Catalog
-- ============================================================

INSERT INTO badges (name, description, icon_url, rarity, category, requirement, xp_reward) VALUES
-- Reading badges
('First Chapter',       'Log your first reading session',                     '/badges/first-chapter.svg',    'common',    'reading', '{"type":"reading_sessions","count":1}',      10),
('Bookworm',            'Log 10 reading sessions',                            '/badges/bookworm.svg',         'common',    'reading', '{"type":"reading_sessions","count":10}',     25),
('Page Turner',         'Read 100 pages total',                               '/badges/page-turner.svg',      'common',    'reading', '{"type":"total_pages","count":100}',         25),
('Marathon Reader',     'Read for 60 minutes in a single session',            '/badges/marathon.svg',         'rare',      'reading', '{"type":"session_minutes","min":60}',        50),
('Book Dragon',         'Finish 5 books',                                     '/badges/book-dragon.svg',      'rare',      'reading', '{"type":"books_completed","count":5}',       75),
('Library Legend',      'Finish 25 books',                                    '/badges/library-legend.svg',   'epic',      'reading', '{"type":"books_completed","count":25}',     150),
('Thousand Pages',      'Read 1,000 pages total',                             '/badges/thousand-pages.svg',   'epic',      'reading', '{"type":"total_pages","count":1000}',       200),
('Unstoppable',         'Finish 100 books',                                   '/badges/unstoppable.svg',      'legendary', 'reading', '{"type":"books_completed","count":100}',    500),

-- Streak badges
('Getting Started',     'Maintain a 3-day reading streak',                    '/badges/streak-3.svg',         'common',    'streak',  '{"type":"streak_days","count":3}',           15),
('Week Warrior',        'Maintain a 7-day reading streak',                    '/badges/streak-7.svg',         'common',    'streak',  '{"type":"streak_days","count":7}',           30),
('Dedicated Reader',    'Maintain a 30-day reading streak',                   '/badges/streak-30.svg',        'rare',      'streak',  '{"type":"streak_days","count":30}',         100),
('Iron Will',           'Maintain a 100-day reading streak',                  '/badges/streak-100.svg',       'epic',      'streak',  '{"type":"streak_days","count":100}',        300),
('Year of Reading',     'Maintain a 365-day reading streak',                  '/badges/streak-365.svg',       'legendary', 'streak',  '{"type":"streak_days","count":365}',       1000),

-- Review badges
('First Review',        'Write your first book review',                       '/badges/first-review.svg',     'common',    'review',  '{"type":"reviews_written","count":1}',       10),
('Critic',              'Write 10 book reviews',                              '/badges/critic.svg',           'rare',      'review',  '{"type":"reviews_written","count":10}',      50),
('Literary Critic',     'Write 50 book reviews',                              '/badges/literary-critic.svg',  'epic',      'review',  '{"type":"reviews_written","count":50}',     150),

-- Genre badges
('Adventure Seeker',    'Finish 5 adventure books',                           '/badges/adventure.svg',        'rare',      'genre',   '{"type":"genre_books","genre":"adventure","count":5}', 50),
('Science Explorer',    'Finish 5 science books',                             '/badges/science.svg',          'rare',      'genre',   '{"type":"genre_books","genre":"science","count":5}',   50),
('Fantasy Fan',         'Finish 5 fantasy books',                             '/badges/fantasy.svg',          'rare',      'genre',   '{"type":"genre_books","genre":"fantasy","count":5}',   50),
('History Buff',        'Finish 5 history books',                             '/badges/history.svg',          'rare',      'genre',   '{"type":"genre_books","genre":"history","count":5}',   50),
('Genre Master',        'Earn 5 different genre badges',                      '/badges/genre-master.svg',     'legendary', 'genre',   '{"type":"genre_badges","count":5}',        500),

-- Social badges
('Friendly',            'Make your first friend on ReadQuest',                '/badges/friendly.svg',         'common',    'social',  '{"type":"friends_count","count":1}',         10),
('Social Butterfly',    'Make 10 friends',                                    '/badges/social.svg',           'rare',      'social',  '{"type":"friends_count","count":10}',        50),
('Helpful',             'Get 10 helpful votes on your reviews',               '/badges/helpful.svg',          'rare',      'social',  '{"type":"helpful_votes","count":10}',        50),

-- Special
('Early Adopter',       'Joined ReadQuest during the beta period',            '/badges/early-adopter.svg',    'legendary', 'special', '{"type":"special","key":"early_adopter"}',  100),
('Challenge Champion',  'Complete 10 challenges',                             '/badges/champion.svg',         'epic',      'special', '{"type":"challenges_completed","count":10}',200);
