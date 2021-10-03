import React from 'react';

export class GameUI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sent: false,
            error: ""
        }
        this.textInput = React.createRef(null);
        this.onClickHandle = this.onClickHandle.bind(this);
    }
    

    onClickHandle = (event) => {
        event.preventDefault();
        this.setState({error: ""})
        if (!this.state.sent && this.props.tick > 0 && this.props.showQuestion) {
            let input = this.textInput.current.value;
            if (input) {
                this.props.submitHandler({ antwort: input });
                this.setState({sent: true})
                this.textInput.current.value = "";
            }
        }else{
            this.setState({error: "Du kannst gerade keine Frage absenden!"})
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.frage !== prevProps.frage) {
            this.setState({sent: false, error: ""});
        }
    }
    
    render(){
        return(
            <>
            <h3>Frage:</h3>
            <div className="question-tick">
                {this.props.showQuestion ? <strong>{this.props.frage}</strong> : <strong></strong>}
                <div className="tick">{this.props.tick}</div>
            </div>
            <form className="flex flex-wrap input-button">
                <input type="text" className="input" id="answer" ref={this.textInput}></input>
                <button type="submit" className={ `send-answer ${this.props.tick === 0 || !this.props.showQuestion || this.state.sent ? "disabled" : ""}`}  onClick={this.onClickHandle} >Absenden!</button>
                <div>{this.state.error}</div>
            </form>
            </>
        );
}
}   