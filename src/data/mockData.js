// Mock data for ReadQuest demo

export const demoStudent = {
  id: 'student-1',
  firstName: 'Jayden',
  lastInitial: 'M',
  type: 'student',
  gradeLevel: 4,
  school: 'Oakwood Elementary',
  className: 'Ms. Rodriguez\'s Class',
  avatar: '🧑‍🎓',
  xp: 2750,
  level: 12,
  levelName: 'Bookworm',
  currentStreak: 14,
  longestStreak: 21,
  booksRead: 23,
  minutesRead: 4820,
  reviewsWritten: 15,
  badges: ['speed-reader', 'genre-explorer', 'streak-7', 'streak-14', 'review-master', 'fantasy-fan', 'sci-fi-pioneer', 'social-butterfly'],
  readingLevel: { lexile: '720L', ar: '4.5', guidedReading: 'R' },
  preferences: { genres: ['Fantasy', 'Science Fiction', 'Adventure', 'Mystery'] },
}

export const demoTeacher = {
  id: 'teacher-1',
  firstName: 'Ms. Rodriguez',
  type: 'teacher',
  school: 'Oakwood Elementary',
  classes: [
    { id: 'class-1', name: '4th Grade - Period 1', students: 28, avgBooksRead: 3.2, avgMinutes: 142 },
    { id: 'class-2', name: '4th Grade - Period 3', students: 25, avgBooksRead: 2.8, avgMinutes: 128 },
  ],
}

export const levels = [
  { min: 0, max: 100, name: 'New Reader', emoji: '🌱' },
  { min: 1, max: 5, name: 'Page Turner', emoji: '📖' },
  { min: 6, max: 10, name: 'Page Turner', emoji: '📖' },
  { min: 11, max: 25, name: 'Bookworm', emoji: '🐛' },
  { min: 26, max: 50, name: 'Story Explorer', emoji: '🗺️' },
  { min: 51, max: 75, name: 'Reading Champion', emoji: '🏆' },
  { min: 76, max: 100, name: 'Literary Legend', emoji: '👑' },
]

export const getLevelInfo = (level) => {
  if (level <= 0) return levels[0]
  if (level <= 5) return levels[1]
  if (level <= 10) return levels[2]
  if (level <= 25) return levels[3]
  if (level <= 50) return levels[4]
  if (level <= 75) return levels[5]
  return levels[6]
}

export const xpForLevel = (level) => Math.floor(100 * Math.pow(1.15, level - 1))

export const badges = [
  { id: 'speed-reader', name: 'Speed Reader', icon: '⚡', description: 'Read 500+ pages in a week', rarity: 'rare', color: '#F97316' },
  { id: 'genre-explorer', name: 'Genre Explorer', icon: '🗺️', description: 'Read books from 5 different genres', rarity: 'uncommon', color: '#14B8A6' },
  { id: 'streak-7', name: '7-Day Streak', icon: '🔥', description: 'Read 7 days in a row', rarity: 'common', color: '#EF4444' },
  { id: 'streak-14', name: '14-Day Streak', icon: '🔥🔥', description: 'Read 14 days in a row', rarity: 'uncommon', color: '#EF4444' },
  { id: 'review-master', name: 'Review Master', icon: '✍️', description: 'Write 10 book reviews', rarity: 'uncommon', color: '#8B5CF6' },
  { id: 'fantasy-fan', name: 'Fantasy Fan', icon: '🧙', description: 'Read 5 fantasy books', rarity: 'common', color: '#6C3CE1' },
  { id: 'sci-fi-pioneer', name: 'Sci-Fi Pioneer', icon: '🚀', description: 'Read 3 science fiction books', rarity: 'common', color: '#3B82F6' },
  { id: 'social-butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Get 20 likes on your reviews', rarity: 'rare', color: '#EC4899' },
  { id: 'book-50', name: 'Half Century', icon: '📚', description: 'Read 50 books total', rarity: 'epic', color: '#FBBF24' },
  { id: 'early-bird', name: 'Early Bird', icon: '🐦', description: 'Log reading before 8 AM', rarity: 'common', color: '#22C55E' },
  { id: 'night-owl', name: 'Night Owl', icon: '🦉', description: 'Log reading after 8 PM', rarity: 'common', color: '#1E1B4B' },
  { id: 'challenge-champ', name: 'Challenge Champion', icon: '🏅', description: 'Complete 5 reading challenges', rarity: 'rare', color: '#F97316' },
]

