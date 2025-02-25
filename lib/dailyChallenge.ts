import { addDays, differenceInDays, startOfDay } from 'date-fns';

// The start date of the game (we'll use this as a seed)
const GAME_EPOCH = new Date(2024, 0, 1); // January 1, 2024

export interface DailyEvent {
  date: string;
  content: string;
  year: number;
}

// Get the challenge number (days since launch)
export function getChallengeNumber(date = new Date()): number {
  return differenceInDays(startOfDay(date), GAME_EPOCH);
}

// Get a deterministic set of years for a given challenge number
export function getDailyYears(challengeNumber: number): number[] {
  // Use the challenge number as a seed to generate a deterministic set of years
  const seed = challengeNumber;
  
  // Define year ranges for different difficulties
  const ranges = [
    { min: 1700, max: 1800, count: 2 }, // Easy (same century)
    { min: 1500, max: 1900, count: 3 }, // Medium (wider range)
    { min: 1000, max: 2000, count: 4 }, // Hard (millennium)
  ];

  // Use challenge number to determine difficulty
  const difficulty = challengeNumber % 3;
  const range = ranges[difficulty];

  // Generate deterministic years
  const years: number[] = [];
  let hash = seed;
  
  while (years.length < range.count) {
    // Simple hash function
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const year = range.min + (hash % (range.max - range.min));
    if (!years.includes(year)) {
      years.push(year);
    }
  }

  return years.sort((a, b) => a - b);
}

// Local storage keys
export const STORAGE_KEYS = {
  STATS: 'timeline_stats',
  LAST_PLAYED: 'timeline_last_played',
  CURRENT_STREAK: 'timeline_current_streak',
  MAX_STREAK: 'timeline_max_streak',
  COMPLETED_CHALLENGES: 'timeline_completed',
};

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: string | null;
  completedChallenges: number[];
}

// Initialize or get stats from local storage
export function getStats(): GameStats {
  if (typeof window === 'undefined') return getDefaultStats();
  
  const stored = localStorage.getItem(STORAGE_KEYS.STATS);
  if (!stored) return getDefaultStats();
  
  return JSON.parse(stored);
}

function getDefaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayed: null,
    completedChallenges: [],
  };
}

// Update stats after a game
export function updateStats(won: boolean, challengeNumber: number) {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  // Update basic stats
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  // Update completion tracking
  stats.lastPlayed = today;
  if (!stats.completedChallenges.includes(challengeNumber)) {
    stats.completedChallenges.push(challengeNumber);
  }

  // Save to local storage
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  return stats;
}

// Generate share text (like Wordle's squares)
export function generateShareText(events: DailyEvent[], guessOrder: number[]): string {
  const challengeNumber = getChallengeNumber();
  const correct = JSON.stringify(guessOrder) === JSON.stringify(events.map((_, i) => i));
  
  const squares = guessOrder.map((guess, actual) => 
    guess === actual ? '🟩' : '🟥'
  ).join('');

  return `Timeline Game #${challengeNumber}\n${squares}\nPlay at: [your-url-here]`;
}
