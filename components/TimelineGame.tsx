"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Share2, Bug } from "lucide-react"
import { shuffleArray } from "../utils/shuffleArray"
import { toast } from "@/components/ui/use-toast"
import { Merriweather } from "next/font/google"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

interface Event {
  id: number
  title: string
  year: number
}

interface Statistics {
  gamesPlayed: number
  gamesWon: number
  bestStreak: number
  currentStreak: number
}

interface Achievements {
  perfectScore: boolean
  speedSolve: boolean
  hardMode: boolean
  firstTry: boolean
}

const ResultDisplay = ({ achievements, result }: { achievements: Achievements; result: boolean[] }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg text-center space-y-2">
      <div className="flex justify-center space-x-2">
        {achievements.perfectScore && <span className="text-2xl">👑</span>}
        {achievements.speedSolve && <span className="text-2xl">⚡</span>}
        {achievements.hardMode && <span className="text-2xl">🔥</span>}
        {achievements.firstTry && <span className="text-2xl">🎯</span>}
      </div>
      {result.map((correct, index) => (
        <div key={index} className="flex justify-center">
          <span className="text-2xl">{correct ? "✅" : "❌"}</span>
        </div>
      ))}
    </div>
  )
}

const TimelineGame = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [stats, setStats] = useState<Statistics>({ gamesPlayed: 0, gamesWon: 0, bestStreak: 0, currentStreak: 0 })
  const [achievements, setAchievements] = useState<Achievements>({
    perfectScore: false,
    speedSolve: false,
    hardMode: false,
    firstTry: false,
  })
  const [startTime, setStartTime] = useState<number | null>(null)
  const [result, setResult] = useState<boolean[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    const storedStats = localStorage.getItem("timelineGameStats")
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    localStorage.setItem("timelineGameStats", JSON.stringify(stats))
  }, [stats])

  const fetchEvents = async (retries = 3) => {
    setError(null)
    setLoading(true)
    setDebugInfo("Fetching events started")
    try {
      const today = new Date().toISOString().split("T")[0]
      const cachedEvents = localStorage.getItem(`events_${today}`)

      if (cachedEvents) {
        setEvents(JSON.parse(cachedEvents))
        setStartTime(Date.now())
        setLoading(false)
        setDebugInfo((prevInfo) => prevInfo + "\nUsing cached events.")
        return
      }

      setDebugInfo((prevInfo) => prevInfo + "\nFetching from API...")
      const response = await fetch(`/api/history/date`)
      setDebugInfo((prevInfo) => prevInfo + `\nAPI response status: ${response.status}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setDebugInfo((prevInfo) => prevInfo + `\nParsed data: ${JSON.stringify(data, null, 2)}`)

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.events || !Array.isArray(data.events) || data.events.length < 5) {
        throw new Error(`Not enough events returned from API. Got ${data.events ? data.events.length : 0} events.`)
      }

      const fetchedEvents = data.events.slice(0, 5).map((event: any, index: number) => ({
        id: index,
        title: event.content,
        year: Number.parseInt(event.date.split("-")[0]),
      }))

      setEvents(shuffleArray(fetchedEvents))
      localStorage.setItem(`events_${today}`, JSON.stringify(fetchedEvents))
      setStartTime(Date.now())
      setDebugInfo((prevInfo) => prevInfo + `\nFetched and processed ${fetchedEvents.length} events.`)
    } catch (error) {
      console.error("Error in fetchEvents:", error)
      setDebugInfo((prevInfo) => prevInfo + `\nError in fetchEvents: ${error}`)
      if (retries > 0) {
        setDebugInfo((prevInfo) => prevInfo + `\nRetrying... (${retries} attempts left)`)
        await fetchEvents(retries - 1)
      } else {
        let errorMessage = "Failed to fetch events"
        if (error instanceof Error) {
          errorMessage += `: ${error.message}`
        } else if (typeof error === "object" && error !== null) {
          errorMessage += `: ${JSON.stringify(error)}`
        }
        setError(errorMessage)
        console.error(errorMessage)
        setDebugInfo((prevInfo) => prevInfo + `\nFalling back to mock data.`)
        const mockEvents: Event[] = [
          { id: 0, title: "Signing of the Magna Carta", year: 1215 },
          { id: 1, title: "Fall of Constantinople", year: 1453 },
          { id: 2, title: "Columbus reaches the Americas", year: 1492 },
          { id: 3, title: "Shakespeare writes Romeo and Juliet", year: 1595 },
          { id: 4, title: "Galileo invents the telescope", year: 1609 },
        ]
        setEvents(shuffleArray(mockEvents))
        setStartTime(Date.now())
      }
    } finally {
      setLoading(false)
    }
  }

  const resetGame = () => {
    fetchEvents()
    setAttempts(0)
    setGameOver(false)
    setAchievements({ perfectScore: false, speedSolve: false, hardMode: false, firstTry: false })
    setResult([])
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const newEvents = Array.from(events)
    const [reorderedEvent] = newEvents.splice(result.source.index, 1)
    newEvents.splice(result.destination.index, 0, reorderedEvent)

    setEvents(newEvents)
  }

  const checkOrder = () => {
    setAttempts(attempts + 1)
    const sortedEvents = [...events].sort((a, b) => a.year - b.year)
    const isCorrect = events.every((event, index) => event.id === sortedEvents[index].id)
    const newResult = events.map((event, index) => event.id === sortedEvents[index].id)
    setResult(newResult)

    if (isCorrect) {
      const endTime = Date.now()
      const timeTaken = (endTime - (startTime || 0)) / 1000 // in seconds

      const newAchievements: Achievements = {
        perfectScore: attempts === 0,
        speedSolve: timeTaken < 60, // Less than 1 minute
        hardMode: false, // Implement hard mode logic if needed
        firstTry: attempts === 0,
      }

      setAchievements(newAchievements)
      setStats((prevStats) => ({
        gamesPlayed: prevStats.gamesPlayed + 1,
        gamesWon: prevStats.gamesWon + 1,
        bestStreak: Math.max(prevStats.bestStreak, prevStats.currentStreak + 1),
        currentStreak: prevStats.currentStreak + 1,
      }))
      setGameOver(true)
    } else if (attempts + 1 >= 3) {
      setStats((prevStats) => ({
        ...prevStats,
        gamesPlayed: prevStats.gamesPlayed + 1,
        currentStreak: 0,
      }))
      setGameOver(true)
    }
  }

  const getShareText = () => {
    const achievementEmojis = [
      achievements.perfectScore ? "👑" : "",
      achievements.speedSolve ? "⚡" : "",
      achievements.hardMode ? "🔥" : "",
      achievements.firstTry ? "🎯" : "",
    ]
      .filter(Boolean)
      .join(" ")

    const resultEmojis = result.map((correct) => (correct ? "✅" : "❌")).join("")

    return `TimeLine Game ${achievementEmojis}\n${resultEmojis}\n${stats.currentStreak} 🔥`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText()).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "You can now paste your result anywhere!",
      })
    })
  }

  const shareResult = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My TimeLine Game Result",
          text: getShareText(),
        })
        .catch(console.error)
    } else {
      copyToClipboard()
    }
  }

  const toggleDebugMode = () => {
    setDebugMode(!debugMode)
  }

  const testAPICall = () => {
    fetchEvents()
  }

  return (
    <Card className={`w-full max-w-sm ${merriweather.variable}`}>
      <CardHeader>
        <CardTitle className="text-center font-serif">
          <h1 className="text-3xl sm:text-4xl font-bold">TimeLine</h1>
        </CardTitle>
        <p className="text-sm mt-1 text-center text-muted-foreground">Know history?</p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="events">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {events.map((event, index) => (
                    <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center space-x-2 border border-input p-2 rounded-md bg-background"
                        >
                          <span className="font-bold text-lg w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                            {index + 1}
                          </span>
                          <div className="flex-grow">
                            <span className="text-sm">{event.title}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <Button onClick={checkOrder} variant="default" size="sm" className="w-full mt-4" disabled={gameOver || loading}>
          Check Order
        </Button>
        <p className="text-center mt-2 text-sm text-muted-foreground">Attempts: {attempts}/3</p>
        {gameOver && (
          <div className="mt-4 text-center space-y-4">
            <h2 className="text-xl font-bold">{result.every(Boolean) ? "Congratulations!" : "Game Over"}</h2>
            <ResultDisplay achievements={achievements} result={result} />
            <div className="flex justify-center space-x-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareResult} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button onClick={resetGame} variant="default" size="sm" className="w-full">
              Play Again
            </Button>
          </div>
        )}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold mb-2">Statistics</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p>Games Played</p>
              <p className="font-bold">{stats.gamesPlayed}</p>
            </div>
            <div>
              <p>Win Rate</p>
              <p className="font-bold">
                {stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div>
              <p>Current Streak</p>
              <p className="font-bold">{stats.currentStreak}</p>
            </div>
            <div>
              <p>Best Streak</p>
              <p className="font-bold">{stats.bestStreak}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={toggleDebugMode} variant="outline" size="sm" className="w-full">
            <Bug className="h-4 w-4 mr-2" />
            {debugMode ? "Hide Debug Info" : "Show Debug Info"}
          </Button>
          {debugMode && (
            <div className="mt-2">
              <Button onClick={testAPICall} variant="outline" size="sm" className="w-full mb-2">
                Test API Call
              </Button>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">{debugInfo}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TimelineGame

