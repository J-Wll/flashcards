import { useState, useEffect } from "react"
import "./css/Flashcard.css"
import "./css/Utility.css"



export default function Flashcard(props) {
    if (props.inactive) {
        return (<button onClick={props.onClick} className={`flashcard inactive`}></button>)
    }
    let [cardSide, updateCardSide] = useState("front");
    let [flipClass, updateFlipClass] = useState("notFlipped");
    let [fadeIn, updateFadeIn] = useState("");
    let answerFlip = "";

    function flipCard() {
        flipClass === "notFlipped" ? updateFlipClass("flipped") : updateFlipClass("notFlipped");
        cardSide === "front" ? updateCardSide("back") : updateCardSide("front");
        fadeIn === "" || fadeIn === "fadeIn" ? updateFadeIn("fadeIn2") : updateFadeIn("fadeIn")
    }

    function checkSide() {
        return cardSide === "front" ? props.question.front : props.question.back;
    }

    function ifMultipleChoice() {
        if (cardSide != "front") { return }
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
                    <ol className="text-white medium-text mutliple-choice">
                        {choices}
                    </ol>
                </>)
        }

    }

    return (
        (<div id="active-flashcard" className={`flashcard active ${props.extraClasses} ${flipClass} ${cardSide}`}>
            <div className={`main-group ${flipClass} ${fadeIn}`}>
                {/* Main text of the flashcard, front or back */}
                <p className="text-white medium-text">{checkSide()}</p>

                {/* Multiple choices conditionally render based on property within questions json */}
                {ifMultipleChoice()}
            </div>

            <div className={`button-group ${flipClass}`}>
                <span className="divider-line"></span>
                <div className="">
                    <button className="prev-button medium-text" onClick={props.prev}>{"<"}</button>
                    <button className="next-button medium-text" onClick={props.next}>{">"}</button>
                </div>

                {/* make this button disabled if multiple choice and choice not made */}
                {/* Flip card reveals the answer on the other side, if it's a question with multiple choice it highlights if you got it correct first, green around a correct answer, red around incorrect and green around the correct */}
                <button onClick={flipCard} className={`medium-text`}> {`Flip card${answerFlip}`}</button>
            </div>
        </div>)

    )
}