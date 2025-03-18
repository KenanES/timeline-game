"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, GripVertical, ArrowUpDown, Clock, Trophy, Calendar, Share2 } from "lucide-react"
import { shuffleArray } from "@/utils/shuffleArray"
import { toast } from "sonner"
import { Merriweather } from "next/font/google"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
})

interface Event {
  id: number
  title: string
  year: number
  source?: string // Track where the event came from (curated, api, fallback)
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

// Countdown Timer Component
const CountdownTimer = ({ nextGameTime }: { nextGameTime: Date }) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = nextGameTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Time has passed, refresh the page to get the new puzzle
        window.location.reload();
        return;
      }
      
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ hours, minutes, seconds });
    };
    
    // Calculate immediately and then set up interval
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [nextGameTime]);
  
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center">
        <Calendar className="w-4 h-4 mr-1" /> Next puzzle in:
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-2 rounded-md shadow-sm">
          <span className="text-xl font-bold">{timeRemaining.hours.toString().padStart(2, '0')}</span>
          <p className="text-xs text-gray-500">hours</p>
        </div>
        <div className="bg-white p-2 rounded-md shadow-sm">
          <span className="text-xl font-bold">{timeRemaining.minutes.toString().padStart(2, '0')}</span>
          <p className="text-xs text-gray-500">mins</p>
        </div>
        <div className="bg-white p-2 rounded-md shadow-sm">
          <span className="text-xl font-bold">{timeRemaining.seconds.toString().padStart(2, '0')}</span>
          <p className="text-xs text-gray-500">secs</p>
        </div>
      </div>
    </div>
  );
};

// Streak Display Component
const StreakDisplay = ({ streak, bestStreak }: { streak: number; bestStreak: number }) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg shadow-sm">
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <span className="text-2xl mr-1">🔥</span>
          <span className="text-2xl font-bold">{streak}</span>
        </div>
        <p className="text-xs text-gray-700">Current Streak</p>
      </div>
      <div className="h-10 border-l border-amber-200"></div>
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 mr-1 text-amber-500" />
          <span className="text-2xl font-bold">{bestStreak}</span>
        </div>
        <p className="text-xs text-gray-700">Best Streak</p>
      </div>
    </div>
  );
};

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

// Interface for play history
interface PlayHistory {
  date: string;
  won: boolean;
  score: number;
}

// Interface for game progress
interface GameProgress {
  statistics: Statistics;
  achievements: Achievements;
  lastPlayed: string;
  playHistory: PlayHistory[];
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

