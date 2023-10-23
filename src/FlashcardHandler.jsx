import "./css/FlashcardHandler.css"
import Flashcard from './Flashcard.jsx'

export default function FlashcardHandler() {
    return (
        <>

            <div className="flashcard-handler">
                <Flashcard inactive={true} />
                <Flashcard question={""} />
                <Flashcard inactive={true} />
            </div>

            <div className="control-bar">
                <button className="control-buttons">Create</button>
                <button className="control-buttons">Load</button>
                <button className="control-buttons">Record</button>
                <button className="control-buttons">Settings</button>
                <button className="control-buttons">About</button>
            </div>
        </>
    )
}