// Script to check tomorrow's events
// This uses a different seed calculation to get different events

const allEvents = [
  { id: 1, title: "First Moon Landing", year: 1969 },
  { id: 2, title: "World Wide Web Invented", year: 1989 },
  { id: 3, title: "Discovery of DNA Structure", year: 1953 },
  { id: 4, title: "First iPhone Released", year: 2007 },
  { id: 5, title: "First Human Genome Sequenced", year: 2003 },
  { id: 6, title: "Wright Brothers First Flight", year: 1903 },
  { id: 7, title: "Einstein's Theory of Relativity", year: 1905 },
  { id: 8, title: "Invention of Television", year: 1927 },
  { id: 9, title: "First Computer Mouse Demo", year: 1968 },
  { id: 10, title: "First Personal Computer", year: 1981 },
  { id: 11, title: "First Video Game Console", year: 1972 },
  { id: 12, title: "Discovery of Penicillin", year: 1928 },
  { id: 13, title: "First Heart Transplant", year: 1967 },
  { id: 14, title: "First Space Station", year: 1971 },
  { id: 15, title: "First Email Sent", year: 1971 }
];

const EVENTS_PER_DAY = 5;

// Get tomorrow's date in PST
const now = new Date();
const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
const tomorrow = new Date(pstDate);
tomorrow.setDate(pstDate.getDate() + 1);

// Format as YYYY-MM-DD
const dateString = tomorrow.toISOString().split('T')[0];

console.log('Today\'s date in PST:', pstDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
console.log('Tomorrow\'s date:', tomorrow.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
console.log('Date string for seed:', dateString);

// Use a different seed calculation for tomorrow
let seed = 42; // Start with a different base
for (let i = 0; i < dateString.length; i++) {
  seed = (seed * 31 + dateString.charCodeAt(i)) % 1000000;
}

console.log('Seed value:', seed);

// Use the seed to select tomorrow's events
const shuffledEvents = [...allEvents];
for (let i = shuffledEvents.length - 1; i > 0; i--) {
  const j = Math.abs((seed * (i + 1)) % (i + 1));
  [shuffledEvents[i], shuffledEvents[j]] = [shuffledEvents[j], shuffledEvents[i]];
}

const tomorrowEvents = shuffledEvents.slice(0, EVENTS_PER_DAY);

console.log('Events for tomorrow:');
tomorrowEvents.forEach(event => {
  console.log(`- ${event.title} (${event.year})`);
});
