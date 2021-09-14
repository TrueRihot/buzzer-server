import React from 'react';

export class AdminUI extends React.Component {
    constructor(props) {
        super(props);
        
    }

    renderAnswers(){
        let antworten = this.props.answers;
        let ret = []
        antworten.forEach(function(answer){ 
            ret.push(<li>{answer.team} =&gt; {answer.antwort} {answer.tick}</li>)
        });
        return ret
    }

    render() {
        return(
            <>
            <h2>Adminkonsole</h2>
            <p>Frage Nummer: {this.props.fragenIndex + 1} <strong>{this.props.frage}</strong>
            </p>
            <div>{this.props.tick}</div>
            <p>{this.props.showQuestion ? <strong>Die Frage ist aktuel SICHTBAR</strong> : <strong>Die Frage ist aktuell NICHT sichtbar</strong>}</p>
           
            <button onClick={() => this.props.adminToolEmitter("toggleVisibility")}>
                {this.props.showQuestion ? "Frage verstecken" : "Frage zeigen"}
            </button>
            <div>
            <button onClick={() => this.props.adminToolEmitter("startCountdown")} className={this.props.showQuestion ? "disabled" : ""}>Countdown Starten</button>
            <button onClick={() => this.props.adminToolEmitter("stopCountdown")}>Countdown stoppen</button>
            <button onClick={() => this.props.adminToolEmitter("resetCountdown")}>Stoppt und resettet den Countdown</button>
            </div>
            <div>
                <button onClick={() => this.props.adminToolEmitter('prevQuestion')}>Vorherige Frage</button>
                <button onClick={() => this.props.adminToolEmitter("nextQuestion")}>Nächste Frage</button>
            </div>
            <div>
                <h3>Antworten</h3>
                <ul>{this.renderAnswers()}</ul>
            </div>
            </>
        )
    }

}