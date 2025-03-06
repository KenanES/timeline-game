const allEvents = [
  // Technology & Computing
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
  { id: 15, title: "First Email Sent", year: 1971 },
  { id: 16, title: "Facebook Founded", year: 2004 },
  { id: 17, title: "YouTube Launched", year: 2005 },
  { id: 18, title: "Netflix Streaming Service", year: 2007 },
  { id: 19, title: "Bitcoin Created", year: 2009 },
  { id: 20, title: "First AI Defeats Chess Champion", year: 1997 },
  
  // Historical Events
  { id: 21, title: "Fall of Berlin Wall", year: 1989 },
  { id: 22, title: "Declaration of Independence", year: 1776 },
  { id: 23, title: "End of World War II", year: 1945 },
  { id: 24, title: "Titanic Sinks", year: 1912 },
  { id: 25, title: "Women's Right to Vote in US", year: 1920 },
  { id: 26, title: "Assassination of JFK", year: 1963 },
  { id: 27, title: "First Olympic Games", year: 1896 },
  { id: 28, title: "Signing of Magna Carta", year: 1215 },
  { id: 29, title: "Columbus Reaches Americas", year: 1492 },
  { id: 30, title: "French Revolution Begins", year: 1789 },
  
  // Arts & Culture
  { id: 31, title: "Mona Lisa Painted", year: 1503 },
  { id: 32, title: "First Harry Potter Book", year: 1997 },
  { id: 33, title: "Star Wars Released", year: 1977 },
  { id: 34, title: "Beatles First Album", year: 1963 },
  { id: 35, title: "Printing Press Invented", year: 1440 },
  { id: 36, title: "Shakespeare Writes Hamlet", year: 1600 },
  { id: 37, title: "First Photograph Taken", year: 1826 },
  { id: 38, title: "First Academy Awards", year: 1929 },
  { id: 39, title: "MTV Launches", year: 1981 },
  { id: 40, title: "First Feature-Length Animation", year: 1937 },
  
  // Science & Medicine
  { id: 41, title: "Theory of Evolution Published", year: 1859 },
  { id: 42, title: "First Vaccine Created", year: 1796 },
  { id: 43, title: "Periodic Table Created", year: 1869 },
  { id: 44, title: "Discovery of X-rays", year: 1895 },
  { id: 45, title: "First Successful Blood Transfusion", year: 1818 },
  { id: 46, title: "First Antibiotic Discovered", year: 1928 },
  { id: 47, title: "Structure of Atom Discovered", year: 1911 },
  { id: 48, title: "First Test Tube Baby", year: 1978 },
  { id: 49, title: "First Organ Transplant", year: 1954 },
  { id: 50, title: "COVID-19 Pandemic Begins", year: 2020 }
] as const

const EVENTS_PER_DAY = 5

export function getDailyEvents() {
  // Get current time in user's local timezone
  const now = new Date()
<<<<<<< Updated upstream
  now.setHours(now.getHours() - 8)
  
  // Get start of day
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  
  // Use the date as a seed for consistent daily selection
  const dateString = today.toISOString().split('T')[0]
=======
  
  // Get today's date at 12:01 AM in user's local timezone
  const todayAt1201 = new Date(now)
  todayAt1201.setHours(0, 1, 0, 0)
  
  // Get current time's hours and minutes for comparison
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  
  // Determine if we should use yesterday's or today's date as seed
  const seedDate = new Date(now)
  if (currentHours === 0 && currentMinutes < 1) {
    // If it's between 12:00 AM and 12:01 AM, use yesterday's date
    seedDate.setDate(seedDate.getDate() - 1)
  }
  const dateString = seedDate.toISOString().split('T')[0]
>>>>>>> Stashed changes
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
