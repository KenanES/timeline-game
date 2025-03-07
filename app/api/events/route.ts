import { NextResponse } from 'next/server'
import { getDailyEvents } from '@/lib/dailyEvents'

export const runtime = 'edge'

export async function GET() {
  try {
    const events = await getDailyEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching daily events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
