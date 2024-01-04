import "./css/OverlayWindow.css"

export default function OverlayWindow(props) {

    function setOverlayContent() {
        if (props.overlayMode === "create") {
            return (
                <>
                    <p className="text-white">Create a flashcard</p>

                    <div className="overlay-input-section">
                        <label className="text-white">Front</label>
                        <input></input>
                        <label className="text-white">Back</label>
                        <input></input>
                        <button onClick={props.createCards}>Create</button>
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