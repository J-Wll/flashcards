import FlashcardHandler from './FlashcardHandler'
// import * as bootstrap from 'bootstrap'
// import './scss/styles.scss'
import './css/App.css'
import './css/Utility.css'

function App() {

  return (
    <div className="flex-container">
      <h1 className='text-white ft-5 app-title'>Flashcards</h1>
      <FlashcardHandler/> 
    </div>
  )
}

export default App
