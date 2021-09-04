const {quizShow} = require('./quizshow');
const {team} = require('./team');
const express = require('express');
const app = express();
const Cors = require('cors');

app.use( express.json() );
app.use(Cors({
    origin: "*"
}));

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
    socket.send("Connection zum Server gestartet");

    socket.on('joinGame', function(message){
        quizShow.addTeam(new team(message.name, 0, socket.id));
        console.log(socket.id + " is Joining the current Game");
    });
});

app.post("/newteam/:name",(req, res) => {
    const name = req.params.name;
    console.log("Füge " + name + " den Teams hinzu");
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
