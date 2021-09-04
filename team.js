class team {
    constructor(name, pkte, socket) {
        this.name = name;
        this.pkte = pkte;
        this.socket = socket;
    }

    addPoints(points) {
        this.pkte = this.pkte + points;
    }

    removePoints(points){
        this.pkte = this.pkte - points;
    }

    getPoints() {
        return points
    }

    getName() {
        return name
    }

    getId() {
        return id
    }
}

module.exports = {team};