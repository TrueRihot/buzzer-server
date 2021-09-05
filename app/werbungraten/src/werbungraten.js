import React from 'react';
import {io} from 'socket.io-client';
import { GameUI } from './gameUi';

export class Werbungraten extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitialized: false,
            teamName: "",
            isIngame: true,
            error: "",
            currentQuestion: {}
        };
        this.input = React.createRef();
        this.submitHandler = this.submitHandler.bind(this);
        this.throwError = this.throwError.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.submitSocket = this.submitSocket.bind(this);

        this.socket = undefined;
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
                    that.setState({teamName: current});
                    that.setState({error: ""})
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
        this.setState({error: throwThis});
    }

    // creating the websocket connection
    websocketConnect() {
        const that = this;
        // Create WebSocket connection.
        console.log("connecting to websocket")
        that.socket = io("http://localhost:8080");

        // Connection opened
        that.socket.on('connect', function () {
            console.log("Joining Game")
            that.joinGame();
            that.setState({isInitialized: true});
            that.socket.on("loadQuestion",function(message) {
                that.setState({currentQuestion: message})
            });
        });

    }

    joinGame() {
        const that = this;
        if (this.socket) {
            try {
                this.socket.emit('joinGame',{name:that.state.teamName});
            }catch (e) {
                this.throwError(e);
            }
        }else{
            return
        }
    }

    submitSocket(answer) {
        this.socket.emit('submit',answer);
    }

    render() {
        const {isInitialized, teamName, isIngame, error, currentQuestion} = this.state;


        if (!isInitialized) {
            return(
            <>
            <h1>Willkommen bei Werbungraten</h1>
            <form>
                <input type="text" placeholder="Teamname" ref={this.input}></input>
                <div>{error ? error : ""}</div>
                <button type="submit" onClick={this.submitHandler}>GO!</button>
            </form>
            </>
            )
        }else{
            if (!isIngame) {
            return(
                <>
                    <h1>Hallo {teamName}!</h1>
                    {!isIngame ? <p>Geht sofort los</p> : <p></p>}
                </>
            )

            }else{
                console.log(currentQuestion)
               return( 
               <>
               <h1>Team: {teamName}!</h1>
               <GameUI frage={currentQuestion.question} submitHandler={this.submitSocket}></GameUI>
               </>
               )
            }

        }
    }
}