// This is a backup of the index.tsx file from March 5, 2025
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { shuffleArray } from "@/utils/shuffleArray"
import { toast } from "sonner"
import { Merriweather } from "next/font/google"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { cn } from "@/lib/utils"

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
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

interface GameState {
  events: Event[]
  attempts: number
  gameOver: boolean
  result: boolean[]
  startTime: number | null
  loading: boolean
}

const ResultDisplay = ({ achievements, result }: { achievements: Achievements; result: boolean[] }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-xl font-bold">Results</h3>
        <div className="flex space-x-1">
          {result.map((correct, index) => (
            <span key={index} className={`text-2xl ${correct ? "text-green-500" : "text-red-500"}`}>
              {correct ? "✅" : "❌"}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const TimelineGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    events: [],
    attempts: 0,
    gameOver: false,
    result: [],
    startTime: null,
    loading: true,
  })

  const [stats, setStats] = useState<Statistics>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestStreak: 0,
    currentStreak: 0,
  })

  const [achievements, setAchievements] = useState<Achievements>({
    perfectScore: false,
    speedSolve: false,
    hardMode: false,
    firstTry: false,
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json() as Event[]
      const shuffledEvents = shuffleArray(data)
      setGameState(prev => ({
        ...prev,
        events: shuffledEvents,
        loading: false
      }))
    } catch (err) {
      setError("Failed to load events. Please try again later.")
      setGameState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(gameState.events)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setGameState(prev => ({
      ...prev,
      events: items
    }))
  }

  const checkOrder = () => {
    const sortedEvents = [...gameState.events].sort((a, b) => a.year - b.year)
    const result = gameState.events.map((event, index) => event.id === sortedEvents[index].id)
    const allCorrect = result.every(r => r)

    if (allCorrect) {
      const achievements = {
        perfectScore: gameState.attempts === 0,
        speedSolve: Date.now() - (gameState.startTime || 0) < 30000,
        firstTry: gameState.attempts === 0,
        hardMode: false
      }

      setStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1)
      }))

      setAchievements(achievements)
      toast.success("Congratulations! You've arranged all events correctly!")
    } else {
      setGameState(prev => ({
        ...prev,
        attempts: prev.attempts + 1
      }))
      toast.error("Not quite right. Try again!")
    }

    setGameState(prev => ({
      ...prev,
      result,
      gameOver: allCorrect
    }))
  }

  const getShareText = () => {
    const achievementEmojis = [
      achievements.perfectScore ? "🎯" : "",
      achievements.speedSolve ? "⚡" : "",
      achievements.hardMode ? "💪" : "",
      achievements.firstTry ? "🎯" : ""
    ].filter(Boolean).join("")

    const resultEmojis = gameState.result.map(r => r ? "✅" : "❌").join("")
    return `Timeline Game ${achievementEmojis}\n${resultEmojis}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText())
    toast.success("Results copied to clipboard!")
  }

  if (error) {
    return (
      <Card className="w-full max-w-md p-6 text-center">
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchEvents} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState.loading) {
    return (
      <Card className="w-full max-w-md p-6 text-center">
        <CardContent>
          <p>Loading events...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full max-w-md bg-[#f8f8f8] text-[#2C3E50]", merriweather.className)}>
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">TimeLine</CardTitle>
        <p className="text-center text-sm text-stone-600">Arrange the events in order</p>
      </CardHeader>
      <CardContent>
        {gameState.gameOver ? (
          <div className="space-y-6">
            <ResultDisplay achievements={achievements} result={gameState.result} />
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Games Played</p>
                    <p className="font-bold">{stats.gamesPlayed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Win Rate</p>
                    <p className="font-bold">
                      {stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="font-bold">{stats.currentStreak}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Best Streak</p>
                    <p className="font-bold">{stats.bestStreak}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={fetchEvents} variant="outline">
                  Play Again
                </Button>
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="events">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {gameState.events.map((event, index) => (
                      <Draggable
                        key={event.id}
                        draggableId={String(event.id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                          >
                            <p className="font-medium">{event.title}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div className="flex justify-center">
              <Button onClick={checkOrder} className="w-full">
                Check Order
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TimelineGame
