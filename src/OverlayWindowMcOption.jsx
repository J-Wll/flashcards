import "./css/OverlayWindow.css"
import "./css/Utility.css"

export default function OverlayWindowMcOption(props) {

    function closeButton() {
        if (props.counter > 1) {
            return (
                <button className="ft-3 mcoption-close" >X</button>
            )
        }
    }
    console.log(props.counter);

    const firstChecked = props.counter === 0 ? true : false;

    return (
        <div className="horizontal-container ">
            <input className="mcoption-radio" type="radio" name="mc-option-radio" defaultChecked={firstChecked}></input>
            <textarea className="ft-3 overlay-textarea mcoption-textarea"></textarea>
            {closeButton()}
        </div>
    )
}