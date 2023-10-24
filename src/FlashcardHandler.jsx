import "./css/FlashcardHandler.css"
import Flashcard from './Flashcard.jsx'

function prevCard() {
    const activeCard = document.getElementById("active-flashcard");
    console.log(activeCard.getBoundingClientRect()) // do something with the location of the middle card to create a smooth animation
    animChange() // change animation plus effect to change state of middle card(the cards dont actually move)
}
function nextCard() {
    const activeCard = document.getElementById("active-flashcard");
    console.log(activeCard.getBoundingClientRect())
    animChange();
}

function animChange() {
    console.log("huf")
}

export default function FlashcardHandler() {
    return (
        <>

            <div className="flashcard-handler">
                <Flashcard onClick={prevCard} inactive={true} />
                <Flashcard question={""} />
                <Flashcard onClick={nextCard} inactive={true} />
            </div>

            <div className="control-bar my-3">
                <button className="control-buttons">Create</button>
                <button className="control-buttons">Load</button>
                <button className="control-buttons">Record</button>
                <button className="control-buttons">Settings</button>
                <button className="control-buttons">About</button>
            </div>
        </>
    )
}