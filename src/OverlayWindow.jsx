import "./css/OverlayWindow.css"
import "./css/Utility.css"

import OverlayWindowMcOption from "./OverlayWindowMcOption.jsx"
import { useEffect, useRef, useState } from "react";

export default function OverlayWindow(props) {
    // Initial splash screen
    function splashWindow() {
        localStorage.setItem("newUser", "notNew");

        return (
            <>
                <p className="text-white ft-2 my-1">Made by <a className="text-white" href="https://github.com/J-Wll">Joe Westwell</a></p>
                <p className="text-white ft-2 my-1">The program automatically saves your changes to local storage</p>
                <p className="text-white ft-2 my-1">To fully save your flashcards, click the save button to download</p>
                <p className="text-white ft-2 my-1">This JSON file can then be used through the load button, allowing you to have multiple sets of cards</p>
                <p className="text-white ft-2 my-1">To see this information again, click about</p>


                <p className="text-white ft-2">Load a set to continue</p>
                <button className="ft-2" onClick={() => { props.defaultCards(); props.resetOverlay() }}>Load example set of flashcards</button>
                <button className="ft-2" onClick={() => { props.emptyCards(); props.resetOverlay() }}>Load empty set of flashcards</button>
                {props.loadFileControls()}
            </>
        )
    }

    // From the create cards button
    function createEditCardWindow() {
        // Create or edit mode
        let [createOrEdit, updateCreateOrEdit] = useState("Create")
        // References for front and back
        const frontRef = useRef(null);
        const backRef = useRef(null);
        // If multiple choice is checked
        const [mcChecked, updateMcChecked] = useState(false);
        // Number for key of multiple choices
        const [mcCounter, updateMcCounter] = useState(0);
        // The multiple choice options added by the user
        const [mcOptions, updateMcOptions] = useState([]);
        // The multiple choice option the user checks as correct
        const [correctChecked, updateCorrectChecked] = useState(false);
        // Used to track the text of all multiple choice options
        const [mcText, updateMcText] = useState([])

        let existingAnswers = [];

        let currentFlashcard = props.stateFlashcards[props.flashcardNum];

        // This is used when deleting options as a means of acessing the current version of state, previously the callback was using outdated state
        const optionsRef = useRef();
        optionsRef.current = mcOptions;

        // Create and edit modes
        function callCreateOrEdit() {
            let args = []
            if (mcChecked) {
                console.log(correctChecked);
                console.log(mcOptions);
                // Assigning correctAnswer to the index matching correctChecked, if there is no match assign it to 1 to prevent errors
                let correctAnswer = 1;
                for (let i in mcOptions) {
                    if (mcOptions[i].key == correctChecked) {
                        // +1 because the logic for multiple choice is not zero indexed
                        correctAnswer = Number(i) + 1;
                    }
                }

                console.log(correctAnswer)

                const multipleChoiceAnswers = mcOptions.map((answer, index) => ({ "mca": answer.props.initialText }))
                console.log(multipleChoiceAnswers)

                args = [frontRef.current.value, backRef.current.value, mcChecked.toString(), multipleChoiceAnswers, correctAnswer]
            } else {
                args = [frontRef.current.value, backRef.current.value, mcChecked.toString()]
            }
            createOrEdit === "Create" ? props.createCards(...args) : props.editCard(...args)
        }

        function editMode(currentFlashcard) {
            updateMcChecked((mcChecked) => false);
            updateCreateOrEdit("Edit");
            frontRef.current.value = currentFlashcard.front;
            backRef.current.value = currentFlashcard.back;
            updateMcChecked(currentFlashcard.multipleChoice === "true");
        }

        function createMode() {
            updateMcOptions([]);
            updateMcCounter(0);
            updateMcChecked(false)
            updateCreateOrEdit("Create");
            frontRef.current.value = "";
            backRef.current.value = "";
        }

        // Navigation
        function nextCard() {
            const newNum = props.next();
            currentFlashcard = props.stateFlashcards[newNum]
            console.log(newNum, currentFlashcard.front);
            editMode(currentFlashcard);
        }

        function prevCard() {
            const newNum = props.prev();
            currentFlashcard = props.stateFlashcards[newNum]
            console.log(newNum, currentFlashcard.front);
            editMode(currentFlashcard);
        }

        function editNavigation() {
            if (createOrEdit === "Edit") {
                return (
                    <div className="horizontal-container">
                        <button className="ft-3" onClick={prevCard}>{"<"}</button>
                        <button className="ft-3" onClick={nextCard}>{">"}</button>
                    </div>
                )
            }
        }

        // Multiple choice related functions
        function addMcOption(e, keyCounter = mcCounter, initialText = "") {
            // Updates the array to be the same array (spread) with an extra option on the end
            updateMcOptions((prevMcOptions) => [...prevMcOptions, <OverlayWindowMcOption key={keyCounter} counter={keyCounter} initialText={initialText} deleteMcOption={deleteMcOption} checkAction={() => updateCorrectChecked(() => keyCounter)} mcText={mcText} updateMcText={updateMcText} />])
            updateMcCounter((mcCounter) => mcCounter + 1);
        }

        // Delete an option based on index
        function deleteMcOption(location) {
            const tempArr = optionsRef.current.filter(item => item["key"] != location)
            updateMcOptions(tempArr);
        }

        function addMcControls() {
            if (mcChecked) {
                if (currentFlashcard.multipleChoiceAnswers != undefined) {
                    existingAnswers = currentFlashcard.multipleChoiceAnswers;
                }

                if (existingAnswers.length < 2 && mcCounter < 1 || createOrEdit === "Create" && mcCounter < 1) {
                    addMcOption(null, 0);
                    addMcOption(null, 1);
                }

                return (
                    <>
                        <p className="text-white ft-1 allign-left" >Check the button of the correct answer</p>
                        <button className="ft-3 overlay-button responsive-width self-center" onClick={addMcOption}>Add option</button>
                        {optionsRef.current}
                    </>
                )
            }
        }

        function checkedMc(e) {
            updateMcChecked(e.target.checked)
        }

        function addExistingMultipleChoiceOptions() {
            updateMcOptions((mcOptions) => []);
            updateMcCounter(0);
            existingAnswers = currentFlashcard.multipleChoiceAnswers;

            // for each existing answer
            for (let i in existingAnswers) {
                addMcOption(null, i, existingAnswers[i]["mca"])
            }
        }

        // UI functions
        function deleteButtonIfEdit() {
            if (createOrEdit === "Edit") {
                return (
                    <button className="ft-3 responsive-width self-center" onClick={() => props.deleteCard(props.flashcardNum)}>Delete</button>
                )
            }
        }

        // Whenever the mode is edit and there are more existing multipleChoiceAnswers than are in the options, run addExistingMultipleChoiceOptions
        // Triggers when mcChecked or createOrEdit is changed
        useEffect(() => {
            if (createOrEdit === "Edit" && mcChecked === true && currentFlashcard.multipleChoiceAnswers != undefined) {
                if (mcOptions.length < currentFlashcard.multipleChoiceAnswers.length) {
                    updateMcOptions([]);
                    updateMcCounter(0);
                    addExistingMultipleChoiceOptions();
                }
            }
        }, [mcChecked, createOrEdit])

        return (
            <>
                <div className="horizontal-container">
                    <button className="ft-3" onClick={createMode}>Create</button>
                    <span className="text-white ft-3"> | </span>
                    <button className="ft-3" onClick={() => editMode(currentFlashcard)}>Edit</button>
                </div>

                <div className="overlay-input-section">
                    <label className="text-white ft-3">Front</label>
                    <textarea className="ft-3 overlay-textarea" id="create-front-input" ref={frontRef}></textarea>

                    <label className="text-white ft-3">Back</label>
                    <textarea className="ft-3 overlay-textarea" id="create-back-input" ref={backRef}></textarea>

                    {deleteButtonIfEdit()}

                    <div className="horizontal-container">
                        <label className="text-white ft-3" htmlFor="mc-checkbox">Multiple choice?</label>
                        <input type="checkbox" id="mc-checkbox" checked={mcChecked} onChange={checkedMc} className="wh-1 overlay-checkbox" />
                    </div>

                    {/* adds controls for adding multiple choice questions */}
                    {addMcControls()}

                    <button className="ft-3 overlay-button responsive-width self-center" onClick={callCreateOrEdit}>{createOrEdit}</button>

                    {/* adds navigation for when in edit mode */}
                    {editNavigation()}
                </div>
            </>
        )
    }

    // About button
    function aboutWindow() {
        return (
            <>
                <p className="text-white ft-2">Made by <a className="text-white" href="https://github.com/J-Wll">Joe Westwell</a></p>
                <p className="text-white ft-2">The program automatically saves your changes to local storage</p>
                <p className="text-white ft-2">To fully save your flashcards, click the save button and download the JSON file</p>
                <p className="text-white ft-2">This JSON file can then be used through the load button, allowing you to have multiple sets of cards</p>
            </>
        )
    }

    function loadWindow() {
        return (
            <>
                <button className="ft-2 overlay-load-button" onClick={props.emptyCards}>Load Empty Set</button>
                <button className="ft-2 overlay-load-button" onClick={props.defaultCards}>Load Example Set</button>
                {props.loadFileControls()}
            </>

        )
    }

    // From the stats button
    function statsWindow() {

        return (
            <>
                <p className="text-white ft-2">Stats</p>
                {/* Cards viewed? */}
                {/* Answers correct? */}
                {/* Cards made? */}
                {/* Time spent? */}
            </>
        )
    }

    // No close button during splash screen, a set has to be loaded to close it
    function displayCloseButton() {
        if (props.overlayMode != "splash") {
            return (
                <button className="overlay-close ft-3" onClick={props.resetOverlay}>X</button>
            )
        }
    }

    function setOverlayContent() {
        switch (props.overlayMode) {
            case "splash":
                return splashWindow();
            case "create":
                return createEditCardWindow();
            case "load":
                return loadWindow();
            case "stats":
                return statsWindow();
            case "about":
                return aboutWindow();
            default:
                break;
        }
    }

    return (
        <>
            <div className="background-blur" />

            <div className="overlay-window responsive-width">
                {displayCloseButton()}
                {setOverlayContent()}
            </div>
        </>
    )
}