  const [playHistory, setPlayHistory] = useState<PlayHistory[]>([])
  const [lastPlayed, setLastPlayed] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Load game progress from localStorage
  useEffect(() => {
    const loadGameProgress = () => {
      try {
        const savedProgress = localStorage.getItem('timelineGameProgress')
        
        if (savedProgress) {
          const parsedProgress: GameProgress = JSON.parse(savedProgress)
          
          setStats(parsedProgress.statistics)
          setAchievements(parsedProgress.achievements)
          setLastPlayed(parsedProgress.lastPlayed)
          setPlayHistory(parsedProgress.playHistory)
          
          // Check if player already played today
          const today = new Date().toISOString().split('T')[0]
          const alreadyPlayedToday = parsedProgress.lastPlayed === today
          
          if (alreadyPlayedToday) {
            // User already played today - could show a message or special UI
            console.log('Already played today!')
          }
        }
      } catch (err) {
        console.error('Error loading game progress:', err)
      }
    }
    
    loadGameProgress()
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    // Check if user has already played today
    const today = new Date().toISOString().split('T')[0]
    if (lastPlayed === today) {
      toast.error("You've already played today! Come back tomorrow for a new challenge.")
      return
    }
    
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json() as Event[]
      // Events are already properly formatted from the backend
      const shuffledEvents = shuffleArray(data)
      setGameState(prev => ({
        ...prev,
        events: shuffledEvents,
        loading: false,
        triesLeft: 3,
        showError: false,
        gameOver: false,
        startTime: Date.now(),
        attempts: 0,
        result: []
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

  // Save game progress to localStorage
  const saveGameProgress = (currentStats: Statistics, currentAchievements: Achievements, won: boolean) => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0]
      
      // Update play history
      const newPlayHistory = [...playHistory]
      newPlayHistory.push({
        date: today,
        won: won,
        score: gameState.triesLeft
      })
      setPlayHistory(newPlayHistory)
      setLastPlayed(today)
      
      // Create the game progress object
      const gameProgress: GameProgress = {
        statistics: currentStats,
        achievements: currentAchievements,
        lastPlayed: today,
        playHistory: newPlayHistory
      }
      
      // Save to localStorage
      localStorage.setItem('timelineGameProgress', JSON.stringify(gameProgress))
    } catch (err) {
      console.error('Error saving game progress:', err)
    }
  }

  const checkOrder = () => {
    const sortedEvents = [...gameState.events].sort((a, b) => a.year - b.year)
    const result = gameState.events.map((event, index) => event.id === sortedEvents[index].id)
    const allCorrect = result.every(r => r)

    if (allCorrect) {
      // Player won the game
      const newAchievements = {
        perfectScore: gameState.attempts === 0,
        speedSolve: Date.now() - (gameState.startTime || 0) < 30000,
        firstTry: gameState.attempts === 0,
        hardMode: false
      }

      const newStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        currentStreak: stats.currentStreak + 1,
        bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1)
      }

      setStats(newStats)
      setAchievements(newAchievements)
      
      setGameState(prev => ({
        ...prev,
        result,
        gameOver: true,
        showError: false
      }))
      
      // Save progress to localStorage
      saveGameProgress(newStats, newAchievements, true)
    } else {
      // Decrement tries left
      const newTriesLeft = gameState.triesLeft - 1
      const gameOver = newTriesLeft <= 0
      
      setGameState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        triesLeft: newTriesLeft,
        showError: true,
        gameOver: gameOver,
        result: gameOver ? result : [],
      }))
      
      // If game is over and player lost, update stats and save to localStorage
      if (gameOver) {
        const newStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon,
          currentStreak: 0, // Reset streak on loss
          bestStreak: stats.bestStreak
        }
        
        setStats(newStats)
        saveGameProgress(newStats, achievements, false)
      }
    }
  }

  // Calculate the next game time (12:20 AM PST tomorrow)
  const getNextGameTime = () => {
    const now = new Date();
    const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    
    // Set to next day at 12:20 AM PST
    const nextDay = new Date(pstDate);
    nextDay.setDate(pstDate.getDate() + 1);
    nextDay.setHours(0, 20, 0, 0);
    
    return nextDay;
  };
  
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
    
    // Add streak info if applicable
    const streakInfo = stats.currentStreak > 1 ? `\n🔥 Current Streak: ${stats.currentStreak}` : "";
    
    // Create a social media friendly message that doesn't reveal answers
    return `⌛ TimeLines Game - ${new Date().toLocaleDateString()}\n\n${resultEmojis} ${achievementEmojis}${streakInfo}\n\nCan you beat my score? Play now at playtimelines.com!`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText())
    toast.success("Share text copied to clipboard!")
  }
  
  // Add X (Twitter) widgets script
  useEffect(() => {
    // Only add the script if it doesn't already exist
    if (!document.getElementById('twitter-widgets-script')) {
      const script = document.createElement('script');
      script.id = 'twitter-widgets-script';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  
  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }
  
  const shareToFacebook = () => {
    const url = encodeURIComponent('https://playtimeline.com');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
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
    <Card className={cn("w-full max-w-md bg-[#f8f8f8] text-[#2C3E50] overflow-hidden mx-auto", merriweather.className)}>
      <CardHeader className="py-3 px-4 sm:py-6 sm:px-6">
        <CardTitle className="text-center text-2xl sm:text-3xl font-bold">TimeLines</CardTitle>
        <p className="text-center text-xs sm:text-sm text-stone-600">Arrange the events in order</p>
        <div className="mt-1 sm:mt-2 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs">
            <Clock className="mr-1 h-3 w-3" /> {new Date().toLocaleDateString()}
          </Badge>
          {stats.currentStreak > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs">
              🔥 {stats.currentStreak}
            </Badge>
          )}
        </div>
        {stats.currentStreak > 2 && (
          <div className="mt-1 sm:mt-2">
            <StreakDisplay streak={stats.currentStreak} bestStreak={stats.bestStreak} />
          </div>
        )}
      </CardHeader>
      <CardContent className="py-2 px-3 sm:py-4 sm:px-6">
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
                      <p className="font-medium text-sm">
                        {event.title}
                        <span className="text-gray-500"> ({event.year})</span>
                      </p>
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
                {/* Countdown Timer */}
                <CountdownTimer nextGameTime={getNextGameTime()} />
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Share your results:</h4>
                    <div className="bg-white p-3 rounded border text-sm mb-3 overflow-x-auto mobile-scroll">
                      {getShareText()}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex space-x-2">
                        <a 
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`}
                          className="twitter-share-button"
                          data-size="large"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            shareToTwitter();
                          }}
                        >
                          <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            Share on X
                          </Button>
                        </a>
                        <Button onClick={shareToFacebook} size="sm" variant="outline" className="bg-indigo-50 hover:bg-indigo-100">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          Share
                        </Button>
                      </div>
                      <Button onClick={copyToClipboard} size="sm" variant="outline" className="touch-target w-full sm:w-auto justify-center">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      onClick={fetchEvents} 
                      variant="outline"
                      className="touch-target py-2 px-6"
                      disabled={lastPlayed === new Date().toISOString().split('T')[0]}
                    >
                      {lastPlayed === new Date().toISOString().split('T')[0] ? 'Come back tomorrow!' : 'Play Again'}
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
                      <p className="font-medium text-sm">
                        {event.title}
                        <span className="text-gray-500"> ({event.year})</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 mt-6">
                {/* Countdown Timer */}
                <CountdownTimer nextGameTime={getNextGameTime()} />
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Share your challenge:</h4>
                  <div className="bg-white p-3 rounded border text-sm mb-3 overflow-x-auto mobile-scroll">
                    ⌛ I'm playing TimeLines - the historical events game! Can you arrange historical events in the correct order? Try it at playtimelines.com!
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex space-x-2">
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("⌛ I'm playing TimeLines - the historical events game! Can you arrange historical events in the correct order? Try it at playtimelines.com!")}`}
                        className="twitter-share-button"
                        data-size="large"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent("⌛ I'm playing TimeLines - the historical events game! Can you arrange historical events in the correct order? Try it at playtimelines.com!"), '_blank');
                        }}
                      >
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-blue-50 hover:bg-blue-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          Share on X
                        </Button>
                      </a>
                      <Button 
                        onClick={() => {
                          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://playtimeline.com'), '_blank');
                        }}
                        size="sm" 
                        variant="outline"
                        className="bg-indigo-50 hover:bg-indigo-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        Share
                      </Button>
                    </div>
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText("⌛ I'm playing TimeLines - the historical events game! Can you arrange historical events in the correct order? Try it at playtimelines.com!")
                        toast.success("Share text copied to clipboard!")
                      }} 
                      size="sm" 
                      variant="outline"
                      className="touch-target w-full sm:w-auto justify-center"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={fetchEvents}
                    disabled={lastPlayed === new Date().toISOString().split('T')[0]}
                    className="touch-target py-2 px-6"
                  >
                    {lastPlayed === new Date().toISOString().split('T')[0] ? 'Come back tomorrow!' : 'Try Again'}
                  </Button>
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
                  className="rounded-lg bg-white p-2 sm:p-4 shadow-sm transition-colors hover:bg-gray-50 flex items-center gap-2 cursor-grab active:cursor-grabbing touch-target mb-2"
                >
                  <div className="flex flex-col mr-1 sm:mr-2">
                    <button 
                      onClick={() => moveEventUp(index)}
                      className="text-gray-400 hover:text-gray-600 p-1 sm:p-1.5 touch-target"
                      aria-label="Move up"
                      disabled={index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveEventDown(index)}
                      className="text-gray-400 hover:text-gray-600 p-1 sm:p-1.5 touch-target"
                      aria-label="Move down"
                      disabled={index === gameState.events.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-grow">
                    <GripVertical className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                    <div className="overflow-hidden w-full">
                      <p className="font-medium text-sm sm:text-base leading-tight sm:leading-snug">
                        {event.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {gameState.showError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-2 sm:mb-4 text-center text-xs sm:text-sm">
                <strong className="font-bold">Wrong - Try Again!</strong>
                <p className="block">You have {gameState.triesLeft} {gameState.triesLeft === 1 ? 'try' : 'tries'} left.</p>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <Button 
                onClick={checkOrder}
                className="w-full text-sm py-2 h-auto sm:h-10 touch-target"
                disabled={gameState.triesLeft <= 0 || gameState.gameOver}
              >
                Check Order
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <div className="border-t border-gray-200 pt-2 pb-3 px-4 sm:pt-4 sm:pb-5 sm:px-6 text-center">
        <p className="text-[10px] sm:text-xs text-gray-500">
          Made by Kenan Sakarcan with ❤️ and ☕ in San Francisco for history buffs everywhere
        </p>
      </div>
    </Card>
  )
}

export default TimelineGame