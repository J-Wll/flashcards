import { useState } from "react"
import "./css/FlashcardHandler.css"
import './css/Utility.css'
import Flashcard from './Flashcard.jsx'
import Questions from './json/questions.json'


export default function FlashcardHandler() {

    let [questionNum, updateQuestionNum] = useState(0)
    let amountOfQuestions = Questions.length;

    function prevCard() {
        if (questionNum > 0) {
            updateQuestionNum((questionNum) => questionNum - 1)
            animChange() // animation for changing cards
        }
    }
    function nextCard() {
        if (questionNum < amountOfQuestions - 1) {
            updateQuestionNum((questionNum) => questionNum + 1)
            animChange();
        }
    }

    function animChange() {
        const activeCard = document.getElementById("active-flashcard");
        console.log(activeCard.getBoundingClientRect()) // do something with the location of the middle card to create a smooth animation
    }


    return (
        <>

            {/* functions for program control are passed into the component */}
            <div className="flashcard-handler">
                <Flashcard onClick={prevCard} inactive={true} />
                <Flashcard prev={prevCard} next={nextCard} question={Questions[questionNum]} />
                <Flashcard onClick={nextCard} inactive={true} />
            </div>

            {/* these buttons should have labels going upwards and open a centered large closable window over the rest of the content */}
            {/* probably replace them with icons */}
            <div className="control-bar">
                <button className="control-buttons">Create</button>
                <button className="control-buttons">Load</button>
                <button className="control-buttons">Stats</button>
                <button className="control-buttons">Settings</button>
                <button className="control-buttons">About</button>
            </div>
        </>
    )
}