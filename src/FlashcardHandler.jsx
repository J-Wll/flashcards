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
    function prevCard(e, iNum = flashcardNum) {
        amountOfFlashcards = stateFlashcards.length;
        console.log("before", iNum)
        if (iNum > 0) {
            iNum -= 1;
        }
        else {
            iNum = amountOfFlashcards - 1;
        }
        console.log("after", iNum)
        updateFlashcardNum((flashcardNum) => iNum)
        return iNum;
    }

    function nextCard(e, iNum = flashcardNum) {
        amountOfFlashcards = stateFlashcards.length;
        console.log("before", iNum)
        if (iNum < amountOfFlashcards - 1) {
            iNum += 1;
        }
        else {
            iNum = 0;
        }
        console.log("after", iNum)
        updateFlashcardNum((flashcardNum) => iNum)
        return iNum;
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

    function deleteCard(num, childFlashcards) {
        let amountOfFlashcards = childFlashcards.length;

        if (amountOfFlashcards > 2 && num <= amountOfFlashcards-1) {
            console.log("parent delete card flashnum", num);
            // const tempArr = [...stateFlashcards]
            childFlashcards.splice(num, 1);
            updateStateFlashcards((stateFlashcards) => childFlashcards);
            // nextCard();
            if (flashcardNum < stateFlashcards.length){
                console.log("Decrease")
                updateFlashcardNum((flashcardNum) => flashcardNum-1)
            }
            else {
                console.log("Zero")
                updateFlashcardNum(() => 0);
            }
            localStorageCardSave();
            return childFlashcards
        } else {
            console.log("Can not go below 2 flashcards")
            return false
        }
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
        updateStateFlashcards([...defaultFlashcards]);
    }

    function emptyCards() {
        updateFlashcardNum(0);
        // Spread operator to create a copy, otherwise it is not seen as different from the default and no re-render happens
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
                        data[0].front;
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
    }

    function localStorageCardSave() {
        localStorage.setItem("flashcards", JSON.stringify(stateFlashcards));
    }

    // Autosave when stateFlashcards changes
    useEffect(() => {
        localStorageCardSave();
    }, [stateFlashcards]);

    return (
        <>
            {/* if overlay mode is not none, return the overlayWindow component, else return empty fragment */}
            {overlayMode != "none" ? <OverlayWindow overlayMode={overlayMode} updateOverlayMode={updateOverlayMode} deleteCard={deleteCard} resetOverlay={resetOverlay} flashcardContent={stateFlashcards[flashcardNum]} stateFlashcards={stateFlashcards} flashcardNum={flashcardNum} editCard={editCard} createCards={createCards} defaultCards={defaultCards} emptyCards={emptyCards} loadFileControls={loadFileControls} prev={prevCard} next={nextCard} /> : <></>}


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