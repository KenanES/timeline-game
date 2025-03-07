# Timeline Game API Integration

## Overview

The Timeline Game now integrates with the API Ninjas Historical Events API to provide fresh historical events for each day. This ensures that users get new events every day, enhancing the game experience.

## How It Works

1. The application fetches historical events that occurred on the current date in history.
2. Each day, users will see completely different events based on the current date.
3. The API returns events from various years that occurred on the same month and day.

## API Setup

To use the API integration:

1. Sign up for a free API key at [API Ninjas](https://api-ninjas.com/)
2. Create a `.env.local` file in the project root with the following content:
   ```
   API_NINJAS_KEY=your_api_key_here
   ```
3. Restart the development server or redeploy the application.

## Fallback Mechanism

If the API request fails for any reason, the application will fall back to a predefined set of events to ensure the game continues to function.

## Testing

You can test the API integration using the provided test script:

```bash
# Set your API key as an environment variable
export API_NINJAS_KEY=your_api_key_here

# Run the test script
node test-api-integration.mjs
```

## API Endpoints

The application provides the following API endpoints:

- `/api/events` - Returns today's historical events
- `/api/tomorrow-events` - Returns tomorrow's historical events
- `/api/check-events` - Returns today's date and events for debugging

## Implementation Details

- The events are cached in memory to reduce API calls.
- The application uses the America/Los_Angeles timezone (PST/PDT) to determine the current date.
- New events are fetched at 12:20 AM PST each day.

## Rate Limits

The free tier of API Ninjas has a rate limit of 50,000 requests per month. This should be more than sufficient for most use cases, as the application only needs to make one request per day.
