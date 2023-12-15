import { useState } from "react"
import "./css/FlashcardHandler.css"
import './css/Utility.css'
import './css/ToolTip.css'
import Flashcard from './Flashcard.jsx'
import Questions from './json/questions.json'
import ToolTip from "./ToolTip.jsx"

Questions.push({
    front: "What is node.js?",
    back: "Z is B",
    multipleChoice: "false"
})
console.log(Questions);

export default function FlashcardHandler() {

    let [questionNum, updateQuestionNum] = useState(0)
    let amountOfQuestions = Questions.length;

    function prevCard() {
        // Previous can keep a buffer of like the last 10? With randomisation of next it'll be the only way 
        if (questionNum > 0) {
            updateQuestionNum((questionNum) => questionNum - 1)
            animChange() // animation for changing cards
        }
    }
    function nextCard() {
        // Get a random card that you haven't seen in the past X cards?
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
                {/* <Flashcard onClick={prevCard} inactive={true} /> */}
                <Flashcard prev={prevCard} next={nextCard} question={Questions[questionNum]} />
                {/* <Flashcard onClick={nextCard} inactive={true} /> */}
            </div>

            {/* these buttons should have labels going upwards and open a centered large closable window over the rest of the content */}
            {/* probably replace them with icons */}
            <div className="control-bar">
                <ToolTip element={<button className="control-buttons">Create</button>} tooltipText={"Create new flashcards"} />
                <ToolTip element={<button className="control-buttons">Load</button>} tooltipText={"Load a set of flashcards"} />
                <ToolTip element={<button className="control-buttons">Stats</button>} tooltipText={"Your study stats"} />
                <ToolTip element={<button className="control-buttons">Settings</button>} tooltipText={"Adjust the program"} />
                <ToolTip element={<button className="control-buttons">About</button>} tooltipText={"About this program"} />
            </div>
        </>
    )
}