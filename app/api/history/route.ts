import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")

  if (!year) {
    return NextResponse.json({ error: "Year parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://events.historylabs.io/year/${year}?onlyDated=true`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.events || data.events.length === 0) {
      return NextResponse.json({ error: `No events found for year ${year}` }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching events for year ${year}:`, error)
    return NextResponse.json(
      {
        error: `Failed to fetch events for year ${year}: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      },
      { status: 500 },
    )
  }
}

