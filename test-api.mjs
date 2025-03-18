// Script to test the API endpoints
// Run this after starting the development server

async function testAPI() {
  console.log('Testing /api/events endpoint (today\'s events):');
  try {
    const response = await fetch('http://localhost:3000/api/events');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log('Today\'s events:');
    data.forEach(event => {
      console.log(`- ${event.title} (${event.year})`);
    });
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
  }

  console.log('\nTesting /api/tomorrow-events endpoint:');
  try {
    const response = await fetch('http://localhost:3000/api/tomorrow-events');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Tomorrow's date: ${data.date}`);
    console.log('Tomorrow\'s events:');
    data.events.forEach(event => {
      console.log(`- ${event.title} (${event.year})`);
    });
  } catch (error) {
    console.error('Error fetching tomorrow\'s events:', error);
  }

  console.log('\nTesting /api/check-events endpoint:');
  try {
    const response = await fetch('http://localhost:3000/api/check-events');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Current date: ${data.date}`);
    console.log('Today\'s events:');
    data.events.forEach(event => {
      console.log(`- ${event.title} (${event.year})`);
    });
  } catch (error) {
    console.error('Error fetching check-events:', error);
  }
}

testAPI();
