import { NextResponse } from 'next/server'
import { getDailyEvents } from '@/lib/dailyEvents'

export const runtime = 'edge'

export async function GET() {
  const now = new Date()
  const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  const events = getDailyEvents()
  
  return NextResponse.json({
    currentDate: pstDate.toISOString(),
    formattedDate: pstDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    events
  })
}
