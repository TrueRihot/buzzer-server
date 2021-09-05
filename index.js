const {quizShow} = require('./quizshow');
const {team} = require('./team');
const express = require('express');
const app = express();
const Cors = require('cors');

app.use( express.json() );
app.use(Cors({
    origin: "*"
}));

quizShow.fetchData();

const server = require('http').createServer(app);
const Port = 8080;

const io = require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

// getting the sockets.io ready for takeoff
io.on('connection', function connection(socket){
    console.log("-------------------------");
    console.log("Ein neuer Client ist connected");
    console.log("Client ID: " + socket.id);
    console.log("-------------------------");
    socket.send("Connection zum Server gestartet");

    socket.on('joinGame', function(message){
        quizShow.addTeam(new team(message.name, 0, socket.id));
        console.log(socket.id + " is Joining the current Game");
        console.log('Schicke ' + socket.id + 'die aktuelle Frage:');
        console.log(quizShow.getCurrentQuestion());
        // loadQuestion -- braucht ein object mit der Frage und wird beim client später displayed
        socket.emit('loadQuestion',quizShow.getCurrentQuestion());
    });

    socket.on('reconnect', function(message){
        const team = quizShow.getTeambyId(socket.id);

        if (team) {
            // reconnected also muss irgendwie das game zurücksendet werden
            // TODO gleiches wie oben. Eine funktion die dem Team die aktuellen Daten schickt.
        }else{
            socket.send('Beim Reconnecten ist was schief gelaufen. Versuchs doch mal mit einem reload');
            socket.disconnect(true);
        }
        
    });

    socket.on('submit', function(message){
        console.log(message);
    });
});

app.post("/newteam/:name",(req, res) => {
    try{
        res.status(200).send("Das Team darf angelegt werden")
    }catch(err){
        console.log(err)
        res.status(409).send("Das angegebene Team gibt es bereits.")
    }
});


server.listen(Port, () => {
    console.log(`App up and running! Listening on  http://localhost:${Port}`);
});
