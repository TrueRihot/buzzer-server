import React from 'react';

export class GameUI extends React.Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef(null);
        this.onClickHandle = this.onClickHandle.bind(this);
    }
    

    onClickHandle = (event) =>{
        event.preventDefault();
        let input = this.textInput.current.value;
        if (input) {
            this.props.submitHandler({antwort: input});
        }
    }
    
    render(){
        return(
            <>
            <h2>Frage:</h2>
            {this.props.showQuestion ? <strong>{this.props.frage}</strong> : <strong></strong>}
            <div>{this.props.tick}</div>
            <form>
                <input type="text" className="input" id="answer" ref={this.textInput}></input>
                <button type="submit" className={ `send-answer ${this.props.tick === 0 || !this.props.showQuestion ? "disabled" : ""}`}  onClick={this.onClickHandle} >Absenden!</button>
            </form>
            </>
        );
}
}   