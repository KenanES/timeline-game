import { NextResponse } from "next/server"

const fallbackEvents = [
  { date: "1215-06-15", content: "Signing of the Magna Carta" },
  { date: "1453-05-29", content: "Fall of Constantinople" },
  { date: "1492-10-12", content: "Columbus reaches the Americas" },
  { date: "1595-01-01", content: "Shakespeare writes Romeo and Juliet" },
  { date: "1609-08-25", content: "Galileo demonstrates his first telescope" },
]

export async function GET() {
  console.log("API route handler started")
  try {
    const today = new Date().toISOString().split("T")[0]
    console.log(`Fetching events for date: ${today}`)

    const response = await fetch(`https://events.historylabs.io/date/${today}`)

    console.log(`HistoryLabs API response status: ${response.status}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`HistoryLabs API response data:`, JSON.stringify(data))

    if (!data.events || data.events.length === 0) {
      console.log(`No events found for date: ${today}, using fallback data`)
      return NextResponse.json({ events: fallbackEvents })
    }

    console.log(`Returning ${data.events.length} events from HistoryLabs API`)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching events from HistoryLabs API:`, error)
    console.log(`Using fallback data due to API error`)
    return NextResponse.json({ events: fallbackEvents })
  }
}

