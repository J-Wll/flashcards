import { useState, useEffect } from "react"

import "./css/FlashcardHandler.css"
import "./css/Utility.css"
import "./css/ToolTip.css"

import Flashcard from "./Flashcard.jsx"
import ToolTip from "./ToolTip.jsx"
import OverlayWindow from "./OverlayWindow.jsx"

import defaultFlashcards from "./json/defaultFlashcards.json"

export default function FlashcardHandler() {
    let [flashcardNum, updateFlashcardNum] = useState(0);
    const [stateFlashcards, setStateFlashcards] = useState([defaultFlashcards]);

    if (stateFlashcards.length === 1) {
        setStateFlashcards(stateFlashcards[0])
    }

    let amountOfFlashcards = stateFlashcards.length;

    // can be none, create, save, load, stats, settings, about
    let [overlayMode, updateOverlayMode] = useState("none");

    function prevCard() {
        // Previous can keep a buffer of like the last 10?
        if (flashcardNum > 0) {
            updateFlashcardNum((flashcardNum) => flashcardNum - 1)
        }
        else {
            updateFlashcardNum(amountOfFlashcards - 1);
        }
    }

    function nextCard() {
        // Get a random card that you haven't seen in the past X cards?
        if (flashcardNum < amountOfFlashcards - 1) {
            updateFlashcardNum((flashcardNum) => flashcardNum + 1)
        }
        else {
            updateFlashcardNum(0);
        }
    }

    function createCards(iFront, iBack, iMultipleChoice = false) {
        setStateFlashcards(
            [...stateFlashcards, {
                front: iFront,
                back: iBack,
                multipleChoice: iMultipleChoice
            }]
        )
    }
    
    function editCard(iFront, iBack, iMultipleChoice = false) {
        setStateFlashcards(prevState => {
            const tempArr = [...prevState];
            tempArr[flashcardNum].front = iFront;
            tempArr[flashcardNum].back = iBack;
            tempArr[flashcardNum].multipleChoice = iMultipleChoice;
            return tempArr;
        });
    }

    function saveCards() {
        localStorage.setItem("flashcards", JSON.stringify(stateFlashcards));
    }

    // Autosave when stateFlashcards changes
    useEffect(() => {
        console.log("ff")
        localStorage.setItem("flashcards", JSON.stringify(stateFlashcards));
    }, [stateFlashcards]);

    return (
        <>
            {/* if overlay mode is not none, return the overlayWindow component, else return empty fragment */}
            {overlayMode != "none" ? <OverlayWindow overlayMode={overlayMode} flashcardContent={stateFlashcards[flashcardNum]} resetOverlay={() => updateOverlayMode("none")} editCard={editCard} createCards={createCards} prev={prevCard} next={nextCard} /> : <></>}


            {/* functions for program control are passed into the component */}
            <div className="flashcard-handler">
                <Flashcard extraClasses={``} prev={prevCard} next={nextCard} flashcardContent={stateFlashcards[flashcardNum]} flashcardNum={flashcardNum} amountOfFlashcards={amountOfFlashcards} />
            </div>

            {/* these buttons should have labels going upwards and open a centered large closable window over the rest of the content */}
            <div className="control-bar responsive-width">
                <ToolTip element={<button className="control-button ft-3" onClick={() => updateOverlayMode("create")}>Create/Edit</button>} tooltipText={"Edit existing and create new flashcards"} />
                <ToolTip element={<button className="control-buttons ft-3" onClick={saveCards}>Save</button>} tooltipText={"Save your set of flashcards"} />
                <ToolTip element={<button className="control-buttons ft-3" onClick={() => updateOverlayMode("load")}>Load</button>} tooltipText={"Load a set of flashcards"} />
                <ToolTip element={<button className="control-buttons ft-3" onClick={() => updateOverlayMode("stats")}>Stats</button>} tooltipText={"Your study stats"} />
                <ToolTip element={<button className="control-buttons ft-3" onClick={() => updateOverlayMode("settings")}>Settings</button>} tooltipText={"Adjust the program"} />
                <ToolTip element={<button className="control-buttons ft-3" onClick={() => updateOverlayMode("about")}>About</button>} tooltipText={"About this program"} />
            </div>
        </>
    )
}