const { genId } = require('../utils/_');
const Users = require('./users');
const Rooms = require('./rooms');
const Game = require('./game');

const joinRoom = (socket, roomId, userInfo) => {
  socket.join(roomId);
  socket._data = { userInfo, roomId };
  Rooms.joinRoom(roomId, userInfo);
  Users.joinRoom(roomId, userInfo);
};

const autoJoin = (socket) => {
  try {
    const { userInfo: userInfoRaw } = socket.handshake.query;
    const userInfo = JSON.parse(userInfoRaw);
    // console.log(userInfo);
    Users.addSocket(userInfo, socket);
    socket._data = socket._data || {};
    socket._data.userInfo = userInfo;
    const lastRoomId = Users.findUser(userInfo).lastRoomId;
    if (lastRoomId) {
      joinRoom(socket, lastRoomId, userInfo);
      const roomData = Rooms.getRoomData(lastRoomId);
      socket.emit('auto_join', {
        roomId: lastRoomId,
        roomData: { owner: roomData.owner, users: roomData.users },
        gameData: roomData.game ? {} : null,
      });
      console.log('auto join room', 'roomId:', lastRoomId);
    } else {
      socket.emit('reset');
    }
  } catch (e) {
    console.log(e);
  }
};

const init = (io) => {
  io.on('connection', (socket) => {
    console.log('connection');
    autoJoin(socket);
    socket.on('create_room', ({ userInfo }) => {
      const roomId = genId(5);
      if (Rooms.findRoom(roomId)) {
        socket.emit('create_room_result', { code: 1, message: 'fail' });
        return;
      }
      joinRoom(socket, roomId, userInfo);
      socket.emit('create_room_result', { code: 0, roomId, roomData: Rooms.getRoomData(roomId) });
      console.log('create room:', roomId, 'nickName:', userInfo.nickName);
    });
    socket.on('join_room', ({ roomId, userInfo }) => {
      if (!Rooms.findRoom(roomId)) {
        socket.emit('join_room_result', { code: 1, message: 'not fount' });
        return;
      }
      joinRoom(socket, roomId, userInfo);
      const roomData = Rooms.getRoomData(roomId);
      socket.emit('join_room_result', { code: 0, roomId, roomData });
      socket.to(roomId).emit('update_room', { code: 0, roomData });
      console.log('join room:', roomId, 'nickName:', userInfo.nickName);
    });
    socket.on('message', (data) => {
      if (!socket._data) return;
      const { userInfo, roomId } = socket._data;
      const { msg } = data;
      const msgId = genId(10);
      io.in(roomId).send({ userInfo, roomId, msg, msgId });
      console.log('message come', 'roomId:', roomId, 'nickName:', userInfo.nickName, 'msg:', msg);
    });
    socket.on('disconnect', (type) => {
      console.log('disconnect', type);
      // if (!socket._data) return;
      const { userInfo, roomId } = socket._data || {};
      if (!userInfo) return;
      const remainSockets = Users.removeSocket(userInfo, socket);
      console.log(
        'remove socket:',
        'nickName:',
        userInfo.nickName,
        'remainSockets:',
        remainSockets
      );
      // 10s内没有重连则不能自动连接
      if (remainSockets === 0 || !roomId) {
        const forceDisconnect = type === 'client namespace disconnect';
        console.log('forceDisconnect', forceDisconnect);
        setTimeout(
          () => {
            if (Users.getSocketNum(userInfo) === 0) {
              Rooms.leaveRoom(roomId, userInfo);
              Users.leaveRoom(roomId, userInfo);
              socket
                .to(roomId)
                .emit('update_room', { code: 0, roomData: Rooms.getRoomData(roomId) });
              console.log('leave room:', roomId, 'nickName:', userInfo.nickName);
            }
          },
          forceDisconnect ? 0 : 10000
        );
      }
    });
    // game相关事件
    socket.on('start_game', () => {
      if (!socket._data) return;
      const { userInfo, roomId } = socket._data;
      io.in(roomId).emit('game_started', { gameData: {} });
      console.log('game_started', 'roomId:', roomId, 'nickName:', userInfo.nickName);
      const roomData = Rooms.getRoomData(roomId);
      const game = new Game({ io, roomId, roomData });
      roomData.game = game;
      // game.start();
    });
    socket.on('player_ready', () => {
      if (!socket._data) return;
      const { userInfo, roomId } = socket._data;
      console.log('player_ready', 'roomId:', roomId, 'nickName:', userInfo.nickName);
      const roomData = Rooms.getRoomData(roomId);
      const game = roomData.game;
      game.playerReady(userInfo);
      console.log(game.isAllPlayerReady());
      if (game.isAllPlayerReady() && !game.started) {
        game.start();
      }
    });
    // 连接相关事件
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
