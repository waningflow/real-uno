class Users {
  constructor() {
    this.users = {};
  }

  addSocket(userInfo, socket) {
    let userData = this.users[userInfo.userId] || { sockets: [], userInfo: userInfo, roomId: null };
    if (userData.sockets.findIndex((v) => v.id === socket.id) > -1) return;
    userData.sockets.push(socket);
    this.users[userInfo.userId] = userData;
  }

  removeSocket(userInfo, socket) {
    let userData = this.users[userInfo.userId];
    if (!userData) return;
    const socketIndex = userData.sockets.findIndex((v) => v.id === socket.id);
    if (socketIndex > -1) {
      userData.sockets.splice(socketIndex, 1);
    }
    this.users[userInfo.userId] = userData;
    return userData.sockets.length;
  }

  joinRoom(roomId, userInfo) {
    let userData = this.users[userInfo.userId] || { sockets: [], userInfo: userInfo, roomId: null };
    userData.lastRoomId = roomId;
    userData.roomId = roomId;
    this.users[userInfo.userId] = userData;
  }

  leaveRoom(roomId, userInfo) {
    let userData = this.users[userInfo.userId];
    if (!userData) return;
    // userData.lastRoomId = userData.roomId;
    userData.roomId = null;
    this.users[userInfo.userId] = userData;
  }

  findUser(userInfo) {
    return this.users[userInfo.userId];
  }

  clearLastRoomId(userInfo) {
    let userData = this.users[userInfo.userId];
    console.log('clear lastRoomId', userData);
    if (!userData || userData.sockets.length > 0) {
      console.log('clear fail for active socket');
      return;
    }
    userData.lastRoomId = null;
    this.users[userInfo.userId] = userData;
  }
}

module.exports = new Users();
