class Sockets {
  constructor() {
    this.socketMap = new WeakMap();
  }

  addSocket = (socket, data) => {
    socketMap.set(socket, data);
  };

  getSocket = (socket) => {
    return socketMap.get(socket);
  };

  deleteSocket = (socket) => {
    socketMap.delete(socket);
  };
}

module.exports = new Sockets();
