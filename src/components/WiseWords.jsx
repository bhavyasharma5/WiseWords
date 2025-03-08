import React, { useState, useEffect } from 'react'
import './WiseWords.css'

const WiseWords = () => {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [favoriteQuotes, setFavoriteQuotes] = useState([])
  const [showWarning, setShowWarning] = useState(false)
  const [usedQuoteIndices, setUsedQuoteIndices] = useState([])

  // Fallback quotes in case API fails
  const fallbackQuotes = [
    {
      id: '1',
      content: "The best way to predict the future is to create it.",
      author: "Abraham Lincoln"
    },
    {
      id: '2',
      content: "Life is what happens when you're busy making other plans.",
      author: "John Lennon"
    },
    {
      id: '3',
      content: "Be the change you wish to see in the world.",
      author: "Mahatma Gandhi"
    },
    {
      id: '4',
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      id: '5',
      content: "In three words I can sum up everything I've learned about life: it goes on.",
      author: "Robert Frost"
    }
  ]

  // Fetch quotes from Quotable API
  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true)
      try {
        console.log('Fetching quotes from Quotable API...')
        
        // Fetch multiple quotes with the limit parameter
        const response = await fetch('http://api.quotable.io/quotes/random?limit=20')
        
        console.log('API Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Quotes received:', data.length)
        
        if (!data || data.length === 0) {
          throw new Error('No quotes received')
        }
        
        // The API already provides unique IDs (_id field)
        const shuffledQuotes = shuffleArray([...data])
        setQuotes(shuffledQuotes)
        console.log('Quotes array set:', shuffledQuotes)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching quotes:', err)
        
        // Use fallback quotes if API fails
        console.log('Using fallback quotes')
        const shuffledFallbackQuotes = shuffleArray([...fallbackQuotes])
        setQuotes(shuffledFallbackQuotes)
        setIsLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Get a new quote with anti-repetition mechanism
  const getNewQuote = () => {
    if (quotes.length === 0) return
    
    // If we have fewer than 3 quotes, just go to the next one
    if (quotes.length < 3) {
      const nextIndex = (currentQuoteIndex + 1) % quotes.length
      setCurrentQuoteIndex(nextIndex)
      
      // Check if the quote is in favorites
      const isNextQuoteFavorite = favoriteQuotes.some(
        fav => fav._id === quotes[nextIndex]._id
      )
      setIsFavorite(isNextQuoteFavorite)
      return
    }
    
    // Find a quote that isn't the current one
    let nextIndex
    let attempts = 0
    do {
      nextIndex = Math.floor(Math.random() * quotes.length)
      attempts++
    } while (nextIndex === currentQuoteIndex && attempts < 5)
    
    setCurrentQuoteIndex(nextIndex)
    
    // Check if the quote is in favorites
    const isNextQuoteFavorite = favoriteQuotes.some(
      fav => fav._id === quotes[nextIndex]._id
    )
    setIsFavorite(isNextQuoteFavorite)
  }

  // Get previous quote
  const getPrevQuote = () => {
    if (quotes.length === 0) return
    
    // Simpler approach: go to the previous quote in the array
    const prevIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length
    setCurrentQuoteIndex(prevIndex)
    
    // Check if the quote is in favorites
    const isPrevQuoteFavorite = favoriteQuotes.some(
      fav => fav._id === quotes[prevIndex]._id
    )
    setIsFavorite(isPrevQuoteFavorite)
  }

  const toggleFavorite = () => {
    if (quotes.length === 0) return
    
    if (!isFavorite) {
      if (favoriteQuotes.length >= 5) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
        return
      }
      setFavoriteQuotes([...favoriteQuotes, quotes[currentQuoteIndex]])
    } else {
      setFavoriteQuotes(favoriteQuotes.filter(
        quote => quote._id !== quotes[currentQuoteIndex]._id
      ))
    }
    setIsFavorite(!isFavorite)
  }

  const toggleFavoritesList = () => {
    setShowFavorites(!showFavorites)
  }

  // Check if current quote is in favorites
  useEffect(() => {
    if (quotes.length > 0) {
      const isCurrentQuoteFavorite = favoriteQuotes.some(
        fav => fav._id === quotes[currentQuoteIndex]._id
      )
      setIsFavorite(isCurrentQuoteFavorite)
    }
  }, [currentQuoteIndex, quotes, favoriteQuotes])

  // Initialize usedQuoteIndices with the first quote
  useEffect(() => {
    if (quotes.length > 0 && usedQuoteIndices.length === 0) {
      setUsedQuoteIndices([currentQuoteIndex])
    }
  }, [quotes, currentQuoteIndex, usedQuoteIndices.length])

  if (isLoading) {
    return (
      <div className="wise-words-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading wisdom...</p>
        </div>
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="wise-words-container">
        <div className="error-message">
          <p>Unable to load quotes</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    )
  }

  console.log('Current quote index:', currentQuoteIndex)
  console.log('Current quote:', quotes[currentQuoteIndex])

  return (
    <div className="wise-words-container">
      <div className="quote-card">
        <div className="dots-pattern"></div>
        <div className="decorative-circle-1"></div>
        <div className="decorative-circle-2"></div>
        <div className="decorative-circle-3"></div>
        
        <div className="card-header">
          <h2>WISEWORDS</h2>
          <button 
            className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
            onClick={toggleFavorite}
          >
            <span className="material-icons">
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>
        
        <div className="quote-content">
          <div className="quote-marks">"</div>
          <p className="quote-text">
            "{quotes[currentQuoteIndex].content}"
          </p>
          <p className="quote-author">— {quotes[currentQuoteIndex].author}</p>
          {quotes[currentQuoteIndex].tags && quotes[currentQuoteIndex].tags.length > 0 && (
            <div className="quote-tags">
              {quotes[currentQuoteIndex].tags.map((tag, index) => (
                <span key={index} className="quote-tag">{tag}</span>
              ))}
            </div>
          )}
          <div className="quote-marks-end">"</div>
        </div>

        <div className="card-actions">
          <button className="action-btn prev-quote" onClick={getPrevQuote}>
            <span className="material-icons">arrow_back</span>
            PREV
          </button>
          <button className="action-btn new-quote" onClick={getNewQuote}>
            <span className="material-icons">arrow_forward</span>
            NEXT
          </button>
          <button className="action-btn favorite-quotes" onClick={toggleFavoritesList}>
            <span className="material-icons">bookmarks</span>
            {favoriteQuotes.length > 0 ? `FAVORITES (${favoriteQuotes.length})` : "FAVORITES"}
          </button>
        </div>
      </div>

      {/* Warning Message */}
      {showWarning && (
        <div className="warning-message">
          Maximum limit of 5 favorite quotes reached!
        </div>
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="favorites-modal">
          <div className="favorites-content">
            <div className="favorites-header">
              <h2>Favorite Quotes</h2>
              <button className="close-btn" onClick={toggleFavoritesList}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="favorites-list">
              {favoriteQuotes.map((quote, index) => (
                <div key={index} className="favorite-quote-item">
                  <p className="favorite-quote-text">{quote.content}</p>
                  <p className="favorite-quote-author">- {quote.author}</p>
                  {quote.tags && quote.tags.length > 0 && (
                    <div className="favorite-quote-tags">
                      {quote.tags.map((tag, index) => (
                        <span key={index} className="favorite-quote-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {favoriteQuotes.length === 0 && (
                <p className="no-favorites">No favorite quotes yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WiseWords 