import React from 'react';
import {Answers} from './answers';
import { Overlay } from './overlay';

export class AdminUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false
        }
        this.renderAnswers = this.renderAnswers.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.showAuswertung = this.showAuswertung.bind(this)
    }


    renderAnswers(){
        let antworten = this.props.answers;
        let ret = []
        let that = this;
        antworten.forEach(function(answer){ 
            ret.push(<Answers answer={answer} adminToolEmitter={that.props.adminToolEmitter}/>)
        });
        return ret
    }

    toggleOverlay(){
        if (this.state.showOverlay) {
            this.setState({showOverlay: false})
        }else{
            this.setState({showOverlay: true})
        }
    }

    showAuswertung(){
        this.props.adminToolEmitter("showData");
        this.toggleOverlay();
    }

    render() {
        return(
            <>
                <h2>Adminkonsole</h2>
                <p>Frage Nummer: {this.props.fragenIndex + 1} <strong>{this.props.frage}</strong>
                </p>
                <div>{this.props.tick}</div>
                <p>{this.props.showQuestion ? <strong>Die Frage ist aktuel SICHTBAR</strong> : <strong>Die Frage ist aktuell NICHT sichtbar</strong>}</p>

                <div className="flex flex-spacing flex-wrap control-element">
                    <button onClick={() => this.props.adminToolEmitter("toggleVisibility")}>
                        {this.props.showQuestion ? "Frage verstecken" : "Frage zeigen"}
                    </button>

                    <div>
                        <button onClick={() => this.props.adminToolEmitter("startCountdown")} className={!this.props.showQuestion ? "disabled" : ""}>Countdown Starten</button>
                        <div className="tooltip">Die Frage ist noch nicht Sichtbar!</div>
                    </div>
                    <button onClick={() => this.props.adminToolEmitter("stopCountdown")}>Countdown stoppen</button>
                    <button onClick={() => this.props.adminToolEmitter("resetCountdown")}>Stoppt und resettet den Countdown</button>
                </div>
                <div className="flex flex-spacing flex-wrap control-element">
                    <button onClick={() => this.props.adminToolEmitter('prevQuestion')}>Vorherige Frage</button>
                    <button onClick={() => this.props.adminToolEmitter("nextQuestion")}>Nächste Frage</button>
                </div>

                <div className="flex flex-spacing flex-wrap control-element">
                    <button onClick={() =>this.props.adminToolEmitter("saveData")}>Speichern</button>
                    <button onClick={() => this.showAuswertung()}>Auswerten</button>
                </div>

                <div className="control-element">
                    <h3>Antworten</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Antwort</th>
                                <th>Tick</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderAnswers()}
                        </tbody>
                    </table>
                </div>
           
                <Overlay data={this.props.auswertung} clickhandle={this.toggleOverlay} showOverlay={this.state.showOverlay}/>

            </>
        )
    }

}