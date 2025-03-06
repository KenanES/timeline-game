import { getDailyEvents } from './lib/dailyEvents';

const events = getDailyEvents();
const now = new Date();
const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

const cutoff = new Date(pstDate);
cutoff.setHours(0, 20, 0, 0); // 12:20 AM PST

console.log('Current time (PST):', pstDate.toLocaleString());
console.log('Cutoff time (PST):', cutoff.toLocaleString());
console.log('Using yesterday\'s events:', pstDate > cutoff);
console.log('\nToday\'s events:');
events.forEach(event => {
    console.log(`- ${event.title} (${event.year})`);
});
