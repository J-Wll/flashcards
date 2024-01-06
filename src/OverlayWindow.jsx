import "./css/OverlayWindow.css"
import "./css/Utility.css"
import { useRef, useState } from "react";

export default function OverlayWindow(props) {

    // From the create cards button
    function createEditCardWindow() {
        const frontRef = useRef(null)
        const backRef = useRef(null)
        let [createOrEdit, updateCreateOrEdit] = useState("Create")
        let [c, r] = useState(0)


        function getExistingFront() {
            if (createOrEdit === "Edit") {
                return props.question.front;
            }
            return ""
        }

        function getExistingBack() {
            if (createOrEdit === "Edit") {
                return props.question.back;
            }
            return ""
        }


        let existingFront = getExistingFront();
        let existingBack = getExistingBack();

        return (
            <>
                <div className="horizontal-container">
                    <button className="ft-3" onClick={() => updateCreateOrEdit("Create")}>Create</button>
                    <span className="text-white ft-3"> | </span>
                    <button className="ft-3" onClick={() => updateCreateOrEdit("Edit")}>Edit</button>
                </div>
                {/* <p className="text-white ft-3">Create a flashcard</p> */}
                <div className="overlay-input-section">
                    <label className="text-white ft-3">Front</label>
                    <textarea className="ft-3" id="create-front-input" ref={frontRef} defaultValue={getExistingFront()}></textarea>

                    <label className="text-white ft-3">Back</label>
                    <textarea className="ft-3" id="create-back-input" ref={backRef} defaultValue={getExistingBack()}></textarea>

                    <div className="horizontal-container">
                        <label className="text-white ft-3" htmlFor="mc-checkbox">Multiple choice?</label>
                        <input type="checkbox" id="mc-checkbox" />
                    </div>

                    <button className="ft-3" onClick={() => props.createCards(frontRef.current.value, backRef.current.value)}>{createOrEdit}</button>
                </div>
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