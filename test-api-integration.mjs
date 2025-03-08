// Script to test the API integration
import fetch from 'node-fetch';

// API URL for fetching historical events
const API_URL = "https://api.api-ninjas.com/v1/historicalevents";

// You'll need to replace this with your actual API key
// Get a free API key from https://api-ninjas.com/
const API_KEY = process.env.API_NINJAS_KEY || "";

/**
 * Fetches historical events from the API for a specific date
 * @param {number} month Month (1-12)
 * @param {number} day Day of month (1-31)
 * @returns {Promise<Array>} Array of historical events
 */
async function fetchHistoricalEvents(month, day) {
  try {
    // Format the month and day for the API
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    
    console.log(`Fetching events for ${formattedMonth}-${formattedDay}...`);
    
    // Make the API request
    const response = await fetch(`${API_URL}?month=${formattedMonth}&day=${formattedDay}`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Transform the API response to our event format
    return data.map((event, index) => ({
      id: index + 1,
      title: event.event,
      year: parseInt(event.year, 10)
    })).slice(0, 5);
  } catch (error) {
    console.error('Error fetching historical events:', error);
    return [];
  }
}

// Test for multiple dates
async function testMultipleDates() {
  console.log("Testing API integration with multiple dates:");
  
  // Test for today and the next 3 days
  const today = new Date();
  
  for (let i = 0; i < 4; i++) {
    const testDate = new Date(today);
    testDate.setDate(today.getDate() + i);
    
    const month = testDate.getMonth() + 1; // JavaScript months are 0-indexed
    const day = testDate.getDate();
    
    const events = await fetchHistoricalEvents(month, day);
    
    console.log(`\nDate: ${testDate.toISOString().split('T')[0]}:`);
    
    if (events.length === 0) {
      console.log("No events found or API key not set.");
    } else {
      events.forEach(event => {
        console.log(`- ${event.title} (${event.year})`);
      });
    }
  }
}

// Run the test
testMultipleDates().catch(error => {
  console.error("Test failed:", error);
});

console.log("\nNOTE: If you see 'No events found or API key not set', you need to:");
console.log("1. Sign up for a free API key at https://api-ninjas.com/");
console.log("2. Set the API_NINJAS_KEY environment variable before running this script:");
console.log("   export API_NINJAS_KEY=your_api_key_here");
console.log("   node test-api-integration.mjs");
