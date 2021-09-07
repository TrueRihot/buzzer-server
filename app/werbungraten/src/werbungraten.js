import React from 'react';
import { io } from 'socket.io-client';
import { GameUI } from './gameUi';

export class Werbungraten extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isInitialized: false,
            teamName: "",
            error: "",
            currentQuestion: {},
            questionVisible: false,
            isAdmin: false,
            socket: undefined
        };
        this.input = React.createRef();
        this.submitHandler = this.submitHandler.bind(this);
        this.throwError = this.throwError.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.submitSocket = this.submitSocket.bind(this);
        this.quitHandler = this.quitHandler.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.websocketConnect = this.websocketConnect.bind(this);

        
    }
    

    submitHandler = (e) => {
        //Handling the Login process of the app
        const that = this;
        e.preventDefault();
        let current = this.input.current.value; // getting the value from Ref
        if (current) {
            //Opening a new xhr request to push the team name
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8080/newteam/' + current, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {//Call a function when the state changes.
                if (xhr.readyState === 4 && xhr.status === 200) {
                    //if the team name is avaliable save it to the team name and start the websocket connection for the game
                    that.setState({ teamName: current });
                    that.setState({ error: "" })
                    that.websocketConnect();
                }
                if (xhr.readyState === 4 && xhr.status === 409) {
                    //error handling - if the team exists tell the sad players
                    that.throwError(xhr.responseText);
                }
            }
            xhr.send(current);
        }
    }

    //handy function to throw errors into the error block of the app :)
    throwError = (throwThis) => {
        this.setState({ error: throwThis });
    }

    // creating the websocket connection
    websocketConnect() {
        const that = this;
        // schaut ob es schon einen socket gibt
        if (!that.state.socket) {
            // Create WebSocket connection.
            console.log("connecting to websocket")
            that.state.socket = io("http://localhost:8080");

            // Connection opened
            that.state.socket.on('connect', function () {
                console.log("Joining Game");
                // Dem Spiel beitreten
                that.joinGame();
                // Die Ui wird initialisiert
                that.setState({ isInitialized: true });
                // Wenn eine neue Frage geladen wird, wird sie im state gespeichert.
                that.state.socket.on("loadQuestion", function (message) {
                    that.setState({ currentQuestion: message, questionVisible: message.questionVisible })
                });

                that.state.socket.on('loadAdminUI', function () {
                that.setState({ isAdmin: true })
            });
            });
            // wenn schon eine Connection besteht
        }else if (that.state.socket.connected) {
            that.state.socket.emit('joinGame', { name: that.state.teamName });
            that.setState({ isInitialized: true });
        }
    }

    joinGame() {
        // Schickt die Info, dass dem Spiel gejoined werden will plus den teamnamen.
        const that = this;
        if (this.state.socket) {
            try {
                this.state.socket.emit('joinGame', { name: that.state.teamName });
            } catch (e) {
                this.throwError(e);
            }
        } else {
            return
        }
    }

    submitSocket(answer) {
        // Frage wird abgeschickt zur aktuellen Frage.
        answer.questionIndex = this.state.currentQuestion.index;
        this.state.socket.emit('submit', answer);
    }

    quitHandler() {
        this.setState({
            isInitialized: false,
            teamName: "",
            error: "",
            currentQuestion: {},
            questionVisible: false,
            isAdmin: false
        });
    }

    toggleVisibility() {
        this.state.socket.emit('toggleVisibility');
    }

    render() {
        const { isInitialized, teamName, error, currentQuestion, questionVisible } = this.state;

        // Login screen für das Spiel. Bevor man eingeloggt ist.
        if (!isInitialized) {
            return (
                <>
                    <h1>Willkommen bei Werbungraten</h1>
                    <form>
                        <input type="text" placeholder="Teamname" ref={this.input}></input>
                        <div>{error ? error : ""}</div>
                        <button type="submit" onClick={this.submitHandler}>GO!</button>
                    </form>
                </>
            )
        } else {
            // Dieser Bereich ist dafür wenn man eingeloggt ist und dann wird weiter evaluiert.

            // Wenn man eingeloggt ist aber das Spiel noch nicht gestartet ist, landet man hier. 
            if (currentQuestion === {} ) {
                return (
                    <>
                        <h1>Hallo {teamName}!</h1>
                        <button onClick={this.quitHandler}>X</button>
                        {currentQuestion === {} ? <p>Geht sofort los</p> : <p></p>}
                    </>
                )

            } else {
                // Wenn das Spiel gestartet ist, dann wird die Game UI geladen.
                // frage ist das prop für die aktuelle Frage.
                // Der submithandler wird für die Kommunikation über den Socket übergeben.
                // Show Question steuert, ob die Frage gezeigt wird oder ob noch gewartet wird.
                return (
                    <>
                        {teamName !== "Administrator" ? <h1>Team: {teamName}!</h1> : ""}
                        <button onClick={this.quitHandler}>X</button>
                        <GameUI admin={this.state.isAdmin}
                        frage={currentQuestion.question}
                        submitHandler={this.submitSocket}
                        showQuestion={questionVisible}
                        fragenIndex={currentQuestion.index}
                        toggleVisibility={this.toggleVisibility}></GameUI>
                    </>
                )
            }

        }
    }
}