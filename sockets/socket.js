const socketMap = new WeakMap();

const addSocket = (socket, data) => {
  socketMap.set(socket, data);
};

const getSocket = (socket) => {
  return socketMap.get(socket);
};

const deleteSocket = (socket) => {
  socketMap.delete(socket);
};

module.exports = {
  addSocket,
  getSocket,
  deleteSocket
};
