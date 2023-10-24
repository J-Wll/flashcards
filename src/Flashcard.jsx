import "./css/Flashcard.css"

function conditionalReturn(props) {
    // console.log(props)
    if (props.inactive) {
        return (<button onClick={props.onClick} className={`flashcard inactive`}></button>)
    }
    else { return (<div id="active-flashcard" className={`flashcard active ${props.extraClasses}`}>
        <p className="text-white">This is a sample question?</p>
    </div>) }
}

export default function Flashcard(props) {
    return (
        conditionalReturn(props)

    )
}