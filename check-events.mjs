// Simple script to check today's events

// Mock implementation of the getDailyEvents function
function mockGetDailyEvents() {
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

  // Get current date in PST (UTC-8)
  const now = new Date();
  const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  
  // Get hours and minutes in PST for comparison
  const currentHours = pstDate.getHours();
  const currentMinutes = pstDate.getMinutes();
  
  // Create a date object for the seed (default to today)
  const seedDate = new Date(pstDate);
  
  // If current time is before 12:20 AM PST, use yesterday's date as seed
  if (currentHours === 0 && currentMinutes < 20) {
    seedDate.setDate(seedDate.getDate() - 1);
  }
  
  // Format date as YYYY-MM-DD for consistent seeding
  const dateString = seedDate.toISOString().split('T')[0];
  
  // Create a deterministic seed from the date string
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & 0xFFFFFFFF; // Convert to 32-bit integer
  }

  // Use the seed to select today's events
  const shuffledEvents = [...allEvents];
  for (let i = shuffledEvents.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1)) % (i + 1));
    [shuffledEvents[i], shuffledEvents[j]] = [shuffledEvents[j], shuffledEvents[i]];
  }

  return shuffledEvents.slice(0, EVENTS_PER_DAY);
}

// Get today's date in PST
const now = new Date();
const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

// Create date for March 10, 2025
const march10Date = new Date(2025, 2, 10); // Month is 0-indexed, so 2 = March

console.log('Today\'s date in PST:', pstDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
console.log('March 10 date:', march10Date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
console.log('Events for March 10:');

// Function to get events for a specific date
function getEventsForDate(date) {
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
  
  // Format date as YYYY-MM-DD for consistent seeding
  const dateString = date.toISOString().split('T')[0];
  console.log('Using date string for seed:', dateString);
  
  // Create a deterministic seed from the date string
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & 0xFFFFFFFF; // Convert to 32-bit integer
  }

  // Use the seed to select today's events
  const shuffledEvents = [...allEvents];
  for (let i = shuffledEvents.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1)) % (i + 1));
    [shuffledEvents[i], shuffledEvents[j]] = [shuffledEvents[j], shuffledEvents[i]];
  }

  return shuffledEvents.slice(0, EVENTS_PER_DAY);
}

// Get March 10 events
const events = getEventsForDate(march10Date);
events.forEach(event => {
  console.log(`- ${event.title} (${event.year})`);
});
