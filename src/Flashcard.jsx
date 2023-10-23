import "./css/Flashcard.css"

function conditionalReturn(props) {
    return (<div className={`flashcard ${props.extraClasses}`}>

    </div>)
}

export default function Flashcard(props) {
    return (
        conditionalReturn(props) 

    )
}