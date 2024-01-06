import { useState } from "react"
import "./css/FlashcardHandler.css"
import "./css/Utility.css"
import "./css/ToolTip.css"
import Flashcard from "./Flashcard.jsx"
import Questions from "./json/questions.json"
import ToolTip from "./ToolTip.jsx"
import OverlayWindow from "./OverlayWindow.jsx"


console.log(Questions);

export default function FlashcardHandler() {
    let [questionNum, updateQuestionNum] = useState(0);
    let amountOfQuestions = Questions.length;

    // used to reload components by changing state
    let [counter, refresh] = useState(0);

    // can be none, create, save, load, stats, settings, about
    let [overlayMode, updateOverlayMode] = useState("none");

    function resetOverlay(){
        updateOverlayMode("none");
    }

    function prevCard() {
        // Previous can keep a buffer of like the last 10?
        if (questionNum > 0) {
            updateQuestionNum((questionNum) => questionNum - 1)
            animChange() // animation for changing cards
        }
        else {
            updateQuestionNum(amountOfQuestions-1);
        }
    }

    function nextCard() {
        // Get a random card that you haven't seen in the past X cards?
        if (questionNum < amountOfQuestions - 1) {
            updateQuestionNum((questionNum) => questionNum + 1)
            animChange();
        }
        else {
            updateQuestionNum(0);
        }
    }

    function createCards(iFront, iBack, iMultipleChoice = false) {
        // Questions.push({
        //     front: "What is node.js?",
        //     back: "Z is B",
        //     multipleChoice: "false"
        // })
        Questions.push({
            front: iFront,
            back: iBack,
            multipleChoice: iMultipleChoice
        })
        console.log(amountOfQuestions);
        refresh(counter+1);
    }

    function saveCards(){
        
    }

    function animChange() {
        const activeCard = document.getElementById("active-flashcard");
        console.log(activeCard.getBoundingClientRect()) // do something with the location of the middle card to create a smooth animation
    }


    return (
        <>
            {overlayMode != "none" ? <OverlayWindow overlayMode = {overlayMode} resetOverlay = {resetOverlay} createCards = {createCards}/> : <></>}
            

            {/* functions for program control are passed into the component */}
            <div className="flashcard-handler">
                <Flashcard extraClasses={``} prev={prevCard} next={nextCard} question={Questions[questionNum]} questionNum = {questionNum} amountOfQuestions = {amountOfQuestions} />
            </div>

            {/* these buttons should have labels going upwards and open a centered large closable window over the rest of the content */}
            <div className="control-bar">
                <ToolTip element={<button className="control-buttons" onClick={() => updateOverlayMode("create")}>Create</button>} tooltipText={"Create new flashcards"} />
                <ToolTip element={<button className="control-buttons" onClick={saveCards}>Save</button>} tooltipText={"Save your set of flashcards"} />
                <ToolTip element={<button className="control-buttons" onClick={() => updateOverlayMode("load")}>Load</button>} tooltipText={"Load a set of flashcards"} />
                <ToolTip element={<button className="control-buttons" onClick={() => updateOverlayMode("stats")}>Stats</button>} tooltipText={"Your study stats"} />
                <ToolTip element={<button className="control-buttons" onClick={() => updateOverlayMode("settings")}>Settings</button>} tooltipText={"Adjust the program"} />
                <ToolTip element={<button className="control-buttons" onClick={() => updateOverlayMode("about")}>About</button>} tooltipText={"About this program"} />
            </div>
        </>
    )
}