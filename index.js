const {quizShow} = require('./quizshow');

// getting express ready for takeoff
const express = require('express');
const app = express();

const Port = 8080;

const Cors = require('cors');
app.use( express.json() );
app.use(Cors({
    origin: "*"
}));


app.listen(Port, () => {
    console.log(`App up and running! Listening on  https://localhost:${Port}`);
    quizShow.fetchData();
});
