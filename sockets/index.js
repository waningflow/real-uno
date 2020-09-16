const { genId } = require('../utils/_');
const { addSocket, getSocket } = require('./socket');
const { joinRoom, findRoom, getRoomData, removeSocketInRoom } = require('./room');
const socket = require('./socket');
const room = require('./room');

const init = (io) => {
  io.on('connection', (socket) => {
    console.log('connection', socket.id);
    socket.on('create_room', ({ userInfo }) => {
      const roomId = genId(5);
      if (findRoom(roomId)) {
        socket.emit('create_room_result', { code: 1, message: 'fail' });
        return;
      }
      socket.join(roomId);
      addSocket(socket, { userInfo, roomId });
      joinRoom(socket, roomId);
      const roomData = getRoomData(roomId);
      socket.emit('create_room_result', { code: 0, roomId, roomData });
      console.log('create room:', roomId, 'nickName:', userInfo.nickName);
    });
    socket.on('join_room', ({ roomId, userInfo }) => {
      if (!findRoom(roomId)) {
        socket.emit('join_room_result', { code: 1, message: 'not fount' });
        return;
      }
      socket.join(roomId);
      addSocket(socket, { userInfo, roomId });
      joinRoom(socket, roomId);
      const roomData = getRoomData(roomId);
      socket.emit('join_room_result', { code: 0, roomId, roomData });
      socket.to(roomId).emit('update_room', { code: 0, roomData });
      console.log('join room:', roomId, 'nickName:', userInfo.nickName);
    });
    socket.on('message', (data) => {
      const socketData = getSocket(socket);
      if (!socketData) return;
      const { userInfo, roomId } = socketData;
      const { msg } = data;
      const msgId = genId(10);
      io.in(roomId).send({ userInfo, roomId, msg, msgId });
      console.log('message come', 'roomId:', roomId, 'nickName:', userInfo.nickName, 'msg:', msg);
    });
    socket.on('disconnect', () => {
      console.log('disconnect');
      const socketData = getSocket(socket);
      if (!socketData) return;
      const { userInfo, roomId } = socketData;
      removeSocketInRoom(roomId, socket);
      const roomData = getRoomData(roomId);
      socket.to(roomId).emit('update_room', { code: 0, roomData });
      console.log('leave room:', roomId, 'nickName:', userInfo.nickName);
    });
    socket.on('connect_error', () => {
      console.log('connect_error');
    });
    socket.on('connect_timeout', () => {
      console.log('connect_timeout');
    });
    socket.on('reconnect_attempt', () => {
      console.log('reconnect_attempt');
    });
    socket.on('reconnect_error', () => {
      console.log('reconnect_error');
    });
    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
    });
    socket.on('reconnect', () => {
      console.log('reconnect');
    });
  });
  // io.
  // io.on('connect_error', (socket))
};

module.exports = {
  init,
};
