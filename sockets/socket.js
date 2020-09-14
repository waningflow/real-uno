const sockets = require('.');

const socketMap = new WeakMap();

const addSocket = (socket, data) => {
  socketMap.set(socket, data);
};

const getSocket = (socket) => {
  return socketMap.get(socket);
};

module.exports = {
  addSocket,
  getSocket,
};
