import { NextResponse } from 'next/server'
import { getDailyEvents } from '@/lib/dailyEvents'

export const runtime = 'edge'

export async function GET() {
  try {
    const now = new Date()
    const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    const events = await getDailyEvents()
    
    return NextResponse.json({
      currentDate: pstDate.toISOString(),
      formattedDate: pstDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
      events
    })
  } catch (error) {
    console.error('Error fetching daily events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
