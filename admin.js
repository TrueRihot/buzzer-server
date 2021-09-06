class admin {
    constructor(socket, server) {
        this.socket = socket;
        this.socketServer = server;
    }

    sendAdminUi(){
        this.socket.emit('loadAdminUI');
    }

    bindAdminFunctions () {
        this.sendAdminUi();
    }
}

module.exports = {admin};