import React, { useState } from 'react'
import './WiseWords.css'

const WiseWords = () => {
  const quotes = [
    {
      text: "Ask not what your country can do for you; ask what you can do for your country.",
      author: "John Kennedy"
    },
    {
      text: "Be the change you wish to see in the world.",
      author: "Mahatma Gandhi"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "In three words I can sum up everything I've learned about life: it goes on.",
      author: "Robert Frost"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    }
  ]

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [favoriteQuotes, setFavoriteQuotes] = useState([])
  const [showWarning, setShowWarning] = useState(false)

  const getNewQuote = () => {
    setCurrentQuoteIndex((prevIndex) => 
      prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
    )
    setIsFavorite(false)
  }

  const toggleFavorite = () => {
    if (!isFavorite) {
      if (favoriteQuotes.length >= 5) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000) // Hide warning after 3 seconds
        return
      }
      setFavoriteQuotes([...favoriteQuotes, quotes[currentQuoteIndex]])
    } else {
      setFavoriteQuotes(favoriteQuotes.filter(
        quote => quote.text !== quotes[currentQuoteIndex].text
      ))
    }
    setIsFavorite(!isFavorite)
  }

  const toggleFavoritesList = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <div className="wise-words-container">
      <div className="quote-card">
        <div className="dots-pattern"></div>
        <div className="decorative-circle-1"></div>
        <div className="decorative-circle-2"></div>
        <div className="decorative-circle-3"></div>
        
        <div className="card-header">
          <h2>QUOTE.</h2>
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
            "{quotes[currentQuoteIndex].text}"
          </p>
          <p className="quote-author">— {quotes[currentQuoteIndex].author}</p>
          <div className="quote-marks-end">"</div>
        </div>

        <div className="card-actions">
          <button className="action-btn new-quote" onClick={getNewQuote}>
            NEW QUOTE
          </button>
          <button className="action-btn favorite-quotes" onClick={toggleFavoritesList}>
            <span className="material-icons">bookmarks</span>
            FAVORITES
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
                  <p className="favorite-quote-text">{quote.text}</p>
                  <p className="favorite-quote-author">- {quote.author}</p>
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