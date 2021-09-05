const quizShow = {
    // läuft die show schon oder ist noch am launchen
    isRunning : false,
    // speichert die aktuelle Frage
    currentQuestion: 0,
    // speichert Teamdata ab
    activeTeams: [],
    // speichert geladenen Fragens
    questionData : [],
    // experimantal socket promise
    sockets: [],

    // Funktion zum laden der Fragedaten
    fetchData: function() {
       console.log('Fetching game data ....');
       this.questionData = [...this.questionData, {question: "Frage", answer: "Antwort"}]
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
        }else{
            throw("Es gibt bereits ein Team mit diesem Namen")
        }
        
    },

    // return the current question
    getCurrentQuestion: function() {
        return this.questionData[this.currentQuestion]
    },

    getTeambyId: function(id) {
        const teams = this.activeTeams;
        let team = teams.map(function(value){
            value.socket = id ? true : false;
        });
        if (team.length > 0) {
            return team[0];
        }
        return false
    },

    getTeams: function() {
        return this.activeTeams
    },

    // Methode falls alle bereit sind und gestartet wird
    startTheShow: function() {
        console.log('The show is beeing started');
        if(!this.isRunning && this.activeTeams.length > 0 && questionData.length > 0) {
            this.isRunning = true;
            fetchData();
        }else {
            console.log('OOOOps. Entweder läuft die Show schon oder etwas mit den Fragedaten bzw. Teamdaten ist falsch')
        }
    }
};

module.exports = {quizShow};