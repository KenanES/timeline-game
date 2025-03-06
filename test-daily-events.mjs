import { getDailyEvents } from './lib/dailyEvents.ts';


// Test different dates
const dates = [
  new Date('2025-02-25T00:00:00-08:00'), // Today at midnight PST
  new Date('2025-02-26T00:00:00-08:00'), // Tomorrow at midnight PST
  new Date('2025-02-27T00:00:00-08:00')  // Day after tomorrow at midnight PST
];

dates.forEach(date => {
  // Mock the current date
  const realDate = Date;
  global.Date = class extends Date {
    constructor() {
      return date;
    }
  };
  
  console.log(`\nEvents for ${date.toISOString()}:`);
  console.log(getDailyEvents());
  
  // Restore the real Date
  global.Date = realDate;
});
