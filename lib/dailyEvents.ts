const allEvents = [
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
] as const

const EVENTS_PER_DAY = 5

export function getDailyEvents() {
  // Get current date in PST (UTC-8)
  const now = new Date()
  now.setHours(now.getHours() - 8)
  
  // Get cutoff time (12:20 AM PST)
  const cutoff = new Date(now)
  cutoff.setHours(0, 20, 0, 0) // Set to 12:20 AM
  
  // If current time is after cutoff, use tomorrow's date as seed
  const seedDate = new Date(now)
  if (now > cutoff) {
    seedDate.setDate(seedDate.getDate() + 1)
  }
  const dateString = seedDate.toISOString().split('T')[0]
  let seed = 0
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i)
    seed = seed & seed // Convert to 32-bit integer
  }

  // Use the seed to select today's events
  const shuffledEvents = [...allEvents]
  for (let i = shuffledEvents.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1)) % (i + 1))
    ;[shuffledEvents[i], shuffledEvents[j]] = [shuffledEvents[j], shuffledEvents[i]]
  }

  return shuffledEvents.slice(0, EVENTS_PER_DAY)
}
