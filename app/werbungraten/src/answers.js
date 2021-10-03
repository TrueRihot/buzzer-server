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

    return (
    <tr key={props.answer.team}>
        <td>{props.answer.team}</td>
        <td>{props.answer.antwort}</td>
        <td>{props.answer.tick}</td>
        <td>{isCorrect ? "Richtig" : "Falsch"}</td>
        <td>
            <button onClick={() => emitToggle(true)} className="result-button">Richtig</button>
            <button onClick={() => emitToggle(false)}className="result-button">Falsch</button>
        </td>
     </tr>
    )
}