// Script to verify that events are different for different days
// This simulates the new implementation with event groups

// Define the event groups
const eventGroups = [
  // Group 1
  [
    { id: 1, title: "First Moon Landing", year: 1969 },
    { id: 3, title: "Discovery of DNA Structure", year: 1953 },
    { id: 5, title: "First Human Genome Sequenced", year: 2003 },
    { id: 7, title: "Einstein's Theory of Relativity", year: 1905 },
    { id: 9, title: "First Computer Mouse Demo", year: 1968 }
  ],
  // Group 2
  [
    { id: 2, title: "World Wide Web Invented", year: 1989 },
    { id: 4, title: "First iPhone Released", year: 2007 },
    { id: 6, title: "Wright Brothers First Flight", year: 1903 },
    { id: 8, title: "Invention of Television", year: 1927 },
    { id: 10, title: "First Personal Computer", year: 1981 }
  ],
  // Group 3
  [
    { id: 11, title: "First Video Game Console", year: 1972 },
    { id: 12, title: "Discovery of Penicillin", year: 1928 },
    { id: 13, title: "First Heart Transplant", year: 1967 },
    { id: 14, title: "First Space Station", year: 1971 },
    { id: 15, title: "First Email Sent", year: 1971 }
  ]
];

// Function to get events for a specific date
function getEventsForDate(date) {
  // Get day of month for group selection
  const dayOfMonth = date.getDate();
  
  // Select a group based on the day of month (modulo the number of groups)
  const groupIndex = dayOfMonth % eventGroups.length;
  
  return {
    date: date.toISOString().split('T')[0],
    groupIndex,
    events: eventGroups[groupIndex]
  };
}

// Test for multiple days
const startDate = new Date(2025, 2, 6); // March 6, 2025
console.log("Testing events with new group-based algorithm:");

// Test for 10 consecutive days
for (let i = 0; i < 10; i++) {
  const testDate = new Date(startDate);
  testDate.setDate(startDate.getDate() + i);
  
  const result = getEventsForDate(testDate);
  console.log(`\nDate: ${result.date} (Group ${result.groupIndex}):`);
  
  result.events.forEach(event => {
    console.log(`- ${event.title} (${event.year})`);
  });
}
