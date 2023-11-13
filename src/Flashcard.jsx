import { useState } from "react"
import "./css/Flashcard.css"
import "./css/Utility.css"



export default function Flashcard(props) {
    let [cardSide, updateCardSide] = useState("Front");
    let answerFlip = "";

    function flipCard() {
        cardSide === "Front" ? updateCardSide("Back") : updateCardSide("Front");
    }

    function checkSide() {
        return cardSide === "Front" ? props.question.front : props.question.back;
    }

    function ifMultipleChoice() {
        if (cardSide != "Front") { return }
        let choices = [];

        if (props.question.multipleChoice === "true") {
            answerFlip = " to check answer"

            for (let i in props.question.multipleChoiceAnswers) {
                choices.push(
                    <li key={i}>{props.question.multipleChoiceAnswers[i]["mca"]}</li>
                )
            }

            return (
                <>
                    <span className="divider-line"></span>
                    <ol className="text-white">
                        {choices}
                    </ol>
                </>)
        }

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
                {/* Multiple choices conditionally render based on property within questions json */}

                {ifMultipleChoice()}

                <span className="divider-line"></span>
                <div className="button-group">
                    <div>
                        <button className="prev-button" onClick={props.prev}>{"<"}</button>
                        <button className="next-button" onClick={props.next}>{">"}</button>
                    </div>
                    {/* make this disabled if multiple choice and choice not made */}
                    <button onClick={flipCard} className="">{`Flip card${answerFlip}`}</button>
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