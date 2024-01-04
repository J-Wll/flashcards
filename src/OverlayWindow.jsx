import "./css/OverlayWindow.css"
import "./css/Utility.css"
import { useRef } from "react";

export default function OverlayWindow(props) {

    function setOverlayContent() {
        const frontRef = useRef(null)
        const backRef = useRef(null)

        if (props.overlayMode === "create") {
            return (
                <>
                    <p className="text-white medium-text">Create a flashcard</p>

                    <div className="overlay-input-section">
                        <label className="text-white medium-text">Front</label>
                        <input className="medium-text" id="create-front-input" ref={frontRef}></input>
                        <label className="text-white medium-text">Back</label>
                        <input className="medium-text" id="create-back-input" ref={backRef}></input>
                        <button className="medium-text" onClick={() => props.createCards(frontRef.current.value, backRef.current.value)}>Create</button>
                    </div>

                </>
            )
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