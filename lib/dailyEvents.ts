// Define the event interface
export interface HistoricalEvent {
  id: number
  title: string
  year: number
}

// Fallback events in case the API fails
export const fallbackEvents: HistoricalEvent[] = [
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
]

export const EVENTS_PER_DAY = 5

// API URL for fetching historical events
const API_URL = "https://api.api-ninjas.com/v1/historicalevents"
// API key for the API Ninjas service
const API_KEY = process.env.API_NINJAS_KEY || ""

// Cache to store fetched events
let eventsCache: { [date: string]: HistoricalEvent[] } = {}

/**
 * Fetches historical events from the API or returns cached events
 * @param month Month (1-12)
 * @param day Day of month (1-31)
 * @returns Array of historical events
 */
async function fetchHistoricalEvents(month: number, day: number): Promise<HistoricalEvent[]> {
  try {
    // Format the month and day for the API
    const formattedMonth = month.toString().padStart(2, '0')
    const formattedDay = day.toString().padStart(2, '0')
    
    // Make the API request
    const response = await fetch(`${API_URL}?month=${formattedMonth}&day=${formattedDay}`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    // Parse the response
    const data = await response.json()
    
    // Transform the API response to our event format
    return data.map((event: any, index: number) => ({
      id: index + 1,
      title: event.event,
      year: parseInt(event.year, 10)
    })).slice(0, EVENTS_PER_DAY)
  } catch (error) {
    console.error('Error fetching historical events:', error)
    // Return fallback events if the API fails
    return fallbackEvents.slice(0, EVENTS_PER_DAY)
  }
}

/**
 * Gets daily events for the timeline game
 * @returns Array of historical events for today
 */
export async function getDailyEvents(): Promise<HistoricalEvent[]> {
  // Get current date in PST (UTC-8)
  const now = new Date()
  const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  
  // Get hours and minutes in PST for comparison
  const currentHours = pstDate.getHours()
  const currentMinutes = pstDate.getMinutes()
  
  // Create a date object for the seed (default to today)
  const seedDate = new Date(pstDate)
  
  // If current time is before 12:20 AM PST, use yesterday's date as seed
  if (currentHours === 0 && currentMinutes < 20) {
    seedDate.setDate(seedDate.getDate() - 1)
  }
  
  // Format the date as YYYY-MM-DD for cache key
  const dateString = seedDate.toISOString().split('T')[0]
  
  // Check if we have cached events for this date
  if (eventsCache[dateString]) {
    return eventsCache[dateString]
  }
  
  // Get month (1-12) and day (1-31) for API request
  const month = seedDate.getMonth() + 1 // JavaScript months are 0-indexed
  const day = seedDate.getDate()
  
  // Fetch events for this date
  const events = await fetchHistoricalEvents(month, day)
  
  // Cache the events
  eventsCache[dateString] = events
  
  return events
}
