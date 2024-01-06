import { useState, useEffect } from "react"

import "./css/FlashcardHandler.css"
import "./css/Utility.css"
import "./css/ToolTip.css"

import Flashcard from "./Flashcard.jsx"
import ToolTip from "./ToolTip.jsx"
import OverlayWindow from "./OverlayWindow.jsx"

import defaultQuestions from "./json/defaultQuestions.json"

export default function FlashcardHandler() {
    let [questionNum, updateQuestionNum] = useState(0);
    const [stateQuestions, setStateQuestions] = useState([defaultQuestions]);

    
    if (stateQuestions.length === 1){
        setStateQuestions(stateQuestions[0])
    }

    let amountOfQuestions = stateQuestions.length;

    // used to reload components by changing state
    let [counter, refresh] = useState(0);

    // can be none, create, save, load, stats, settings, about
    let [overlayMode, updateOverlayMode] = useState("none");

    function prevCard() {
        // Previous can keep a buffer of like the last 10?
        if (questionNum > 0) {
            updateQuestionNum((questionNum) => questionNum - 1)
        }
        else {
            updateQuestionNum(amountOfQuestions - 1);
        }
    }

    function nextCard() {
        // Get a random card that you haven't seen in the past X cards?
        if (questionNum < amountOfQuestions - 1) {
            updateQuestionNum((questionNum) => questionNum + 1)
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
        stateQuestions.push({
            front: iFront,
            back: iBack,
            multipleChoice: iMultipleChoice
        })
        console.log(amountOfQuestions);
        refresh(counter + 1);
    }

    function saveCards() {
        localStorage.setItem("questions", JSON.stringify(stateQuestions));
    }

    // Autosave when stateQuestions changes
    useEffect(() => {
        localStorage.setItem("questions", JSON.stringify(stateQuestions));
    }, [stateQuestions]);

    return (
        <>
            {overlayMode != "none" ? <OverlayWindow overlayMode={overlayMode} resetOverlay={() =>updateOverlayMode("none")} createCards={createCards} /> : <></>}


            {/* functions for program control are passed into the component */}
            <div className="flashcard-handler">
                <Flashcard extraClasses={``} prev={prevCard} next={nextCard} question={stateQuestions[questionNum]} questionNum={questionNum} amountOfQuestions={amountOfQuestions} />
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