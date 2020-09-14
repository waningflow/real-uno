const { getSocket } = require('./socket');

const roomMap = {};

const joinRoom = (socket, roomId) => {
  let roomData = roomMap[roomId];
  if (!roomData) {
    roomData = { sockets: [], owner: null };
  }
  roomData.sockets.push(socket);
  if (!roomData.owner) {
    roomData.owner = roomData.sockets[0];
  }
  roomMap[roomId] = roomData;
};

const findRoom = (roomId) => {
  return roomMap[roomId];
};

const getRoomData = (roomId) => {
  return roomMap[roomId].sockets.map((s) => {
    let socket = { ...getSocket(s) };
    if (socket.id === roomMap[roomId].owner.id) {
      socket.isOwner = true;
    }
    return socket;
  });
};

module.exports = {
  joinRoom,
  findRoom,
  getRoomData,
};
