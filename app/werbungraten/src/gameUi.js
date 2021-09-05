import { useRef } from 'react';

export function GameUI (props) {
    const textInput = useRef(null);

    const onClickHandle = (event) =>{
        event.preventDefault();
        let input = textInput.current.value;
        if (input) {
            props.submitHandler({antwort: input});
        }
    }

    return(
        <>
        <h2>Frage:</h2>
        {props.showQuestion ? <strong>{props.frage}</strong> : <strong></strong>}
        <form>
            <input type="text" className="input" id="answer" ref={textInput}></input>
            <button type="submit" className="send-answer" onClick={onClickHandle} >Absenden!</button>
        </form>
        </>
    );

}   