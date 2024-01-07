import "./css/OverlayWindow.css"
import "./css/Utility.css"

import OverlayWindowMcOption from "./OverlayWindowMcOption.jsx"

import { useRef, useState } from "react";

export default function OverlayWindow(props) {

    // From the create cards button
    function createEditCardWindow() {
        const frontRef = useRef(null);
        const backRef = useRef(null);
        const [mcChecked, updateMcChecked] = useState(false);
        const [mcOptions, updateMcOptions] = useState([]);
        const [mcCounter, updateMcCounter] = useState(0);
        let [createOrEdit, updateCreateOrEdit] = useState("Create")

        function callCreateOrEdit() {
            const args = [frontRef.current.value, backRef.current.value, mcChecked.toString()]
            createOrEdit === "Create" ? props.createCards(...args) : props.editCard(...args)
        }

        function editMode() {
            updateCreateOrEdit("Edit");
            frontRef.current.value = props.flashcardContent.front;
            backRef.current.value = props.flashcardContent.back;
        }

        function createMode() {
            updateCreateOrEdit("Create");
            frontRef.current.value = "";
            backRef.current.value = "";
        }

        function nextCard() {
            props.next();
            editMode();
        }

        function prevCard() {
            props.prev();
            editMode();
        }

        function editNavigation() {
            if (createOrEdit === "Edit") {
                return (
                    <div className="horizontal-container">
                        <button className="ft-3" onClick={nextCard}>{"<"}</button>
                        <button className="ft-3" onClick={prevCard}>{">"}</button>
                    </div>
                )
            }
        }

        function addMcOption() {
            updateMcOptions([...mcOptions, <OverlayWindowMcOption key={mcCounter} counter={mcCounter} />])
            updateMcCounter(mcCounter + 1);
        }

        function addMcControls() {
            if (mcChecked) {
                return (
                    <>
                        <div className="horizontal-container">
                            <label className="text-white ft-3 allign-left" id="correct-label">Correct</label>
                            <button className="ft-3 overlay-button responsive-width self-center" onClick={addMcOption}>Add option</button>
                        </div>
                        {mcOptions}
                    </>
                )
            }
        }

        return (
            <>
                <div className="horizontal-container">
                    <button className="ft-3" onClick={createMode}>Create</button>
                    <span className="text-white ft-3"> | </span>
                    <button className="ft-3" onClick={editMode}>Edit</button>
                </div>

                <div className="overlay-input-section">
                    <label className="text-white ft-3">Front</label>
                    <textarea className="ft-3 overlay-textarea" id="create-front-input" ref={frontRef}></textarea>

                    <label className="text-white ft-3">Back</label>
                    <textarea className="ft-3 overlay-textarea" id="create-back-input" ref={backRef}></textarea>

                    <div className="horizontal-container">
                        <label className="text-white ft-3" htmlFor="mc-checkbox">Multiple choice?</label>
                        <input type="checkbox" id="mc-checkbox" checked={mcChecked} onChange={e => (updateMcChecked(e.target.checked))} className="wh-1 overlay-checkbox" />
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
                <p className="text-white ft-2">The program automatically saves your changes to local storage</p>
                <p className="text-white ft-2">To fully save your flashcards, click the save button and download the JSON file</p>
                <p className="text-white ft-2">This JSON file can then be used through the load button, allowing you to have multiple sets of cards</p>
                <button className="ft-2">Load default set of flashcards (Programming related)</button>
                <button className="ft-2">Load empty set of flashcards</button>
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

    function setOverlayContent() {
        switch (props.overlayMode) {
            case "create":
                return createEditCardWindow();
            case "save":
                break;
            case "load":
                break;
            case "stats":
                return statsWindow();
            case "settings":
                break;
            case "about":
                return aboutWindow();
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div className="background-blur" />

            <div className="overlay-window responsive-width">
                <button className="overlay-close ft-3" onClick={props.resetOverlay}>X</button>
                {setOverlayContent()}
            </div>
        </>
    )
}