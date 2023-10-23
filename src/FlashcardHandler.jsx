import "./css/FlashcardHandler.css"
import Flashcard from './Flashcard.jsx'

export default function FlashcardHandler() {
    return (
        <>
            <div className="flashcard-handler">
                <div className="control-sidebar">
                    <p>f</p>
                </div>
                <Flashcard extraClasses={"inactive"} />

                <Flashcard question={""} />

                <Flashcard extraClasses={"inactive"} />
            </div>
        </>
    )
}