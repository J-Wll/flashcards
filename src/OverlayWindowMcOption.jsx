import "./css/OverlayWindow.css"
import "./css/Utility.css"

export default function OverlayWindowMcOption() {

    return (
        <div className="horizontal-container ">
            <textarea className="ft-3 overlay-textarea mcOption-textarea"></textarea>
            <button className="ft-3 mcOption-close" >X</button>
        </div>
    )
}