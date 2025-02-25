import { NextResponse } from "next/server";

const FALLBACK_EVENTS = [
  { date: "1215-06-15", content: "Magna Carta Signed" },
  { date: "1453-05-29", content: "Fall of Constantinople" },
  { date: "1492-10-12", content: "Columbus Discovers America" },
  { date: "1595-01-01", content: "Romeo and Juliet Written" },
  { date: "1609-08-25", content: "Telescope Invented" },
];

export async function GET() {
  try {
    // Get today's date at 12:01 AM
    const now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split("T")[0];
    
    // Check if we need to update to the next day
    if (now.getHours() === 0 && now.getMinutes() >= 1) {
      const tomorrow = new Date(now.setDate(now.getDate() + 1));
      today = tomorrow.toISOString().split("T")[0];
    }
    console.log(`Fetching events for date: ${today}`);

    const res = await fetch(`https://events.historylabs.io/date/${today}`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });

    if (!res.ok) {
      console.error(`API responded with ${res.status}`);
      throw new Error(`API responded with ${res.status}`);
    }

    const data = await res.json();

    // Validate response data
    if (!data.events || !Array.isArray(data.events) || data.events.length < 5) {
      console.log(`Insufficient events from API, using fallback data`);
      return NextResponse.json({ events: FALLBACK_EVENTS });
    }

    // Process and validate each event
    const validEvents = data.events
      .filter(event => (
        event.date && 
        event.content && 
        typeof event.date === 'string' && 
        typeof event.content === 'string'
      ))
      .slice(0, 5);

    if (validEvents.length < 5) {
      console.log(`Not enough valid events from API, using fallback data`);
      return NextResponse.json({ events: FALLBACK_EVENTS });
    }

    return NextResponse.json({ events: validEvents });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      events: FALLBACK_EVENTS,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}

