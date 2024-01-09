import "./css/Utility.css"
import "./css/Flashcard.css"

export default function (props) {
    function radioChecked(counter) {
        props.checkAction(counter)
    }

    return (
        <div className="horizontal-container">
            <input className="mc-answer-option self-center " onClick={() => radioChecked(props.counter)} type="radio" name="mc-option-radio"></input>
            <p>{props.iText}</p>
        </div>
    )
}
