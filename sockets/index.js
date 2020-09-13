const { genId } = require('../utils/_');

const socketMap = new WeakMap();

const init = (io) => {
  io.on('connection', (socket) => {
    socket.on('create_room', ({ nickName }) => {
      const roomId = genId(5);
      socket.join(roomId);
      // console.log(socket);
      // console.log(roomId);
      socket.emit('create_room_success', roomId);
      socketMap.set(socket, { nickName, roomId });
      console.log('create room:', roomId);
    });
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });
    socket.on('message', (data) => {
      const { nickName, roomId } = socketMap.get(socket);
      const { msg } = data;
      const msgId = genId(10);
      io.in(roomId).send({ nickName, roomId, msg, msgId });
      console.log('message come', 'room id:', roomId, 'nick name:', nickName, 'msg:', msg);
    });
  });
};

module.exports = {
  init,
};
