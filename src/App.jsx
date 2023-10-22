import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import FlashcardHandler from './FlashcardHandler.jsx'
import Flashcard from './Flashcard.jsx'
import './css/App.css'
import './scss/styles.scss'
import * as bootstrap from 'bootstrap'

function App() {

  return (
    <div className="flex-container">
      <h1 className='text-light'>Flashcards</h1>
      <FlashcardHandler/>
    </div>
  )
}

export default App