export const sampleBooks = [
  { id: '1', title: 'Percy Jackson & The Lightning Thief', author: 'Rick Riordan', cover: 'https://covers.openlibrary.org/b/isbn/0786838655-L.jpg', rating: 4.8, genres: ['Fantasy', 'Adventure'], lexile: '680L', pages: 375, description: 'Percy Jackson discovers he is a demigod and must prevent a war between the gods.' },
  { id: '2', title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney', cover: 'https://covers.openlibrary.org/b/isbn/0810993139-L.jpg', rating: 4.5, genres: ['Humor', 'Realistic Fiction'], lexile: '950L', pages: 217, description: 'Greg Heffley navigates middle school with his best friend Rowley.' },
  { id: '3', title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', cover: 'https://covers.openlibrary.org/b/isbn/0590353403-L.jpg', rating: 4.9, genres: ['Fantasy'], lexile: '880L', pages: 309, description: 'A young wizard discovers his magical heritage and attends Hogwarts School.' },
  { id: '4', title: 'Wonder', author: 'R.J. Palacio', cover: 'https://covers.openlibrary.org/b/isbn/0375869026-L.jpg', rating: 4.7, genres: ['Realistic Fiction'], lexile: '790L', pages: 315, description: 'August Pullman, born with facial differences, navigates fifth grade at a new school.' },
  { id: '5', title: 'The Wild Robot', author: 'Peter Brown', cover: 'https://covers.openlibrary.org/b/isbn/0316381993-L.jpg', rating: 4.6, genres: ['Science Fiction', 'Adventure'], lexile: '740L', pages: 278, description: 'A robot named Roz learns to survive in the wilderness and becomes a mother to a gosling.' },
  { id: '6', title: 'Wings of Fire: The Dragonet Prophecy', author: 'Tui T. Sutherland', cover: 'https://covers.openlibrary.org/b/isbn/0545349184-L.jpg', rating: 4.7, genres: ['Fantasy', 'Adventure'], lexile: '790L', pages: 336, description: 'Five young dragons are raised in secret to fulfill a mysterious prophecy.' },
  { id: '7', title: 'Dog Man', author: 'Dav Pilkey', cover: 'https://covers.openlibrary.org/b/isbn/0545581605-L.jpg', rating: 4.4, genres: ['Humor', 'Graphic Novel'], lexile: '530L', pages: 240, description: 'A cop and a police dog are combined into one heroic crime-fighting canine.' },
  { id: '8', title: 'The One and Only Ivan', author: 'Katherine Applegate', cover: 'https://covers.openlibrary.org/b/isbn/0061992259-L.jpg', rating: 4.6, genres: ['Realistic Fiction', 'Adventure'], lexile: '570L', pages: 305, description: 'A gorilla named Ivan lives in a mall and dreams of a better life.' },
  { id: '9', title: 'Hatchet', author: 'Gary Paulsen', cover: 'https://covers.openlibrary.org/b/isbn/1416936475-L.jpg', rating: 4.5, genres: ['Adventure', 'Survival'], lexile: '1020L', pages: 195, description: 'Thirteen-year-old Brian must survive alone in the Canadian wilderness after a plane crash.' },
  { id: '10', title: 'Amulet: The Stonekeeper', author: 'Kazu Kibuishi', cover: 'https://covers.openlibrary.org/b/isbn/0439846811-L.jpg', rating: 4.6, genres: ['Fantasy', 'Graphic Novel'], lexile: '470L', pages: 187, description: 'Emily discovers a magical amulet and must use its power to save her family.' },
  { id: '11', title: 'The Hunger Games', author: 'Suzanne Collins', cover: 'https://covers.openlibrary.org/b/isbn/0439023483-L.jpg', rating: 4.8, genres: ['Science Fiction', 'Adventure'], lexile: '810L', pages: 374, description: 'In a dystopian future, Katniss Everdeen volunteers to fight in a deadly televised competition.' },
  { id: '12', title: 'Holes', author: 'Louis Sachar', cover: 'https://covers.openlibrary.org/b/isbn/0440414806-L.jpg', rating: 4.6, genres: ['Adventure', 'Mystery'], lexile: '660L', pages: 233, description: 'Stanley Yelnats is sent to a bizarre camp where boys dig holes all day.' },
]

export const bookshelf = {
  reading: [sampleBooks[0], sampleBooks[5]],
  finished: [sampleBooks[2], sampleBooks[3], sampleBooks[7], sampleBooks[11], sampleBooks[1]],
  wantToRead: [sampleBooks[4], sampleBooks[8], sampleBooks[10]],
}

export const readingLog = [
  { date: '2026-02-01', minutes: 35, pages: 42, book: 'Percy Jackson & The Lightning Thief' },
  { date: '2026-01-31', minutes: 28, pages: 33, book: 'Percy Jackson & The Lightning Thief' },
  { date: '2026-01-30', minutes: 45, pages: 51, book: 'Wings of Fire: The Dragonet Prophecy' },
  { date: '2026-01-29', minutes: 22, pages: 26, book: 'Wings of Fire: The Dragonet Prophecy' },
  { date: '2026-01-28', minutes: 30, pages: 35, book: 'Wings of Fire: The Dragonet Prophecy' },
  { date: '2026-01-27', minutes: 40, pages: 48, book: 'Holes' },
  { date: '2026-01-26', minutes: 25, pages: 30, book: 'Holes' },
  { date: '2026-01-25', minutes: 38, pages: 44, book: 'Holes' },
  { date: '2026-01-24', minutes: 32, pages: 37, book: 'Wonder' },
  { date: '2026-01-23', minutes: 28, pages: 32, book: 'Wonder' },
  { date: '2026-01-22', minutes: 42, pages: 50, book: 'Wonder' },
  { date: '2026-01-21', minutes: 20, pages: 24, book: 'Harry Potter' },
  { date: '2026-01-20', minutes: 35, pages: 40, book: 'Harry Potter' },
  { date: '2026-01-19', minutes: 30, pages: 36, book: 'Harry Potter' },
]

export const socialFeed = [
  { id: 1, user: 'Maya L.', avatar: '👧', action: 'finished reading', book: 'Charlotte\'s Web', time: '2 hours ago', emoji: '⭐⭐⭐⭐⭐' },
  { id: 2, user: 'Ethan K.', avatar: '👦', action: 'earned a badge', badge: '7-Day Streak 🔥', time: '3 hours ago' },
  { id: 3, user: 'Sophia R.', avatar: '👩', action: 'reviewed', book: 'The Wild Robot', review: 'This book made me cry! Roz is the best robot ever. I wish she was real. ❤️', rating: 5, time: '5 hours ago' },
  { id: 4, user: 'Liam D.', avatar: '🧑', action: 'started reading', book: 'Percy Jackson & The Lightning Thief', time: '6 hours ago' },
  { id: 5, user: 'Ava C.', avatar: '👧', action: 'completed challenge', challenge: 'Genre Explorer — January', time: '8 hours ago' },
  { id: 6, user: 'Noah W.', avatar: '👦', action: 'leveled up to', level: 'Story Explorer (Level 28)! 🗺️', time: '1 day ago' },
]

export const challenges = [
  { id: 1, title: 'February Book Bingo', creator: 'Ms. Rodriguez', type: 'bingo', progress: 12, total: 25, xpReward: 200, endDate: '2026-02-28', description: 'Complete a row on the reading bingo card!', active: true },
  { id: 2, title: 'Read Around the World', creator: 'Platform', type: 'exploration', progress: 3, total: 7, xpReward: 150, endDate: '2026-03-31', description: 'Read books set on 7 different continents', active: true },
  { id: 3, title: 'Fantasy February', creator: 'Platform', type: 'genre', progress: 1, total: 4, xpReward: 100, endDate: '2026-02-28', description: 'Read 4 fantasy books this month', active: true },
  { id: 4, title: 'Review Rampage', creator: 'Ms. Rodriguez', type: 'reviews', progress: 8, total: 10, xpReward: 75, endDate: '2026-02-15', description: 'Write 10 thoughtful book reviews', active: true },
]

export const classStudents = [
  { id: 1, name: 'Maya L.', avatar: '👧', booksRead: 5, minutesWeek: 185, streak: 12, xp: 3200, level: 15, status: 'on-track' },
  { id: 2, name: 'Jayden M.', avatar: '🧑‍🎓', booksRead: 4, minutesWeek: 142, streak: 14, xp: 2750, level: 12, status: 'on-track' },
  { id: 3, name: 'Sophia R.', avatar: '👩', booksRead: 6, minutesWeek: 210, streak: 21, xp: 4100, level: 18, status: 'exceeding' },
  { id: 4, name: 'Ethan K.', avatar: '👦', booksRead: 3, minutesWeek: 95, streak: 7, xp: 1800, level: 9, status: 'on-track' },
  { id: 5, name: 'Ava C.', avatar: '👧', booksRead: 7, minutesWeek: 250, streak: 28, xp: 5200, level: 22, status: 'exceeding' },
  { id: 6, name: 'Liam D.', avatar: '🧑', booksRead: 2, minutesWeek: 60, streak: 3, xp: 900, level: 5, status: 'needs-support' },
  { id: 7, name: 'Emma T.', avatar: '👧', booksRead: 4, minutesWeek: 130, streak: 10, xp: 2400, level: 11, status: 'on-track' },
  { id: 8, name: 'Noah W.', avatar: '👦', booksRead: 5, minutesWeek: 175, streak: 16, xp: 3500, level: 16, status: 'exceeding' },
  { id: 9, name: 'Olivia P.', avatar: '👧', booksRead: 1, minutesWeek: 35, streak: 0, xp: 400, level: 3, status: 'needs-support' },
  { id: 10, name: 'James H.', avatar: '👦', booksRead: 3, minutesWeek: 110, streak: 5, xp: 1600, level: 8, status: 'on-track' },
]

export const leaderboard = [
  { rank: 1, name: 'Ava C.', avatar: '👧', xp: 5200, books: 7, school: 'Oakwood Elementary' },
  { rank: 2, name: 'Sophia R.', avatar: '👩', xp: 4100, books: 6, school: 'Oakwood Elementary' },
  { rank: 3, name: 'Noah W.', avatar: '👦', xp: 3500, books: 5, school: 'Oakwood Elementary' },
  { rank: 4, name: 'Maya L.', avatar: '👧', xp: 3200, books: 5, school: 'Oakwood Elementary' },
  { rank: 5, name: 'Jayden M.', avatar: '🧑‍🎓', xp: 2750, books: 4, school: 'Oakwood Elementary' },
  { rank: 6, name: 'Emma T.', avatar: '👧', xp: 2400, books: 4, school: 'Oakwood Elementary' },
  { rank: 7, name: 'Ethan K.', avatar: '👦', xp: 1800, books: 3, school: 'Oakwood Elementary' },
  { rank: 8, name: 'James H.', avatar: '👦', xp: 1600, books: 3, school: 'Oakwood Elementary' },
]

export const recommendations = [
  { ...sampleBooks[4], reason: 'Because you loved "Percy Jackson"' },
  { ...sampleBooks[10], reason: 'Trending in 4th Grade' },
  { ...sampleBooks[8], reason: 'Adventure fans also love this' },
  { ...sampleBooks[9], reason: 'Perfect for your reading level' },
  { ...sampleBooks[6], reason: 'Your friends are reading this' },
]

export const weeklyStats = {
  minutesGoal: 150,
  minutesRead: 142,
  booksGoal: 1,
  booksRead: 0,
  pagesRead: 285,
  reviewsWritten: 2,
}

export const testimonials = [
  { name: 'Sarah M.', role: '3rd Grade Teacher, Denver CO', text: 'ReadQuest transformed my classroom reading culture. Students are actually excited to log their reading and compete with each other. The AI recommendations are spot-on.', avatar: '👩‍🏫' },
  { name: 'David K.', role: 'Parent of 2', text: 'Finally, an app that makes my kids WANT to read instead of play video games. The streak system is genius — my daughter hasn\'t missed a day in 3 weeks.', avatar: '👨' },
  { name: 'Dr. Lisa Chen', role: 'Curriculum Director, Bay Area USD', text: 'The district analytics and COPPA compliance sold us. We piloted in 5 schools and saw a 40% increase in voluntary reading minutes within the first month.', avatar: '👩‍💼' },
  { name: 'Jayden, Age 10', role: 'Student', text: 'I love earning badges and seeing what my friends are reading! I\'ve read more books this year than ever before. My avatar is SO cool.', avatar: '🧑‍🎓' },
]

export const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individual readers',
    features: ['Virtual bookshelf', 'Basic reading log', '3 AI recommendations/week', 'Limited badges & XP', 'Social feed (school only)', 'Barcode scanner'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$4.99',
    period: '/month',
    description: 'For serious young readers',
    features: ['Everything in Free', 'Unlimited AI recommendations', 'Full gamification system', 'In-app reading library', 'Family features', 'No ads', 'Priority support', 'Advanced stats'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'School',
    price: '$2.50',
    period: '/student/year',
    description: 'For classrooms & schools',
    features: ['Everything in Premium', 'Teacher dashboard', 'Class management', 'Reading reports (PDF/CSV)', 'LMS integration', 'Bulk student import', 'School leaderboards', 'Challenge templates'],
    cta: 'Request Demo',
    popular: false,
  },
  {
    name: 'District',
    price: 'Custom',
    period: 'per student/year',
    description: 'For school districts',
    features: ['Everything in School', 'District-wide analytics', 'SSO (Clever, ClassLink)', 'Impact reporting', 'Dedicated success manager', 'API access', 'Custom branding', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
]

export const features = [
  { icon: '🤖', title: 'AI-Powered Recommendations', description: 'Our smart recommendation engine learns what each student loves and suggests their perfect next read — like having a personal librarian for every child.' },
  { icon: '🏆', title: 'Gamification That Works', description: 'XP, streaks, badges, leaderboards, and level-ups keep students motivated. Reading becomes an adventure, not a chore.' },
  { icon: '📚', title: 'Virtual Bookshelf', description: 'Students organize books they\'re reading, finished, and want to read on a beautiful visual bookshelf. Add books with a barcode scan!' },
  { icon: '👥', title: 'Social Reading', description: 'See what friends are reading, share reviews, react to activity, and discover books through your school community.' },
  { icon: '📊', title: 'Teacher Dashboard', description: 'Real-time insights into every student\'s reading habits. Create challenges, track goals, and generate reports for conferences.' },
  { icon: '🔒', title: 'COPPA & FERPA Compliant', description: 'Built from the ground up for student privacy. Parental consent flows, data encryption, no behavioral advertising. Ever.' },
  { icon: '📱', title: 'Mobile-First', description: 'Beautiful native apps for iOS, Android, and Chromebook. Works offline too — reading logs sync when you\'re back online.' },
  { icon: '📖', title: 'In-App Reading', description: 'Thousands of books available to read right inside the app with adjustable fonts, read-along audio, and automatic progress tracking.' },
]

export const stats = [
  { value: '1.5M+', label: 'Books in Database' },
  { value: '98%', label: 'Student Satisfaction' },
  { value: '2.3x', label: 'More Books Read' },
  { value: '85%', label: 'School Renewal Rate' },
]
