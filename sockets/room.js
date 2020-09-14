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

module.exports = {
  joinRoom,
  findRoom,
};
