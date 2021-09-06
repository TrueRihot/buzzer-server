const {quizShow} = require('./quizshow');
const {admin} = require('./admin');
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
    console.log("Ein neuer Client ist connected");
    console.log("Client ID: " + socket.id);
    console.log("-------------------------");
    socket.send("Connection zum Server gestartet");

    socket.on('joinGame', function(message){
        if (message.name == "Administrator") {
            // Admin login
            console.log("Ein Administrator loggt sich ein.");
            console.log("Client ID: " + socket.id);
            console.log("-------------------------");

            // Admin Funktionen Binden an den Socket
            let newAdmin = new admin(socket,io);
            newAdmin.bindAdminFunctions();
            quizShow.addAdmin(newAdmin);

            // Disconnect Nachricht
            socket.once('disconnect',function(){
                console.log("Admin " + socket.id + " disconnected.");
                quizShow.deleteAdmin(socket.id);
            })
        }else{
            if (quizShow.getTeambyId(socket.id)) {
                // SEND RECONNECT DATA
                console.log("reconnect")
            }else{
                // Neues Team meldet sich an.
                quizShow.addTeam(new team(message.name, 0, socket.id));
                console.log(socket.id + " wurde angelegt.");
                console.log("-------------------------");
            }
            console.log('Schicke ' + socket.id + 'die aktuelle Frage:');
            console.log(quizShow.getCurrentQuestion().question);
            console.log("-------------------------");
            // loadQuestion -- braucht ein object mit der Frage und wird beim client später displayed
            socket.emit('loadQuestion',quizShow.getCurrentQuestion());
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
