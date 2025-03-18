// Script to test the local API endpoints
import fetch from 'node-fetch';

// Base URL for the local API
const BASE_URL = 'http://localhost:3000/api';

/**
 * Tests the /api/events endpoint
 */
async function testEventsEndpoint() {
  try {
    console.log('Testing /api/events endpoint...');
    const response = await fetch(`${BASE_URL}/events`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Events:', data);
    return data;
  } catch (error) {
    console.error('Error testing events endpoint:', error);
    return null;
  }
}

/**
 * Tests the /api/tomorrow-events endpoint
 */
async function testTomorrowEventsEndpoint() {
  try {
    console.log('\nTesting /api/tomorrow-events endpoint...');
    const response = await fetch(`${BASE_URL}/tomorrow-events`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Tomorrow\'s Date:', data.date);
    console.log('Tomorrow\'s Events:', data.events);
    return data;
  } catch (error) {
    console.error('Error testing tomorrow-events endpoint:', error);
    return null;
  }
}

/**
 * Tests the /api/check-events endpoint
 */
async function testCheckEventsEndpoint() {
  try {
    console.log('\nTesting /api/check-events endpoint...');
    const response = await fetch(`${BASE_URL}/check-events`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Current Date:', data.formattedDate);
    console.log('Events:', data.events);
    return data;
  } catch (error) {
    console.error('Error testing check-events endpoint:', error);
    return null;
  }
}

/**
 * Main function to run all tests
 */
async function runTests() {
  console.log('=== Testing Local API Endpoints ===\n');
  
  // Test all endpoints
  await testEventsEndpoint();
  await testTomorrowEventsEndpoint();
  await testCheckEventsEndpoint();
  
  console.log('\n=== Tests Completed ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Tests failed:', error);
});
