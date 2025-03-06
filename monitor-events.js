const https = require('https');

function fetchEvents() {
  const now = new Date();
  console.log(`\nChecking events at ${now.toLocaleTimeString()}`);
  
  https.get('https://timeline-thegame-git-preprod-kenansakarcan-gmailcoms-projects.vercel.app', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const events = JSON.parse(data);
        console.log('Current events:', events.map(e => e.title).join(', '));
      } catch (e) {
        console.log('Error parsing response:', data);
      }
    });
  }).on('error', (err) => {
    console.log('Error fetching events:', err.message);
  });
}

// Check every minute
console.log('Starting event monitor...');
console.log('Will check every minute until 12:20 AM PST');
fetchEvents(); // Initial check
const interval = setInterval(() => {
  const now = new Date();
  now.setHours(now.getHours() - 8); // Convert to PST
  
  // Stop at 12:20 AM PST
  if (now.getHours() === 0 && now.getMinutes() >= 20) {
    console.log('\nStopping monitor - passed 12:20 AM PST');
    clearInterval(interval);
    process.exit(0);
  }
  
  fetchEvents();
}, 60000); // Check every minute
