import "./css/Flashcard.css"

function conditionalReturn(props) {
    console.log(props)
    if (props.inactive) {
        return (<div className={`flashcard inactive`}></div>)
    }
    else { return (<div className={`flashcard active ${props.extraClasses}`}>
        <p className="text-white">This is a sample question?</p>
    </div>) }
}

export default function Flashcard(props) {
    return (
        conditionalReturn(props)

    )
}