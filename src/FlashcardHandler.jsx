import { useState, useEffect } from "react"

import "./css/FlashcardHandler.css"
import "./css/Utility.css"

import Flashcard from "./Flashcard.jsx"
import OverlayWindow from "./OverlayWindow.jsx"

import defaultFlashcards from "./json/defaultFlashcards.json"
import emptyFlashcards from "./json/emptyFlashcards.json"

export default function FlashcardHandler() {
    console.log(emptyFlashcards);
    const [flashcardNum, updateFlashcardNum] = useState(0);
    const [stateFlashcards, updateStateFlashcards] = useState([defaultFlashcards]);

    if (stateFlashcards.length === 1) {
        updateStateFlashcards(stateFlashcards[0])
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
        updateStateFlashcards(
            [...stateFlashcards, {
                front: iFront,
                back: iBack,
                multipleChoice: iMultipleChoice
            }]
        )
    }

    function editCard(iFront, iBack, iMultipleChoice = false) {
        updateStateFlashcards(prevState => {
            const tempArr = [...prevState];
            tempArr[flashcardNum].front = iFront;
            tempArr[flashcardNum].back = iBack;
            tempArr[flashcardNum].multipleChoice = iMultipleChoice;
            return tempArr;
        });
    }

    function saveCards() {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(stateFlashcards)]);
        a.href = URL.createObjectURL(file);
        a.download = "flashcards.json";
        a.click();
    }

    function defaultCards() {
        updateFlashcardNum(0);
        updateStateFlashcards(defaultFlashcards);
    }

    function emptyCards() {
        updateFlashcardNum(0);
        updateStateFlashcards(emptyFlashcards);
    }

    // Autosave when stateFlashcards changes
    useEffect(() => {
        localStorage.setItem("flashcards", JSON.stringify(stateFlashcards));
    }, [stateFlashcards]);

    return (
        <>
            {/* if overlay mode is not none, return the overlayWindow component, else return empty fragment */}
            {overlayMode != "none" ? <OverlayWindow overlayMode={overlayMode} flashcardContent={stateFlashcards[flashcardNum]} resetOverlay={() => updateOverlayMode("none")} editCard={editCard} createCards={createCards} defaultCards={defaultCards} emptyCards={emptyCards} prev={prevCard} next={nextCard} /> : <></>}


            {/* functions for program control are passed into the component */}
            <div className="flashcard-handler">
                <Flashcard extraClasses={``} prev={prevCard} next={nextCard} flashcardContent={stateFlashcards[flashcardNum]} flashcardNum={flashcardNum} amountOfFlashcards={amountOfFlashcards} />
            </div>

            {/* these buttons should have labels going upwards and open a centered large closable window over the rest of the content */}
            <div className="control-bar responsive-width">
                <button className="control-button ft-3" onClick={() => updateOverlayMode("create")}>Create/Edit</button>
                <button className="control-button ft-3" onClick={saveCards}>Save</button>
                <button className="control-button ft-3" onClick={() => updateOverlayMode("load")}>Load</button>
                <button className="control-button ft-3" onClick={() => updateOverlayMode("stats")}>Stats</button>
                <button className="control-button ft-3" onClick={() => updateOverlayMode("settings")}>Settings</button>
                <button className="control-button ft-3" onClick={() => updateOverlayMode("about")}>About</button>
            </div>
        </>
    )
}