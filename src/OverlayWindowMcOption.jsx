
import "./css/OverlayWindow.css"
import "./css/Utility.css"


export default function OverlayWindowMcOption(props) {
    function closeButton() {
        if (props.counter > 1) {
            return (
                <button className="ft-3 mcoption-close" onClick={() => props.deleteMcOption(props.counter)}>X</button>
            )
        }
    }

    function radioChecked(e) {
        props.checkAction()
    }

    // useEffect(() => console.log(props.correctChecked), [props.correctChecked])

    let firstChecked = false;
    if (props.counter == 0) {
        firstChecked = true;
    }

    // console.log("Counter", props.counter, "TextValue", props.textValue);

    return (
        <div className="horizontal-container ">
            <input className="mcoption-radio" type="radio" name="mc-option-radio" onClick={radioChecked} defaultChecked={firstChecked}></input>
            <textarea className="ft-3 overlay-textarea mcoption-textarea" onChange={(e) => { props.onMcTextChange(e) }} value={props.textValue}></textarea>
            {closeButton()}
        </div>
    )
}