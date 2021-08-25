const quizShow = {
    // läuft die show schon oder ist noch am launchen
    isRunning : false,
    // speichert die aktuelle Frage
    currentQuestion: 0,
    // speichert Teamdata ab
    activeTeams: [],
    // speichert geladenen Fragens
    questionData : [],

    // Funktion zum laden der Fragedaten
    fetchData: function() {
       console.log('fetching');
       this.questionData = [...this.questionData, {question: "Frage", answer: "Antwort"}]
    },

    // Ein neues Team wird dem Spiel hinzugefügt
    addTeam: function(team) {
        console.log('Adding Team ' + team);
        this.activeTeams = [...this.activeTeams, team];
    },

    

    // return the current question
    getCurrentQuestion: function() {
        return this.questionData[this.currentQuestion]
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