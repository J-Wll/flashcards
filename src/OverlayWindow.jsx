import "./css/OverlayWindow.css"
import "./css/Utility.css"
import { useRef } from "react";

export default function OverlayWindow(props) {

    function createCardWindow() {
        const frontRef = useRef(null)
        const backRef = useRef(null)
        return (
            <>
                <p className="text-white ft-3">Create a flashcard</p>
                <div className="overlay-input-section">
                    <label className="text-white ft-3">Front</label>
                    <input className="ft-3" id="create-front-input" ref={frontRef}></input>
                    <label className="text-white ft-3">Back</label>
                    <input className="ft-3" id="create-back-input" ref={backRef}></input>
                    <button className="ft-3" onClick={() => props.createCards(frontRef.current.value, backRef.current.value)}>Create</button>
                </div>
            </>
        )
    }

    function statsWindow(){

        return (
            <>
            <p>Stats</p>
            </>
        )
    }

    function setOverlayContent() {
        switch (props.overlayMode) {
            case "create":
                return createCardWindow();
                break;
            case "save":
                break;
            case "load":
                break;
            case "stats":
                return statsWindow();
                break;
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

            <div className="overlay-window">
                <button className="overlay-close" onClick={props.resetOverlay}>X</button>
                {setOverlayContent()}
            </div>
        </>
    )
}