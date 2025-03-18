// Script to test the daily events for multiple days
// This simulates the new implementation in dailyEvents.ts

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

// Function to get events for a specific date
function getEventsForDate(date) {
  // Get day of month (1-31) and month (0-11) for rotation
  const dayOfMonth = date.getDate();
  const month = date.getMonth();
  
  // Create a deterministic rotation based on the day of month
  // This ensures different events on different days
  const rotationAmount = (dayOfMonth + month * 31) % allEvents.length;
  
  console.log(`Date: ${date.toISOString().split('T')[0]}, Rotation: ${rotationAmount}`);

  // Rotate the array by the rotation amount
  const rotatedEvents = [...allEvents];
  for (let i = 0; i < rotationAmount; i++) {
    rotatedEvents.push(rotatedEvents.shift());
  }
  
  // Take the first EVENTS_PER_DAY events
  return rotatedEvents.slice(0, EVENTS_PER_DAY);
}

// Test for multiple days
const startDate = new Date(2025, 2, 6); // March 6, 2025
console.log("Testing events for multiple days with new seeding algorithm:");

for (let i = 0; i < 5; i++) {
  const testDate = new Date(startDate);
  testDate.setDate(startDate.getDate() + i);
  
  const dateString = testDate.toISOString().split('T')[0];
  console.log(`\nEvents for ${dateString}:`);
  
  const events = getEventsForDate(testDate);
  events.forEach(event => {
    console.log(`- ${event.title} (${event.year})`);
  });
}
