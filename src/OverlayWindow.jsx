import "./css/OverlayWindow.css"
import "./css/Utility.css"

export default function OverlayWindow(props) {

    function setOverlayContent() {
        if (props.overlayMode === "create") {
            return (
                <>
                    <p className="text-white medium-text">Create a flashcard</p>

                    <div className="overlay-input-section">
                        <label className="text-white medium-text">Front</label>
                        <input className="medium-text"></input>
                        <label className="text-white medium-text">Back</label>
                        <input className="medium-text"></input>
                        <button className="medium-text" onClick={props.createCards}>Create</button>
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