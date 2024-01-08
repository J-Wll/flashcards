import { useState, useEffect, useRef } from "react"

import "./css/FlashcardHandler.css"
import "./css/Utility.css"

import Flashcard from "./Flashcard.jsx"
import OverlayWindow from "./OverlayWindow.jsx"

// import defaultFlashcards from "./json/defaultFlashcards.json"
// import emptyFlashcards from "./json/emptyFlashcards.json"

const defaultFlashcards = [
    {
        "front": "What is a runtime enviroment?",
        "back": "The environment where a program is run",
        "multipleChoice": "false"
    },
    {
        "front": "What is JSON used as?",
        "back": "JSON is a data format based on JavaScript object syntax",
        "multipleChoice": "true",
        "multipleChoiceAnswers": [
            { "mca": "A data format" },
            { "mca": "A website styling language" },
            { "mca": "A video playback API" }
        ],
        "correctAnswer": "1"
    },
    {
        "front": "What is an IDE?",
        "back": "Integrated Development Environment"
    },
    {
        "front": "What are octal numbers?",
        "back": "Base 8, 28 is 34"
    },
    {
        "front": "What are hexadecimal numbers?",
        "back": "Base 16, 28 is 1C"
    },
    {
        "front": "What are pointers?",
        "back": "Structures that hold (point to) a memory address"
    },
    {
        "front": "In languages like C++, what is the difference between pointers and references?",
        "back": "Pointers hold a memory address, a reference is a memory address"
    }
]

const emptyFlashcards = [
    {
        "front": "Front",
        "back": "Back"
    },
    {
        "front": "Front",
        "back": "Back"
    }
]

export default function FlashcardHandler() {
    const [flashcardNum, updateFlashcardNum] = useState(0);
    const errorMsgRef = useRef(null);
    // can be none, splash, create, save, load, stats, about
    const [stateOverlayMode, updateOverlayMode] = useState("none");
    let overlayMode = "";

    function initialFlashcards() {
        let validFlashcards = true;
        try {
            JSON.parse(localStorage.getItem("flashcards"))[0].front;
        }
        catch (error) {
            validFlashcards = false;
        }

        if (validFlashcards) {
            return JSON.parse(localStorage.getItem("flashcards"));
        }
        return emptyFlashcards;
    }

    const [stateFlashcards, updateStateFlashcards] = useState(initialFlashcards());

    let amountOfFlashcards = stateFlashcards.length;

    // If no newUser in local storage
    if (localStorage.getItem("newUser") === null) {
        overlayMode = "splash"
    }
    else {
        overlayMode = stateOverlayMode;
    }

    // Navigation functions
    function prevCard() {
        // Previous can keep a buffer of like the last 10?
        if (flashcardNum > 0) {
            updateFlashcardNum((flashcardNum) => flashcardNum - 1)
        }
        else {
            updateFlashcardNum(amountOfFlashcards - 1);
        }
        refresh(counter + 1);
    }

    function nextCard() {
        // Get a random card that you haven't seen in the past X cards?
        if (flashcardNum < amountOfFlashcards - 1) {
            updateFlashcardNum((flashcardNum) => flashcardNum + 1)
        }
        else {
            updateFlashcardNum(0);
        }
        refresh(counter + 1);
    }

    // Create/edit functions
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

    // Save function
    function saveCards() {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(stateFlashcards)]);
        a.href = URL.createObjectURL(file);
        a.download = "flashcards.json";
        a.click();
    }

    // Load functions
    function defaultCards() {
        updateFlashcardNum(0);
        updateStateFlashcards(defaultFlashcards);
    }

    function emptyCards() {
        updateFlashcardNum(0);
        updateStateFlashcards([...emptyFlashcards]);
    }

    function loadFromFile(event) {
        // Prevents page refresh
        event.preventDefault();

        const fileInput = event.target.elements.fileInput;
        const file = fileInput.files[0];

        // If there's a file, use FileReader api to parse the data
        if (file) {
            const reader = new FileReader();
            let syntaxValid = true;
            let contentValid = true;

            reader.onload = (e) => {
                let data = "";
                try {
                    data = JSON.parse(e.target.result);
                    console.log('Loaded data:', data);
                } catch (error) {
                    console.log(error);
                    errorMsgRef.current.style = ("color: rgb(255, 56, 56)");
                    errorMsgRef.current.textContent = error;
                    syntaxValid = false;
                }

                if (syntaxValid) {
                    try {
                        console.log(data[0].front);
                    }
                    catch (error) {
                        console.log(error);
                        contentValid = false;
                        errorMsgRef.current.style = ("color: rgb(255, 56, 56)");
                        errorMsgRef.current.textContent = "Invalid data in JSON file";
                    }
                }

                if (syntaxValid && contentValid) {
                    updateStateFlashcards(data);
                    errorMsgRef.current.style = ("color: white");
                    errorMsgRef.current.textContent = "Loaded file";
                }
            };
            reader.readAsText(file);
        }
    };

    // controls for the loading file windows
    function loadFileControls() {
        return (
            <>
                <form name="load-file-form" className="load-file-form" onSubmit={loadFromFile}>
                    <input className="ft-2 text-white load-file-form-element" id="fileInput" name="fileInput" type="file" accept=".json"></input>
                    <button className="ft-2 overlay-load-button load-file-form-element" type="submit">Load From File</button>
                </form>
                <p className="ft-2" ref={errorMsgRef}></p>
            </>)
    };

    // General overlay functions
    function resetOverlay() {
        updateOverlayMode("none");
        overlayMode = stateOverlayMode;
        console.log(overlayMode);
    }

    // Autosave when stateFlashcards changes
    useEffect(() => {
        localStorage.setItem("flashcards", JSON.stringify(stateFlashcards));
    }, [stateFlashcards]);

    return (
        <>
            {/* if overlay mode is not none, return the overlayWindow component, else return empty fragment */}
            {overlayMode != "none" ? <OverlayWindow overlayMode={overlayMode} updateOverlayMode={updateOverlayMode} resetOverlay={resetOverlay} flashcardContent={stateFlashcards[flashcardNum]} editCard={editCard} createCards={createCards} defaultCards={defaultCards} emptyCards={emptyCards} loadFileControls={loadFileControls} prev={prevCard} next={nextCard} /> : <></>}


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
                <button className="control-button ft-3" onClick={() => updateOverlayMode("about")}>About</button>
            </div>
        </>
    )
}