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

    if (props.admin) {
        return(
            <>
            <h2>Adminkonsole</h2>
            <p>Frage Nummer: {props.fragenIndex + 1} <strong>{props.frage}</strong>
            </p>
            {props.showQuestion ? <strong>Frage ist SICHTBAR</strong> : <strong>Frage ist NICHT Sichtbar</strong>}
            <button onClick={props.toggleVisibility}>
                Frage zeigen
            </button>
            <button>
                Countdown Starten
            </button>
            
            <div>
                <button>Vorherige Frage</button>
                <button>Nächste Frage</button>
            </div>
            </>
        )
        
    }else{
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
}   