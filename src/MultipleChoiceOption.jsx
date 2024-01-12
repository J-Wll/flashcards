import "./css/Utility.css"
import "./css/Flashcard.css"

export default function (props) {
    function radioChecked(counter) {
        props.checkAction(counter)
    }

    let startChecked = false;
    if(props.counter===1){
        startChecked = true;
    }

    return (
        <div className="horizontal-container-njs">
            <input className="wh-1 self-center " defaultChecked={startChecked} onClick={() => radioChecked(props.counter)} type="radio" name="mc-option-radio"></input>
            <p>{props.iText}</p>
        </div>
    )
}
