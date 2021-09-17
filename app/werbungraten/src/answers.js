import React, { useState } from 'react';

export function Answers(props) {
    const [isCorrect, toggleCorrect] = useState(props.answer.correct);

    let emitToggle = (input) =>{
        let emit = undefined
        switch (input) {
            case true:
                emit = "answerCorrect"
                break;
        
            default:
                emit = "answerFalse"
                break;
        }
        props.adminToolEmitter(emit,{team: props.answer.team, answerIndex: props.answer.questionIndex});
        toggleCorrect(input);
    }

    return (<li>{props.answer.team} =&gt; {props.answer.antwort} {props.answer.tick} {isCorrect ? "Richtig" : "Falsch"}
    <button onClick={() => emitToggle(true)}>Richtig</button>
    <button onClick={() => emitToggle(false)}>Falsch</button> </li>
    )
}