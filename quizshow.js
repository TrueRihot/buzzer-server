const fs = require('fs');

let quizShow = {
    // läuft die show schon oder ist noch am launchen
    isRunning : false,
    // Boolean ob die aktuelle Frage schon gezeigt wird oder nicht die
    questionVisible: false,
    // Countdownzeit für die aktuelle Frage
    questionCountdown: 30,
    // speichert die aktuelle Frage
    currentQuestion: 0,
    // speichert Teamdata ab
    activeTeams: [],
    // speichert geladenen Fragens
    questionData : [],
    // speichert admin connections
    admins: [],

    // Funktion zum laden der Fragedaten
    fetchData: function () {
        console.log('Fetching game data ....');
        fs.readFile('./gameFiles/savedGameData.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }

            try {
                this.questionData = JSON.parse(data)
            } catch (error) {
                console.log("Konnte keine Game Data laden, lade dummy Daten");
                console.log(error);
                this.questionData = [...this.questionData, { question: "Das ist eine tolle Frage", answer: "Antwort" }, { question: "Das ist die Zweite Frage", answer: "Antwort2" }];
                // Gibt den aktuellen Fragen Ids anhand der array position.
                this.questionData = this.questionData.map(function (value, index) {
                    value.index = index;
                    value.answers = [];
                    return value;
                });
            }

            console.log(this.questionData.length + " Fragen geladen");
            console.log("Fetching done");
        })
    },

    saveData: function() {
        const dataString = JSON.stringify(this.questionData);
        fs.writeFile("./gameFiles/savedGameData.txt",dataString,(err)=>{
            if(err){
                console.log('error   ' + err)
            }else{
                console.log("JSON data is saved.");
            }
            
        });
    },

    // Ein neues Team wird dem Spiel hinzugefügt
    addTeam: function(newTeam) {    
        // Check ob es schon ein Team im Feld mit dem Namen gibt.
        var obj = this.activeTeams.find(o => o.name === newTeam.name);
        if (!obj) {
            // gibt dem Team eine unique ID anhand der Platzierung im Team array
            newTeam.id = this.activeTeams.length;
            // fügt das neue Team dem Array hinzu
            this.activeTeams.push(newTeam);
            console.log(this.activeTeams);
        }
    },
    // fügt einen neuen Admin zu Liste hinzu
    addAdmin : function(newAdmin) {
        const mappedArray =  this.admins.map(function(val){return val.socket.id});
        if (!mappedArray.includes(newAdmin.socket)) {
            let inputAdmin = {
                socket: newAdmin.socket.id,
                id: this.admins.length
            }
            this.admins = [...this.admins, inputAdmin];
        }
    },

    delteTeam: function(team){
        //TODO sollte entweder nicht gelöscht werden oder die Punkte müssen wo anders gespeichert werden.
        const oldTeams = this.activeTeams;
        const teamSockets = oldTeams.map(function(val){ return val.socket.id})
        const i = teamSockets.indexOf(team);
        this.activeTeams.splice(i, 1);
    },

    deleteAdmin: function(admin) {
        const oldAdmins = this.admins;
        const adminSockets = oldAdmins.map(function(val){ return val.socket.id})
        const i = adminSockets.indexOf(admin);
        this.admins.splice(i, 1);
    },

    // return the current question
    getCurrentQuestion: function() {
        var retObj = this.questionData[this.currentQuestion];
        retObj.questionVisible = this.questionVisible;
        return retObj
    },

    // Gibt team mit gegebener socketId zurück
    // Wenn es mehrere Teams geben sollte (was eigentlich nicht geplant ist)
    // oder es kein Team mit der Id gibt wird false zurückgegeben.
    getTeambyId: function(id) {
        const teams = this.activeTeams;
        let team = teams.map(function(value){
           return value.socket = id ? true : false;
        });
        if (team.length > 0) {
            return team[0];
        }
        return false
    },

    // Gibt team mit gegebenem Namen zurück
    getTeambyName: function(name) {
        const teams = this.activeTeams;
        let team = teams.map(function(value){
           return value.name = name ? true : false;
        });
        if (team.length > 0) {
            return team[0]
        }
    },

    getTeamNameById: function(id) {
        var obj = this.activeTeams.find(o => o.socket === id);
        return obj.name
    },

    // Clock für die Ticks wird in index.js ausgeführt, für den Socket
    countDownTick: function(){
        if (this.questionCountdown == 0) {
            return false
        }
        this.questionCountdown--;
    },

    // Resetet die Countdownzeit zu 30
    countDownReset: function(){
        this.questionCountdown = 30;
    },

    // Gibt die aktuelle CountdownClock wieder
    getCurrentTime: function(){
        return this.questionCountdown;
    },

    // Bekommt den aktuellen Fragenstatus
    isQuestionVisible(){
        return this.questionVisible;
    },

    nextQuestion: function(){
        if (this.questionData.length > this.currentQuestion + 1 ) {
            this.questionVisible = false;
            this.currentQuestion++;
            this.questionCountdown = 30;
            return
        }
        console.log(this.currentQuestion + " ist bereits die letzte Frage.")
        return false
    },

    prevQuestion: function(){
        if (this.currentQuestion >= 1) {
            this.questionVisible = false;
            this.currentQuestion--;
            this.questionCountdown = 30;
            return
        }
        console.log(this.currentQuestion + " ist die erste Frage.")
        return false
    },

    getAuswertung: function(){
        //speichert die Punkte aller Teams
        let ret = [];
        let answers = [];

        this.questionData.forEach(function(value, key){
            if (value.answers.length > 0) {
                answers.push(value.answers)
            }
        });

        answers.forEach(function (value) {
            value.forEach(element => {
                if (element.correct) {
                    let key = element.team;
                    if (!ret.some(e => e.team === key)) {
                        ret.push({
                            team: key,
                            points: element.tick,
                            correct: element.correct
                        })
                    } else {
                        ret.find(x => x.team === key).points += element.tick;
                    }
                }
            });
        });
        return ret
    },

    // Methode falls alle bereit sind und gestartet wird
    startTheShow: function() {
        console.log('The show is beeing started');
        if(!this.isRunning && this.activeTeams.length > 0 && questionData.length > 0) {
            this.isRunning = true;
        }else {
            console.log('OOOOps. Entweder läuft die Show schon oder etwas mit den Fragedaten bzw. Teamdaten ist falsch')
        }
    }
};

module.exports = {quizShow};