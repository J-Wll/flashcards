import "./css/Flashcard.css"

function conditionalReturn(props) {
    // console.log(props)
    if (props.inactive) {
        return (<button onClick={props.onClick} className={`flashcard inactive`}></button>)
    }
    else {
        return (<div id="active-flashcard" className={`flashcard active ${props.extraClasses}`}>
            <p className="text-white">This is a sample question?</p>
            <div className="divider"></div>
            <p className="text-white">Answer here</p>
            <ol className="text-white">
                <li>Multiple choice 1</li>
                <li>Multiple choice 2</li>
                <li>Multiple choice 3</li>
                <li>Multiple choice 4</li>
            </ol>
            <div className="button-group">
                <div>
                <button className="prev-button">Previous</button>
                <button className="next-button">Next</button>
                </div>
                <button className="mt-3">Submit answer</button>
            </div>
        </div>)
    }
}

export default function Flashcard(props) {
    return (
        conditionalReturn(props)

    )
}