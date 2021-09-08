const quizShow = {
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
    fetchData: function() {
       console.log('Fetching game data ....');
       this.questionData = [...this.questionData, {question: "Das ist eine tolle Frage", answer: "Antwort"}, {question:"Das ist die Zweite Frage", answer: "Antwort2"}];
       // Gibt den aktuellen Fragen Ids anhand der array position.
       this.questionData = this.questionData.map(function(value,index){
           value.index = index;
           return value;
       });
       console.log(this.questionData.length + " Fragen geladen");
    },

    // Ein neues Team wird dem Spiel hinzugefügt
    addTeam: function(newTeam) {
        const mappedArray =  this.activeTeams.map(function(val){return val.name});

        // Check ob es schon ein Team im Feld mit dem Namen gibt.
        if (!mappedArray.includes(newTeam.name)) {
            // gibt dem Team eine unique ID anhand der Platzierung im Team array
            newTeam.id = this.activeTeams.length;
            // fügt das neue Team dem Array hinzu.
            this.activeTeams = [...this.activeTeams, newTeam];
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

    delteTeam: function(){
        //TODO
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

    // gibt alle aktuellen Teams zurückgegeben
    getTeams: function() {
        return this.activeTeams
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
        //TODO Abfrage ob es keine nächste Frage gibt.
        this.questionVisible = false;
        this.currentQuestion++;
        this.questionCountdown = 30;
    },

    prevQuestion: function(){
        //TODO Abfrage ob es keine vorherige Frage gibt
        this.questionVisible = false;
        this.currentQuestion--;
        this.questionCountdown = 30;
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