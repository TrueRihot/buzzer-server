import { useRef } from 'react';

export function GameUI (props) {
    const textInput = useRef(null);

    const onClickHandle = () =>{
        let input = textInput.current.html;
        if (input) {
            props.submitSocket({input: input});
        }
    }

    return(
        <>
        <h2>Frage: {props.frage}</h2>
        <form>
            <input type="text" className="input" id="answer" ref={textInput}></input>
            <button type="submit" className="send-answer" onClick={onClickHandle} >Absenden!</button>
        </form>
        </>
    );

}   