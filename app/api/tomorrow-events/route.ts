import { NextResponse } from 'next/server'
import { HistoricalEvent, EVENTS_PER_DAY } from '@/lib/dailyEvents'

export const runtime = 'edge'

// API URL for fetching historical events
const API_URL = "https://api.api-ninjas.com/v1/historicalevents"
// API key for the API Ninjas service
const API_KEY = process.env.API_NINJAS_KEY || ""

// Fallback events in case the API fails
const fallbackEvents: HistoricalEvent[] = [
  { id: 1, title: "First Moon Landing", year: 1969 },
  { id: 2, title: "World Wide Web Invented", year: 1989 },
  { id: 3, title: "Discovery of DNA Structure", year: 1953 },
  { id: 4, title: "First iPhone Released", year: 2007 },
  { id: 5, title: "First Human Genome Sequenced", year: 2003 }
]

/**
 * Fetches historical events from the API for a specific date
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

export async function GET() {
  try {
    // Get tomorrow's date in PST
    const now = new Date()
    const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    const tomorrow = new Date(pstDate)
    tomorrow.setDate(pstDate.getDate() + 1)
    
    // Get month (1-12) and day (1-31) for API request
    const month = tomorrow.getMonth() + 1 // JavaScript months are 0-indexed
    const day = tomorrow.getDate()
    
    // Fetch events for tomorrow's date
    const events = await fetchHistoricalEvents(month, day)
    
    // Return tomorrow's date and events
    return NextResponse.json({
      date: tomorrow.toISOString().split('T')[0],
      events
    })
  } catch (error) {
    console.error('Error fetching tomorrow\'s events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
