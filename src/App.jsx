import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import FlashcardHandler from './FlashcardHandler'
import Footer from './Footer'
import './css/App.css'
import './scss/styles.scss'
import * as bootstrap from 'bootstrap'

function App() {

  return (
    <div className="flex-container">
      <h1 className='text-white mt-1 mb-3'>Flashcards</h1>
      <FlashcardHandler/> 
      <Footer/>
    </div>
  )
}

export default App
