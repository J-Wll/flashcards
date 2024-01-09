import { useState, useEffect } from "react"

import MultipleChoiceOption from "./MultipleChoiceOption.jsx";

import "./css/Flashcard.css"
import "./css/Utility.css"



export default function Flashcard(props) {
    const flashcardContent = props.flashcardContent;
    if (props.inactive) {
        return (<button onClick={props.onClick} className={`flashcard inactive`}></button>)
    }
    const [cardSide, updateCardSide] = useState("front");
    const [flipClass, updateFlipClass] = useState("notFlipped");
    const [fadeIn, updateFadeIn] = useState("");
    const [guessChecked, updateGuessChecked] = useState(false);

    // let [mcKey, updateMcKey] = useState(1);
    let answerFlip = "";

    function flipCard() {
        if (cardSide == "front" && flashcardContent.multipleChoice === "true") {
            console.log("MC")
            if (guessChecked === flashcardContent.correctAnswer){
                console.log("CORRECT")
            }
        }

        flipClass === "notFlipped" ? updateFlipClass("flipped") : updateFlipClass("notFlipped");
        cardSide === "front" ? updateCardSide("back") : updateCardSide("front");
        fadeIn === "" || fadeIn === "fadeIn" ? updateFadeIn("fadeIn2") : updateFadeIn("fadeIn")
    }

    function checkSide() {
        return cardSide === "front" ? flashcardContent.front : flashcardContent.back;
    }


    function ifMultipleChoice() {
        if (cardSide != "front") { return }
        let choices = [];

        if (flashcardContent.multipleChoice === "true") {
            answerFlip = " to check answer"

            let tempKey = 1;
            for (let i in props.flashcardContent.multipleChoiceAnswers) {
                choices.push(
                        <MultipleChoiceOption checkAction={(guess) => updateGuessChecked(() => guess)} counter={tempKey} key={tempKey} iText={flashcardContent.multipleChoiceAnswers[i]["mca"]} />
                )
                tempKey+=1;
            }

            console.log(guessChecked);

            return (
                <>
                    <span className="divider-line"></span>
                    <form className="text-white ft-3 mutliple-choice">
                        {choices}
                    </form>
                </>)
        }

    }

    return (
        (<div id="active-flashcard" className={`flashcard active responsive-width ${props.extraClasses} ${flipClass} ${cardSide}`}>
            <div className={`main-group ${flipClass} ${fadeIn}`}>
                {/* Main text of the flashcard, front or back */}
                <p className="text-white ft-3 flashcard-main-text">{checkSide()}</p>

                {/* Multiple choices conditionally render based on property within the flashcard */}
                {ifMultipleChoice()}

                <p className="text-white ft-1 card-indicator">{`< ${props.flashcardNum + 1} / ${props.amountOfFlashcards} >`}</p>
            </div>

            <div className={`button-group ${flipClass}`}>
                <span className="divider-line"></span>
                <div className="horizontal-container">
                    <button className="ft-3" onClick={props.prev}>{"<"}</button>
                    <button className="ft-3" onClick={props.next}>{">"}</button>
                </div>

                {/* make this button disabled if multiple choice and choice not made */}
                {/* Flip card reveals the answer on the other side, if it's a flashcard with multiple choice it highlights if you got it correct first, green around a correct answer, red around incorrect and green around the correct */}
                <button onClick={flipCard} className={`ft-3`}> {`Flip card${answerFlip}`}</button>
            </div>
        </div>)

    )
}