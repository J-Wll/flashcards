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
        const [createOrEdit, updateCreateOrEdit] = useState("Create")
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
        // Used to track the text of all multiple choice options, provides controlled input for options
        const [mcText, updateMcText] = useState(({}))

        let existingAnswers = [];
        let localFlashcards = props.stateFlashcards
        let localFlashcardNum = props.flashcardNum

        let currentFlashcard = localFlashcards[localFlashcardNum];


        // This is used when deleting options as a means of acessing the current version of state, previously the callback was using outdated state
        const optionsRef = useRef();
        optionsRef.current = mcOptions;
        let newestOptions = mcOptions;
        let newestText;

        useEffect(() => {
            console.log("INSIDE TOP USE EFFECT", mcText);
        
            // const addOptionsBasedOnMcText = () => {
            //     // Reset options before adding new ones
            //     resetMultipleChoice();
        
            //     // Iterate through mcText and add options
            //     Object.keys(mcText).forEach((keyCounter) => {
            //         if (!newestOptions.some((option) => option.key === keyCounter)) {
            //             newestOptions = addMcOption(null, keyCounter, newestOptions, mcText[keyCounter]);
            //         }
            //     });
            // };
        
            // // Call the function to add options when the number of keys in mcText changes
            // if (Object.keys(mcText).length > 0) {
            //     addOptionsBasedOnMcText();
            // }
        
            // console.log("INSIDE NEWESTOPTIONS USE EFFECT", newestOptions);
        
        }, [mcText]);  // Only re-run the effect if the number of keys in mcText changes
        

        // Create and edit modes
        function callCreateOrEdit() {
            let args = []
            if (mcChecked) {
                // Assigning correctAnswer to the index matching correctChecked, if there is no match assign it to 1 to prevent errors
                let correctAnswer = 1;
                for (let i in mcOptions) {
                    if (mcOptions[i].key == correctChecked) {
                        // +1 because the logic for multiple choice is not zero indexed
                        correctAnswer = Number(i) + 1;
                    }
                }

                const multipleChoiceAnswers = [];
                let mcTextArr = Object.entries(mcText);
                console.log(mcTextArr)
                for (let key in mcText) {
                    if (mcText[key].length > 0) {
                        multipleChoiceAnswers.push({ "mca": mcText[key] })
                    }
                }

                args = [frontRef.current.value, backRef.current.value, mcChecked.toString(), multipleChoiceAnswers, correctAnswer]
            } else {
                args = [frontRef.current.value, backRef.current.value, mcChecked.toString()]
            }
            createOrEdit === "Create" ? props.createCards(...args) : props.editCard(...args)
        }

        function editMode(localFlashcardNum) {
            // So that if a bad number is passed in, it does not crash
            if (localFlashcardNum < localFlashcards.length) {
                currentFlashcard = localFlashcards[localFlashcardNum];
            }
            else {
                currentFlashcard = localFlashcards[0];
            }
            resetMultipleChoice();
            updateCreateOrEdit("Edit");
            frontRef.current.value = currentFlashcard.front;
            backRef.current.value = currentFlashcard.back;
            updateMcChecked(() => currentFlashcard.multipleChoice === "true");
            addExistingMultipleChoiceOptions("Edit");
        }

        function createMode() {
            resetMultipleChoice();
            updateCreateOrEdit("Create");
            frontRef.current.value = "";
            backRef.current.value = "";
        }

        // Navigation
        function localNextCard() {
            localFlashcardNum = props.next(null, localFlashcardNum);
            currentFlashcard = localFlashcards[localFlashcardNum]
            // Resets values for next card
            resetMultipleChoice();
            editMode(localFlashcardNum);

        }

        function localPrevCard() {
            localFlashcardNum = props.prev(null, localFlashcardNum);
            currentFlashcard = localFlashcards[localFlashcardNum]
            // Resets values for next card
            resetMultipleChoice();
            editMode(localFlashcardNum);
        }

        function editNavigation() {
            if (createOrEdit === "Edit") {
                return (
                    <div className="horizontal-container">
                        <button className="ft-3" onClick={localPrevCard}>{"<"}</button>
                        <button className="ft-3" onClick={localNextCard}>{">"}</button>
                    </div>
                )
            }
        }

        // Multiple choice related functions
        // For controlled input of textarea in OverlayWindowMcOption
        function onMcTextChange(iValue, keyCounter) {
            console.log("onMcTextChange");
            addToMcText(keyCounter, iValue);
        }

        function addToMcText(iKey, iValue = "") {
            console.log("addToMcText");

            // console.log("key", iKey, "type", typeof (iKey), "value", iValue, "type", typeof (iValue))
            console.log(iKey, iValue);
            console.log("before", mcText);

            // It doesn't look like it but this syntax will update the value of an existing property
            updateMcText((prevMcText) => ({ ...prevMcText, [iKey]: iValue.toString() }));
            // let updatedMcText = ({ ...mcText, [iKey]: iValue.toString() });
            // updateMcText(() => updatedMcText);

            // console.log("after", updatedMcText);
            // return updatedMcText;
        }

        function addMcOption(e, keyCounter = mcCounter, newestOptions = mcOptions, initialText = false) {
            console.log("addMcOption")

            // let textDir = mcText;

            // console.log("argNewestText", argNewestText);
            console.log("mcText", mcText);
            console.log(mcText[keyCounter]);
            // console.log("textDir[keyCounter]", textDir[keyCounter]);

            // const textValue = textDir[keyCounter];

            // Updates the array to be the same array (spread) with an extra option on the end
            newestOptions = [...newestOptions, <OverlayWindowMcOption key={keyCounter} counter={keyCounter} deleteMcOption={deleteMcOption} checkAction={() => updateCorrectChecked(() => keyCounter)} textValue={mcText[keyCounter]} onMcTextChange={(e) => { onMcTextChange(e.target.value, keyCounter) }} />]

            // if (initialText) {
            //     console.log("initialText", initialText)
            //     onMcTextChange(initialText, keyCounter)
            // }

            updateMcOptions(() => newestOptions)
            updateMcCounter((mcCounter) => mcCounter + 1);

            return newestOptions;
        }


        function addExistingMultipleChoiceOptions(editMode = createOrEdit) {
            console.log("Func addExistingMultipleChoiceOptions")
            console.log("condition 1", editMode === "Edit" && currentFlashcard.multipleChoice === "true" && currentFlashcard.multipleChoiceAnswers != undefined)
            console.log(editMode)
            console.log(currentFlashcard.multipleChoice === "true");
            console.log(currentFlashcard.multipleChoiceAnswers)
            console.log("condition 2", mcOptions === undefined || mcOptions.length < currentFlashcard.multipleChoiceAnswers.length)
            console.log(mcOptions, mcOptions.length, currentFlashcard.multipleChoiceAnswers.length)

            if (editMode === "Edit" && currentFlashcard.multipleChoice === "true" && currentFlashcard.multipleChoiceAnswers != undefined) {
                if (mcOptions === undefined || mcOptions.length < currentFlashcard.multipleChoiceAnswers.length) {
                    console.log("Inside IF of addExistingMultipleChoiceOptions")
                    resetMultipleChoice();
                    updateMcChecked(() => true);

                    newestOptions = [];
                    existingAnswers = currentFlashcard.multipleChoiceAnswers;

                    // can't rely on state
                    let tempCounter = mcCounter;
                    for (let i in existingAnswers) {
                        console.log(tempCounter)
                        addToMcText(tempCounter, existingAnswers[i]["mca"]);
                        newestOptions = addMcOption(null, tempCounter, newestOptions, existingAnswers[i]["mca"]);
                        tempCounter += 1;
                    }

                    updateMcCounter(() => tempCounter);

                    // console.log(newestOptions);
                    // return newestOptions
                }
            }
        }

        function resetMultipleChoice() {
            updateMcOptions(() => []);
            updateMcCounter(() => 0);
            updateMcText(() => ({}))
            updateMcChecked(() => false);
            updateCorrectChecked(() => false)
        }

        // Delete an option based on index
        function deleteMcOption(location) {
            // Remove from options
            const optionArr = optionsRef.current.filter(item => item["key"] != location)
            updateMcOptions(optionArr);

            // Remove from mcText
            const textArr = { ...mcText }
            delete textArr.location
            updateMcText(() => textArr);
            // console.log("Just deleted, new object:", mcText);
        }

        function addMcControls() {
            if (mcChecked) {
                if (currentFlashcard.multipleChoiceAnswers != undefined) {
                    existingAnswers = currentFlashcard.multipleChoiceAnswers;
                    addExistingMultipleChoiceOptions();
                }

                console.log(mcText);
                // let textValue = mcText && mcText.length > 1 ? mcText[keyCounter] : ""
                // console.log(existingAnswers.length, mcCounter, createOrEdit, mcCounter);
                if (existingAnswers.length < 2 && mcCounter < 1 || createOrEdit === "Create" && mcCounter < 1) {
                    // Negative numbers to fix an issue where the latest state was not displaying. I think because the keys were the same it did not update.
                    newestOptions = addMcOption(null, -1, newestOptions);
                    newestOptions = addMcOption(null, -2, newestOptions);
                }

                return (
                    <>
                        <p className="text-white ft-1 allign-left" >Check the button of the correct answer</p>
                        <button className="ft-3 overlay-button responsive-width self-center" onClick={addMcOption}>Add option</button>
                        {getNewestOptions()}
                    </>
                )
            }
        }

        function checkedMc(e) {
            updateMcChecked(e.target.checked)
            addExistingMultipleChoiceOptions();
        }


        // UI functions
        function deleteButtonIfEdit() {
            if (createOrEdit === "Edit") {
                return (
                    <button className="ft-3 responsive-width self-center" onClick={localDeleteCard}>Delete</button>
                )
            }
        }

        function localDeleteCard() {
            // console.log("delete card flashnum", localFlashcardNum);
            const deleteReturn = props.deleteCard(localFlashcardNum, localFlashcards);
            localFlashcardNum -= 1;
            // Not false (Delete happened)
            if (deleteReturn) {
                localFlashcards = deleteReturn;
                localNextCard();
            }
        }

        function getNewestOptions() {
            return newestOptions;
        }

        return (
            <>
                <div className="horizontal-container">
                    <button className="ft-3" onClick={createMode}>Create</button>
                    <span className="text-white ft-3"> | </span>
                    <button className="ft-3" onClick={() => editMode(localFlashcardNum)}>Edit</button>
                </div>

                <div className="overlay-input-section">
                    <label className="text-white ft-3">Front</label>
                    <textarea className="ft-3 overlay-textarea" id="create-front-input" ref={frontRef}></textarea>

                    <label className="text-white ft-3">Back</label>
                    <textarea className="ft-3 overlay-textarea" id="create-back-input" ref={backRef}></textarea>

                    {/* adds navigation for when in edit mode */}
                    {editNavigation()}

                    {/* edit mode button for deleting card */}
                    {deleteButtonIfEdit()}

                    <div className="horizontal-container">
                        <label className="text-white ft-3" htmlFor="mc-checkbox">Multiple choice?</label>
                        <input type="checkbox" id="mc-checkbox" checked={mcChecked} onChange={checkedMc} className="wh-1 overlay-checkbox" />
                    </div>

                    {/* adds controls for adding multiple choice questions */}
                    {addMcControls()}

                    <button className="ft-3 overlay-button responsive-width self-center" onClick={callCreateOrEdit}>{createOrEdit}</button>


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