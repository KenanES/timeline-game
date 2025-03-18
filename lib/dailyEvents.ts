// Define the event interface
export interface HistoricalEvent {
  id: number
  title: string
  year: number
  source?: string // Track where the event came from (curated, api, fallback)
}

// Import curated events from separate file
import { allCuratedEvents, getRandomCuratedEvents } from './curatedEvents';

// Legacy curated events - kept for backward compatibility
const legacyCuratedEvents: HistoricalEvent[] = [
  // Ancient History
  { id: 1, title: "The Great Pyramid of Giza is completed.", year: -2560, source: "curated" },
  { id: 2, title: "Alexander the Great conquers the Persian Empire.", year: -330, source: "curated" },
  { id: 3, title: "Julius Caesar is assassinated in the Roman Senate.", year: -44, source: "curated" },
  { id: 4, title: "Constantine founds the city of Constantinople.", year: 330, source: "curated" },
  { id: 5, title: "The Western Roman Empire falls to Germanic invaders.", year: 476, source: "curated" },
  
  // Middle Ages
  { id: 6, title: "Charlemagne is crowned Emperor of the Romans.", year: 800, source: "curated" },
  { id: 7, title: "William the Conqueror wins the Battle of Hastings.", year: 1066, source: "curated" },
  { id: 8, title: "King John of England signs the Magna Carta.", year: 1215, source: "curated" },
  { id: 9, title: "The Black Death pandemic begins to spread across Europe.", year: 1347, source: "curated" },
  { id: 10, title: "Constantinople falls to the Ottoman Empire.", year: 1453, source: "curated" },
  
  // Renaissance & Early Modern
  { id: 11, title: "Christopher Columbus reaches the Americas.", year: 1492, source: "curated" },
  { id: 12, title: "Johannes Gutenberg prints the first Bible using movable type.", year: 1455, source: "curated" },
  { id: 13, title: "William Shakespeare writes the tragedy of Hamlet.", year: 1600, source: "curated" },
  { id: 14, title: "Isaac Newton publishes his laws of motion and universal gravitation.", year: 1687, source: "curated" },
  { id: 15, title: "The United States Declaration of Independence is adopted.", year: 1776, source: "curated" },
  
  // 19th Century
  { id: 16, title: "Napoleon is defeated at the Battle of Waterloo.", year: 1815, source: "curated" },
  { id: 17, title: "Joseph Nicéphore Niépce takes the first permanent photograph.", year: 1826, source: "curated" },
  { id: 18, title: "Charles Darwin publishes On the Origin of Species.", year: 1859, source: "curated" },
  { id: 19, title: "The First Transcontinental Railroad is completed in the United States.", year: 1869, source: "curated" },
  { id: 20, title: "Thomas Edison demonstrates the first practical electric light bulb.", year: 1879, source: "curated" },
  
  // 20th Century
  { id: 21, title: "The Wright Brothers achieve the first powered flight.", year: 1903, source: "curated" },
  { id: 22, title: "The RMS Titanic sinks on its maiden voyage.", year: 1912, source: "curated" },
  { id: 23, title: "World War I ends with the signing of the Armistice.", year: 1918, source: "curated" },
  { id: 24, title: "The BBC conducts the first public television broadcast.", year: 1927, source: "curated" },
  { id: 25, title: "World War II ends with the surrender of Japan.", year: 1945, source: "curated" },
  { id: 26, title: "Neil Armstrong becomes the first human to walk on the Moon.", year: 1969, source: "curated" },
  { id: 27, title: "The Berlin Wall falls, symbolizing the end of the Cold War.", year: 1989, source: "curated" },
  { id: 28, title: "Tim Berners-Lee invents the World Wide Web.", year: 1989, source: "curated" },
  
  // 21st Century
  { id: 29, title: "The Human Genome Project is completed, mapping the human DNA sequence.", year: 2003, source: "curated" },
  { id: 30, title: "Apple releases the first iPhone, revolutionizing mobile technology.", year: 2007, source: "curated" },
  { id: 31, title: "The COVID-19 pandemic spreads globally, causing worldwide lockdowns.", year: 2020, source: "curated" },
  
  // Additional curated events
  { id: 32, title: "The printing press is invented by Johannes Gutenberg.", year: 1440, source: "curated" },
  { id: 33, title: "Leonardo da Vinci paints the Mona Lisa.", year: 1503, source: "curated" },
  { id: 34, title: "Martin Luther posts his 95 Theses, sparking the Protestant Reformation.", year: 1517, source: "curated" },
  { id: 35, title: "Galileo Galilei observes the moons of Jupiter.", year: 1610, source: "curated" },
  { id: 36, title: "The French Revolution begins with the storming of the Bastille.", year: 1789, source: "curated" },
  { id: 37, title: "The first successful vaccine for smallpox is developed by Edward Jenner.", year: 1796, source: "curated" },
  { id: 38, title: "Abraham Lincoln issues the Emancipation Proclamation.", year: 1863, source: "curated" },
  { id: 39, title: "Albert Einstein publishes his theory of general relativity.", year: 1915, source: "curated" },
  { id: 40, title: "Mahatma Gandhi leads the Salt March in India.", year: 1930, source: "curated" },
  { id: 41, title: "The United Nations is founded after World War II.", year: 1945, source: "curated" },
  { id: 42, title: "The structure of DNA is discovered by Watson and Crick.", year: 1953, source: "curated" },
  { id: 43, title: "The Soviet Union launches Sputnik, the first artificial satellite.", year: 1957, source: "curated" },
  { id: 44, title: "Martin Luther King Jr. delivers his 'I Have a Dream' speech.", year: 1963, source: "curated" },
  { id: 45, title: "The Chernobyl nuclear disaster occurs in the Soviet Union.", year: 1986, source: "curated" },
  { id: 46, title: "Nelson Mandela is elected President of South Africa.", year: 1994, source: "curated" },
  { id: 47, title: "The Euro currency is introduced in the European Union.", year: 1999, source: "curated" },
  { id: 48, title: "Facebook is launched, beginning the social media revolution.", year: 2004, source: "curated" },
  { id: 49, title: "Barack Obama becomes the first African American U.S. President.", year: 2009, source: "curated" },
  { id: 50, title: "The Paris Agreement on climate change is adopted.", year: 2015, source: "curated" },
  
  // Additional Ancient History
  { id: 51, title: "The Code of Hammurabi, one of the earliest legal codes, is created in Babylon.", year: -1754, source: "curated" },
  { id: 52, title: "The Battle of Marathon is won by the Athenians against the Persians.", year: -490, source: "curated" },
  { id: 53, title: "The Parthenon is completed in Athens, Greece.", year: -432, source: "curated" },
  { id: 54, title: "The Library of Alexandria is established in Egypt.", year: -283, source: "curated" },
  { id: 55, title: "The Great Wall of China begins construction under Emperor Qin Shi Huang.", year: -220, source: "curated" },
  { id: 56, title: "The Roman Republic is established after the overthrow of the monarchy.", year: -509, source: "curated" },
  { id: 57, title: "The Punic Wars begin between Rome and Carthage.", year: -264, source: "curated" },
  { id: 58, title: "Buddhism spreads to China along the Silk Road.", year: 68, source: "curated" },
  { id: 59, title: "The Colosseum is completed in Rome.", year: 80, source: "curated" },
  { id: 60, title: "Christianity becomes the official religion of the Roman Empire.", year: 380, source: "curated" },
  
  // Additional Medieval History
  { id: 61, title: "The Islamic prophet Muhammad begins receiving revelations.", year: 610, source: "curated" },
  { id: 62, title: "The Viking Age begins with the raid on Lindisfarne in England.", year: 793, source: "curated" },
  { id: 63, title: "The First Crusade is launched to recapture the Holy Land.", year: 1095, source: "curated" },
  { id: 64, title: "Genghis Khan unites the Mongol tribes and begins conquests.", year: 1206, source: "curated" },
  { id: 65, title: "The Magna Carta is signed by King John of England.", year: 1215, source: "curated" },
  { id: 66, title: "Marco Polo begins his journey to China.", year: 1271, source: "curated" },
  { id: 67, title: "The Hundred Years' War begins between England and France.", year: 1337, source: "curated" },
  { id: 68, title: "The Black Death pandemic reaches Europe, killing millions.", year: 1347, source: "curated" },
  { id: 69, title: "Joan of Arc leads French forces to victory at Orléans.", year: 1429, source: "curated" },
  { id: 70, title: "The Byzantine Empire falls with the Ottoman conquest of Constantinople.", year: 1453, source: "curated" },
  
  // Additional Renaissance & Early Modern
  { id: 71, title: "Leonardo da Vinci begins painting the Last Supper.", year: 1495, source: "curated" },
  { id: 72, title: "Michelangelo completes the ceiling of the Sistine Chapel.", year: 1512, source: "curated" },
  { id: 73, title: "Ferdinand Magellan's expedition completes the first circumnavigation of the Earth.", year: 1522, source: "curated" },
  { id: 74, title: "The Church of England breaks away from the Roman Catholic Church.", year: 1534, source: "curated" },
  { id: 75, title: "Galileo Galilei publishes his support for the Copernican heliocentric model.", year: 1632, source: "curated" },
  { id: 76, title: "The Peace of Westphalia ends the Thirty Years' War in Europe.", year: 1648, source: "curated" },
  { id: 77, title: "The Great Fire of London destroys much of the city's medieval center.", year: 1666, source: "curated" },
  { id: 78, title: "The Scientific Revolution begins to transform European thought.", year: 1687, source: "curated" },
  { id: 79, title: "The American Revolutionary War begins with the Battles of Lexington and Concord.", year: 1775, source: "curated" },
  { id: 80, title: "The French Revolution begins with the storming of the Bastille.", year: 1789, source: "curated" },
  
  // Additional 19th Century
  { id: 81, title: "The Louisiana Purchase doubles the size of the United States.", year: 1803, source: "curated" },
  { id: 82, title: "The Congress of Vienna redraws the map of Europe after the Napoleonic Wars.", year: 1815, source: "curated" },
  { id: 83, title: "The first steam locomotive railway opens in England.", year: 1825, source: "curated" },
  { id: 84, title: "The Great Famine begins in Ireland, causing mass emigration.", year: 1845, source: "curated" },
  { id: 85, title: "Karl Marx and Friedrich Engels publish The Communist Manifesto.", year: 1848, source: "curated" },
  { id: 86, title: "The American Civil War begins with the Battle of Fort Sumter.", year: 1861, source: "curated" },
  { id: 87, title: "Alexander Graham Bell patents the telephone.", year: 1876, source: "curated" },
  { id: 88, title: "The Berlin Conference begins the 'Scramble for Africa' by European powers.", year: 1884, source: "curated" },
  { id: 89, title: "The Eiffel Tower is completed in Paris for the World's Fair.", year: 1889, source: "curated" },
  { id: 90, title: "Marie Curie discovers radium and polonium, pioneering the field of radioactivity.", year: 1898, source: "curated" },
  
  // Additional 20th Century
  { id: 91, title: "Albert Einstein publishes his Special Theory of Relativity.", year: 1905, source: "curated" },
  { id: 92, title: "World War I begins with the assassination of Archduke Franz Ferdinand.", year: 1914, source: "curated" },
  { id: 93, title: "The Russian Revolution overthrows the Tsarist regime.", year: 1917, source: "curated" },
  { id: 94, title: "The Great Depression begins with the stock market crash on Black Tuesday.", year: 1929, source: "curated" },
  { id: 95, title: "World War II begins with Germany's invasion of Poland.", year: 1939, source: "curated" },
  { id: 96, title: "The United Nations is established after World War II.", year: 1945, source: "curated" },
  { id: 97, title: "India gains independence from British colonial rule.", year: 1947, source: "curated" },
  { id: 98, title: "The Cuban Missile Crisis brings the world to the brink of nuclear war.", year: 1962, source: "curated" },
  { id: 99, title: "The Vietnam War ends with the fall of Saigon.", year: 1975, source: "curated" },
  { id: 100, title: "The Soviet Union dissolves, ending the Cold War era.", year: 1991, source: "curated" }
]

