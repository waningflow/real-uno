const { genId } = require('../utils/_');
const { addSocket, getSocket } = require('./socket');
const { joinRoom, findRoom, getRoomData } = require('./room');

const init = (io) => {
  io.on('connection', (socket) => {
    socket.on('create_room', ({ nickName }) => {
      const roomId = genId(5);
      if (findRoom(roomId)) {
        socket.emit('create_room_result', { code: 1, message: 'fail' });
        return;
      }
      socket.join(roomId);
      addSocket(socket, { nickName, roomId });
      joinRoom(socket, roomId);
      const roomData = getRoomData(roomId);
      socket.emit('create_room_result', { code: 0, roomId, roomData });
      console.log('create room:', roomId, 'nickName:', nickName);
    });
    socket.on('join_room', ({ roomId, nickName }) => {
      if (!findRoom(roomId)) {
        socket.emit('join_room_result', { code: 1, message: 'not fount' });
        return;
      }
      socket.join(roomId);
      addSocket(socket, { nickName, roomId });
      joinRoom(socket, roomId);
      const roomData = getRoomData(roomId);
      socket.emit('join_room_result', { code: 0, roomId, roomData });
      socket.to(roomId).emit('update_room', { code: 0, roomData });
      console.log('join room:', roomId, 'nickName:', nickName);
    });
    socket.on('message', (data) => {
      const { nickName, roomId } = getSocket(socket);
      const { msg } = data;
      const msgId = genId(10);
      io.in(roomId).send({ nickName, roomId, msg, msgId });
      console.log('message come', 'roomId:', roomId, 'nickName:', nickName, 'msg:', msg);
    });
  });
};

module.exports = {
  init,
};
