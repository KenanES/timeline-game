import { NextResponse } from 'next/server'
import { getDailyEvents } from '@/lib/dailyEvents'

export const runtime = 'edge'

export async function GET() {
  const events = getDailyEvents()
  return NextResponse.json(events)
}