// Use our expanded collection as the primary source of events
export const curatedEvents = allCuratedEvents;

// Fallback events in case the API fails - includes events from various historical periods with concise titles
export const fallbackEvents: HistoricalEvent[] = allCuratedEvents.slice(0, 100).map((event, index) => ({
  ...event,
  id: 1000 + index,
  source: "fallback"
}))

export const EVENTS_PER_DAY = 5


// API URL for fetching historical events
const API_URL = "https://api.api-ninjas.com/v1/historicalevents"
// API key for the API Ninjas service
const API_KEY = process.env.API_NINJAS_KEY || ""

// Cache to store fetched events
let eventsCache: { [date: string]: HistoricalEvent[] } = {}

/**
 * Fetches historical events from the API or returns cached events
 * @param month Month (1-12)
 * @param day Day of month (1-31)
 * @returns Array of historical events
 */
async function fetchHistoricalEvents(month: number, day: number): Promise<HistoricalEvent[]> {
  // Check if API key is available
  if (!API_KEY) {
    console.warn('API_NINJAS_KEY is not set. Using curated events.')
    return curatedEvents.slice(0, EVENTS_PER_DAY)
  }
  
  try {
    // Format the month and day for the API
    const formattedMonth = month.toString().padStart(2, '0')
    const formattedDay = day.toString().padStart(2, '0')
    
    // Make the API request
    const response = await fetch(`${API_URL}?month=${formattedMonth}&day=${formattedDay}`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    // Parse the response
    const data = await response.json()
    
    // Check if we got any events
    if (!data || data.length === 0) {
      console.warn('API returned no events. Using fallback events.')
      return fallbackEvents.slice(0, EVENTS_PER_DAY)
    }
    
    // Function to intelligently extract complete events
    const extractCompleteEvent = (title: string): { title: string, score: number, isComplete: boolean } => {
      // If title is already short enough, return it with a high score
      if (title.length <= 40) {
        return { title, score: 100, isComplete: true };
      }
      
      // Extract the main event by removing unnecessary details
      // Common patterns in historical events
      const patterns = [
        // Remove phrases like "On this day in history"
        /^On this day(,)? /i,
        /^On this date(,)? /i,
        /^In history(,)? /i,
        /^Today in \d+, /i,
        /^Today, /i,
        /^On March \d+(st|nd|rd|th)?, /i,
        /^March \d+(st|nd|rd|th)?, /i,
        
        // Remove redundant date information that's already shown in the year
        /\b(on|in) (January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?(,)?\s+/i,
        /\b(on|in) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{1,2}(st|nd|rd|th)?(,)?\s+/i,
        
        // Remove redundant phrases
        /,\s+on this day/i,
        /,\s+on this date/i,
        / on this day in history/i
      ];
      
      let cleanedTitle = title;
      patterns.forEach(pattern => {
        cleanedTitle = cleanedTitle.replace(pattern, '');
      });
      
      // If cleaning patterns made it short enough, return it with a good score
      if (cleanedTitle.length <= 40) {
        return { title: cleanedTitle, score: 90, isComplete: true };
      }
      
      // Define complete event patterns - these are common historical event structures
      const completeEventPatterns = [
        // "[Person] [does something]" pattern
        /^([A-Z][a-z]+(\s[A-Z][a-z]+)?(\s[A-Z]\.)?)(\s[A-Z][a-z]+)?(\s[A-Z][a-z]+)? (is|was|becomes|became|signs|signed|defeats|defeated|discovers|discovered|invents|invented|publishes|published|dies|died|wins|won|takes|took|makes|made|creates|created|founds|founded|establishes|established|begins|began|ends|ended|completes|completed)/i,
        
        // "The [something] is/was [action]" pattern
        /^The ([a-z]+\s)+(is|was|begins|began|ends|ended)/i,
        
        // "[Event name]" pattern (e.g., "Battle of Waterloo")
        /^(Battle of|Treaty of|Siege of|Fall of|Founding of|Discovery of|Invention of|Publication of|Creation of|Establishment of|Beginning of|End of|Completion of|Birth of|Death of|Coronation of|Election of|Assassination of|Execution of|Abdication of|Accession of)/i
      ];
      
      // Check if the cleaned title matches any complete event pattern
      const isStructurallyComplete = completeEventPatterns.some(pattern => pattern.test(cleanedTitle));
      
      // Find natural breaking points
      const breakPoints = [
        { pattern: /\. /, importance: 10 },  // End of sentence
        { pattern: /: /, importance: 9 },   // Colon
        { pattern: /; /, importance: 8 },   // Semicolon
        { pattern: / - /, importance: 7 },  // Dash
        { pattern: /, /, importance: 6 }    // Comma
      ];
      
      // Find all potential breaking points
      let potentialBreaks = [];
      breakPoints.forEach(breaker => {
        let match;
        const regex = new RegExp(breaker.pattern, 'g');
        while ((match = regex.exec(cleanedTitle)) !== null) {
          potentialBreaks.push({
            index: match.index,
            importance: breaker.importance,
            text: match[0]
          });
        }
      });
      
      // Sort breaks by position
      potentialBreaks.sort((a, b) => a.index - b.index);
      
      // Find the best breaking point that gives a complete thought
      for (const breakPoint of potentialBreaks) {
        // Only consider breaks that result in a reasonable length
        if (breakPoint.index >= 25 && breakPoint.index <= 60) {
          // Extract the clause up to this breaking point
          const clause = cleanedTitle.substring(0, breakPoint.index + (breakPoint.text ? breakPoint.text.length : 0));
          
          // Check if this looks like a complete thought
          const hasSubject = /\b(the|a|an|this|these|those|he|she|it|they|we|I|you|[A-Z][a-z]+)\b/i.test(clause);
          const hasVerb = /\b(is|are|was|were|has|had|have|do|does|did|make|made|take|took|go|went|come|came|become|became|begin|began|end|ended|\w+ed|\w+ing)\b/i.test(clause);
          
          if (hasSubject && hasVerb) {
            // This looks like a complete thought - calculate a score based on length and importance
            const lengthScore = Math.max(0, 40 - Math.abs(40 - clause.length)) / 2; // Prefer lengths close to 40
            const importanceScore = breakPoint.importance * 5;
            const completenessScore = 30; // Bonus for having subject and verb
            
            return { 
              title: clause, 
              score: lengthScore + importanceScore + completenessScore,
              isComplete: true
            };
          }
        }
      }
      
      // If we couldn't find a good breaking point with a complete thought,
      // try to at least break at a word boundary around 40 characters
      if (cleanedTitle.length > 40) {
        const words = cleanedTitle.split(' ');
        let result = '';
        for (const word of words) {
          if ((result + ' ' + word).length > 40) break;
          result += (result ? ' ' : '') + word;
        }
        
        // Only use this if it's a reasonable length and looks like a complete thought
        if (result.length >= 25 && isStructurallyComplete) {
          return { title: result, score: 40, isComplete: true }; 
        } else if (result.length >= 25) {
          return { title: result, score: 30, isComplete: false }; // Not a complete thought
        }
      }
      
      // Last resort: just take the first 40 characters and ensure we don't break a word
      const lastSpace = cleanedTitle.substring(0, 40).lastIndexOf(' ');
      if (lastSpace > 25) {
        return { 
          title: cleanedTitle.substring(0, lastSpace), 
          score: 20, 
          isComplete: isStructurallyComplete 
        };
      }
      
      // If all else fails, just return the first 40 characters
      return { 
        title: cleanedTitle.substring(0, Math.min(40, cleanedTitle.length)), 
        score: 10, 
        isComplete: false 
      };
    };
    
    // Request more events than we need to have a larger pool to select from
    const EVENTS_TO_REQUEST = Math.min(data.length, EVENTS_PER_DAY * 5);
    
    // First, transform and score all events
    const transformedEvents = data.slice(0, EVENTS_TO_REQUEST).map((event: any, index: number) => {
      const { title, score, isComplete } = extractCompleteEvent(event.event);
      return {
        id: index + 1,
        title,
        year: parseInt(event.year, 10),
        originalEvent: event.event,
        score,
        isComplete
      };
    });
    
    // Apply strict filtering criteria for event titles
    const validEvents = transformedEvents.filter(event => {
      // Length requirements
      if (event.title.length < 20 || event.title.length > 70) return false;
      
      // Must not end with ellipsis or be truncated
      if (event.title.endsWith('...') || event.title.endsWith('…')) return false;
      
      // Must end with proper punctuation
      if (!event.title.match(/[.!?]$/)) return false;
      
      // Must be a complete sentence with subject and verb
      const hasSubject = /\b(the|a|an|this|these|those|he|she|it|they|we|I|you|[A-Z][a-z]+)\b/i.test(event.title);
      const hasVerb = /\b(is|are|was|were|has|had|have|do|does|did|make|made|take|took|go|went|come|came|become|became|begin|began|end|ended|\w+ed|\w+ing)\b/i.test(event.title);
      
      return hasSubject && hasVerb;
    });
    
    // First priority: complete events with high scores
    const completeEvents = validEvents.filter(event => event.isComplete);
    
    if (completeEvents.length >= EVENTS_PER_DAY) {
      // Sort by score (higher is better)
      completeEvents.sort((a, b) => b.score - a.score);
      
      // Take the highest scoring complete events
      return completeEvents.slice(0, EVENTS_PER_DAY).map(({ id, title, year }) => ({
        id, title, year
      }));
    }
    
    // If we don't have enough complete events, use the best available events
    validEvents.sort((a, b) => {
      // Prioritize complete events, then by score
      if (a.isComplete && !b.isComplete) return -1;
      if (!a.isComplete && b.isComplete) return 1;
      return b.score - a.score;
    });
    
    // Take the best available events
    return validEvents.slice(0, EVENTS_PER_DAY).map(({ id, title, year }) => ({
      id, title, year, source: 'api'
    }))
  } catch (error) {
    console.error('Error fetching historical events:', error)
    // Return fallback events if the API fails
    return fallbackEvents.slice(0, EVENTS_PER_DAY)
  }
}

/**
 * Helper function to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Get a selection of random curated events with proper distribution across time periods
 * This function calls the imported getRandomCuratedEvents from curatedEvents.ts
 */
function getRandomEventsForDay(seed: number, count: number): HistoricalEvent[] {
  // Use the imported function from curatedEvents.ts
  // Note: The imported function takes parameters in a different order (count, seed)
  return getRandomCuratedEvents(count, seed);
}

/**
 * Gets daily events for the timeline game
 * @returns Array of historical events for today
 */
export async function getDailyEvents(): Promise<HistoricalEvent[]> {
  // Get current date in PST (UTC-8)
  const now = new Date()
  const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  
  // Get hours and minutes in PST for comparison
  const currentHours = pstDate.getHours()
  const currentMinutes = pstDate.getMinutes()
  
  // Create a date object for the seed (default to today)
  const seedDate = new Date(pstDate)
  
  // If current time is before 12:20 AM PST, use yesterday's date as seed
  if (currentHours === 0 && currentMinutes < 20) {
    seedDate.setDate(seedDate.getDate() - 1)
  }
  
  // Format the date as YYYY-MM-DD for cache key
  const dateString = seedDate.toISOString().split('T')[0]
  
  // Check if we have cached events for this date
  if (eventsCache[dateString]) {
    return eventsCache[dateString]
  }
  
  // Use the date as a seed for selecting events
  const dateNum = parseInt(dateString.replace(/-/g, ''), 10)
  
  // Determine if we should use curated events only (80% chance)
  const useCuratedOnly = Math.random() < 0.8
  
  let events: HistoricalEvent[] = []
  
  if (useCuratedOnly) {
    // Use only curated events
    events = getRandomCuratedEvents(dateNum, EVENTS_PER_DAY)
  } else {
    try {
      // Get month (1-12) and day (1-31) for API request
      const month = seedDate.getMonth() + 1 // JavaScript months are 0-indexed
      const day = seedDate.getDate()
      
      // With our expanded collection, we'll prioritize curated events (80%) and supplement with API events (20%)
      // This ensures we have enough unique events for a full year
      
      // Generate a random number to determine if we should use API events
      const useApiEvents = Math.random() < 0.2 && API_KEY;
      
      if (useApiEvents) {
        try {
          const apiEvents = await fetchHistoricalEvents(month, day);
          
          // If we got good events from the API, use some of them
          if (apiEvents.length > 0) {
            // Use 1-2 API events and fill the rest with curated events
            const apiEventCount = Math.min(apiEvents.length, Math.floor(Math.random() * 2) + 1);
            const apiEventSelection = apiEvents.slice(0, apiEventCount);
            
            // Get remaining events from curated list
            const remainingCount = EVENTS_PER_DAY - apiEventSelection.length;
            const curatedSelection = getRandomEventsForDay(dateNum, remainingCount);
            
            // Combine and shuffle
            events = shuffleArray([...apiEventSelection, ...curatedSelection]);
          } else {
            // Fallback to curated events
            events = getRandomEventsForDay(dateNum, EVENTS_PER_DAY);
          }
        } catch (error) {
          console.error('Error fetching API events:', error);
          // Fallback to curated events on API error
          events = getRandomEventsForDay(dateNum, EVENTS_PER_DAY);
        }
      } else {
        // Use only curated events (80% of the time)
        events = getRandomEventsForDay(dateNum, EVENTS_PER_DAY);
      }
    } catch (error) {
      console.error('Error in getDailyEvents:', error)
      // Fallback to curated events on error
      events = getRandomEventsForDay(dateNum, EVENTS_PER_DAY)
    }
  }
  
  // Ensure each event has a unique ID
  events = events.map((event, index) => ({
    ...event,
    id: index + 1
  }))
  
  // Ensure we only return EVENTS_PER_DAY events
  const limitedEvents = events.slice(0, EVENTS_PER_DAY)
  
  // Cache the events
  eventsCache[dateString] = limitedEvents
  
  return limitedEvents
}
