"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, GripVertical, ArrowUpDown, Clock } from "lucide-react"
import { shuffleArray } from "@/utils/shuffleArray"
import { toast } from "sonner"
import { Merriweather } from "next/font/google"
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
  triesLeft: number
  showError: boolean
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
    triesLeft: 3,
    showError: false
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
        loading: false,
        triesLeft: 3,
        showError: false,
        gameOver: false
      }))
    } catch (err) {
      setError("Failed to load events. Please try again later.")
      setGameState(prev => ({ ...prev, loading: false }))
    }
  }

  // Simple function to move an event up in the order
  const moveEventUp = (index: number) => {
    if (index <= 0) return // Already at the top
    
    const items = Array.from(gameState.events)
    const temp = items[index]
    items[index] = items[index - 1]
    items[index - 1] = temp
    
    setGameState(prev => ({
      ...prev,
      events: items
    }))
  }
  
  // Simple function to move an event down in the order
  const moveEventDown = (index: number) => {
    if (index >= gameState.events.length - 1) return // Already at the bottom
    
    const items = Array.from(gameState.events)
    const temp = items[index]
    items[index] = items[index + 1]
    items[index + 1] = temp
    
    setGameState(prev => ({
      ...prev,
      events: items
    }))
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
    e.dataTransfer.effectAllowed = 'move'
    // Add a class to the dragged element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('dragging')
    }
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
    
    if (dragIndex === dropIndex) return
    
    const items = Array.from(gameState.events)
    const [draggedItem] = items.splice(dragIndex, 1)
    items.splice(dropIndex, 0, draggedItem)
    
    setGameState(prev => ({
      ...prev,
      events: items
    }))
  }

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    // Remove the class from the dragged element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('dragging')
    }
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
      
      setGameState(prev => ({
        ...prev,
        result,
        gameOver: true,
        showError: false
      }))
    } else {
      // Decrement tries left
      const newTriesLeft = gameState.triesLeft - 1
      
      setGameState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        triesLeft: newTriesLeft,
        showError: true,
        gameOver: newTriesLeft <= 0,
        result: newTriesLeft <= 0 ? result : [],
      }))
    }
  }

  const getShareText = () => {
    // Get achievement emojis
    const achievementEmojis = [
      achievements.perfectScore ? "🎯" : "",
      achievements.speedSolve ? "⚡" : "",
      achievements.hardMode ? "💪" : "",
      achievements.firstTry ? "🎓" : ""
    ].filter(Boolean).join("")

    // Create result emojis (green/red squares for correct/incorrect)
    const resultEmojis = gameState.result.map(r => r ? "🟩" : "🟥").join("")
    
    // Create a social media friendly message that doesn't reveal answers
    return `⌛ I just played TimeLine - the historical events game!\n\n${resultEmojis} ${achievementEmojis}\n\nCan you beat my score? Play now at playtimeline.com!`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText())
    toast.success("Share text copied to clipboard!")
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
        <div className="mt-2 flex items-center justify-center">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            <Clock className="mr-1 h-3 w-3" /> Daily Challenge - {new Date().toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {gameState.gameOver ? (
          gameState.triesLeft > 0 ? (
            // User won the game
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Congratulations!
                </h2>
                <p className="text-gray-600 mb-4">
                  You've successfully arranged all events in chronological order.
                </p>
                <div className="mt-4 space-y-2">
                  {[...gameState.events].map((event) => (
                    <div key={event.id} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                      <p className="font-medium">{event.title} <span className="text-gray-500">({event.year})</span></p>
                    </div>
                  ))}
                </div>
              </div>
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
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Share your results:</h4>
                    <div className="bg-white p-3 rounded border text-sm mb-2">
                      {getShareText()}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={copyToClipboard} size="sm" variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={fetchEvents} variant="outline">
                      Play Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // User lost the game (out of tries)
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Game Over
                </h2>
                <p className="text-gray-600 mb-4">
                  You've used all your attempts. The correct order was:
                </p>
                <div className="mt-4 space-y-2">
                  {[...gameState.events].sort((a, b) => a.year - b.year).map((event) => (
                    <div key={event.id} className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-medium">{event.title} <span className="text-gray-500">({event.year})</span></p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Share your challenge:</h4>
                  <div className="bg-white p-3 rounded border text-sm mb-2">
                    ⌛ I'm playing TimeLine - the historical events game! Can you arrange historical events in the correct order? Try it at playtimeline.com!
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText("⌛ I'm playing TimeLine - the historical events game! Can you arrange historical events in the correct order? Try it at playtimeline.com!")
                        toast.success("Share text copied to clipboard!")
                      }} 
                      size="sm" 
                      variant="outline"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button onClick={fetchEvents}>Try Again</Button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {gameState.events.map((event, index) => (
                <div
                  key={event.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 flex items-center gap-3 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex flex-col mr-2">
                    <button 
                      onClick={() => moveEventUp(index)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Move up"
                      disabled={index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveEventDown(index)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Move down"
                      disabled={index === gameState.events.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-grow">
                    <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p className="font-medium">{event.title}</p>
                  </div>
                </div>
              ))}
            </div>
            {gameState.showError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
                <strong className="font-bold">Wrong - Try Again!</strong>
                <p className="block">You have {gameState.triesLeft} {gameState.triesLeft === 1 ? 'try' : 'tries'} left.</p>
              </div>
            )}
            <div className="flex justify-center">
              <Button 
                onClick={checkOrder} 
                className="w-full"
                disabled={gameState.triesLeft <= 0 || gameState.gameOver}
              >
                Check Order
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <div className="border-t border-gray-200 pt-4 pb-5 px-6 text-center">
        <p className="text-xs text-gray-500">
          Made by Kenan Sakarcan with ❤️ and ☕ in San Francisco for history buffs everywhere
        </p>
      </div>
    </Card>
  )
}

export default TimelineGame