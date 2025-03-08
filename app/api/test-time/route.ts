import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const now = new Date()
  now.setHours(now.getHours() - 8) // Convert to PST
  
  const cutoff = new Date(now)
  cutoff.setHours(0, 15, 0, 0) // 12:15 AM PST
  
  return NextResponse.json({
    current_time_pst: now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    cutoff_time_pst: cutoff.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    using_todays_events: now < cutoff
  })
}
