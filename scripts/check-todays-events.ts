// Script to check today's events
import { getDailyEvents } from '../lib/dailyEvents';

console.log('Today\'s date in PST:', new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
console.log('Events for today:');
const events = getDailyEvents();
events.forEach(event => {
  console.log(`- ${event.title} (${event.year})`);
});
