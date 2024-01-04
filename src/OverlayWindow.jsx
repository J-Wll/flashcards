import "./css/OverlayWindow.css"

export default function OverlayWindow(props) {

    return (
        <>
            <div className="background-blur">

            </div>
            <div className="overlay-window">
                <button className="overlay-close" onClick={props.resetOverlay}>X</button>
                <p className="text-white">{props.overlayMode}</p>
            </div>
        </>
    )
}