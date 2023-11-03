import { useState } from "react"
import "./css/Flashcard.css"
import "./css/Utility.css"



export default function Flashcard(props) {
    let [cardSide, updateCardSide] = useState("Front")

    function flipCard() {
        cardSide === "Front" ? updateCardSide("Back") : updateCardSide("Front");
    }

    function checkSide() {
        return cardSide === "Front" ? props.question.front : props.question.back;
    }

    function ifMultipleChoice() {
        return props.question.multipleChoice === "true" ?
            <ol className="text-white">
                <li>Multiple choice 1</li>
                <li>Multiple choice 2</li>
                <li>Multiple choice 3</li>
                <li>Multiple choice 4</li>
            </ol> : <></>
    }


    function conditionalReturn(props) {
        // console.log(props)
        if (props.inactive) {
            return (<button onClick={props.onClick} className={`flashcard inactive`}></button>)
        }
        else {
            return (<div id="active-flashcard" className={`flashcard active ${props.extraClasses}`}>
                {/* <p className="text-white">{props.question.front}</p> */}
                <p className="text-white">{checkSide()}</p>
                <div className="divider-line"></div>
                {/* Multiple choices conditionally render based on property within questions json */}

                {ifMultipleChoice()}


                <div className="button-group">
                    <div>
                        <button className="prev-button" onClick={props.prev}>{"<"}</button>
                        <button className="next-button" onClick={props.next}>{">"}</button>
                    </div>
                    <button onClick={flipCard} className="">Flip card</button>
                    <p className="text-white">{cardSide}</p>
                    {/* Flip card reveals the answer on the other side, if it's a question with multiple choice it highlights if you got it correct first, green around a correct answer, red around incorrect and green around the correct */}
                </div>
            </div>)
        }
    }

    return (
        conditionalReturn(props)

    )
}