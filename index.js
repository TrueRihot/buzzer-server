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


   // Intervall für den Countdown
   let serverClock = undefined;

   // Intervall funktion
   let clockFn = function () {
       console.log(quizShow.getCurrentTime());
       if (quizShow.getCurrentTime() > 0) {
           quizShow.countDownTick();
           io.emit('tick', {tick: quizShow.getCurrentTime()})
       } else {
           console.log("Der Countdown für Frage" + quizShow.getCurrentQuestion() + " ist beendet.")
           clearInterval(serverClock);
       }
   }





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
            socket.emit('loadQuestion',quizShow.getCurrentQuestion());

            // Disconnect Nachricht
            socket.once('disconnect',function(){
                console.log("Admin " + socket.id + " disconnected.");
                quizShow.deleteAdmin(socket.id);
            });

        }else{

            if (quizShow.getTeambyId(socket.id) || quizShow.getTeambyName(message.name)) {
                // SEND RECONNECT DATA
                // Abfrage um team bei gleichem Namen neue SocketID zu geben.
                console.log("Team mit id : " + socket.id + " und Namen : " + message.name + " wird reconnected");
                socket.emit('loadQuestion',quizShow.getCurrentQuestion());
            }else{
                // Neues Team meldet sich an.
                quizShow.addTeam(new team(message.name, 0, socket.id));
                console.log(socket.id + " wurde angelegt.");
                console.log("-------------------------");
            }
            console.log('Schicke ' + socket.id + 'die aktuelle Frage:');
            console.log(quizShow.getCurrentQuestion().question);
            console.log("-------------------------");


            // Disconnect Nachricht
            socket.once('disconnect',function(){
                console.log("Socket " + socket.id + " disconnected.");
                quizShow.delteTeam(socket.id);
            });


            // loadQuestion -- braucht ein object mit der Frage und wird beim client später displayed
            socket.emit('loadQuestion',quizShow.getCurrentQuestion());
        }
    });


    // Game controls
    //Sichtbarkeit der Frage togglen
    socket.on('toggleVisibility', function(){
        console.log("Frage wird getogglet");
        quizShow.isQuestionVisible() ? quizShow.questionVisible = false : quizShow.questionVisible = true;
        io.emit('loadQuestion', quizShow.getCurrentQuestion());
    });

    // Nächste Frage
    socket.on('nextQuestion',function(){
        console.log("Nächste Frage");
        quizShow.nextQuestion();
        io.emit('loadQuestion', quizShow.getCurrentQuestion());
        io.emit('resetTick');
    });

    // Vorherige Frage
    socket.on('prevQuestion',function(){
        console.log("Vorherige Frage");
        quizShow.prevQuestion();
        io.emit('loadQuestion', quizShow.getCurrentQuestion());
        io.emit('resetTick');
    });

    // Startet den Countdown
    socket.on('startCountdown', function(){
        if (quizShow.getCurrentTime() === 30 ) {
            console.log("Countdown für Frage " + quizShow.getCurrentQuestion().index + " gestartet.");
            console.log("-------------------------");
            serverClock = setInterval(() => {clockFn()}, 1000);
        }
    });

    // Stoppt die clock
    socket.on('stopCountdown', function(){
        console.log("Countdown für Frage " + quizShow.getCurrentQuestion().index + " gestoppt.");
        console.log("-------------------------");
        clearInterval(serverClock);
    });

    // Stoppt und resettet den countdown
    socket.on('resetCountdown', function(){
        console.log("Countdown für Frage " + quizShow.getCurrentQuestion().index + " gestoppt UND resettet.");
        console.log("-------------------------");
        clearInterval(serverClock);
        quizShow.countDownReset();
        io.emit('resetTick');
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
