class Rooms {
  constructor() {
    this.roomMap = {};
  }

  joinRoom(roomId, userInfo) {
    let roomData = this.roomMap[roomId];
    if (!roomData) {
      roomData = { users: [], owner: null };
    }
    if (roomData.users.findIndex((v) => v.userId === userInfo.userId) > -1) {
      return;
    }
    roomData.users.push(userInfo);
    if (!roomData.owner) {
      roomData.owner = roomData.users[0];
    }
    this.roomMap[roomId] = roomData;
  }

  leaveRoom(roomId, userInfo) {
    const roomData = this.roomMap[roomId];
    if (!roomData) return;
    const userIndex = roomData.users.findIndex((v) => v.userId === userInfo.userId);
    if (userIndex !== -1) {
      roomData.users.splice(userIndex, 1);
    }
    if (roomData.users.length) {
      if (roomData.owner.userId === userInfo.userId) {
        roomData.owner = roomData.users[0];
      }
      this.roomMap[roomId] = roomData;
    } else {
      this.roomMap[roomId] = null;
    }
  }

  findRoom(roomId) {
    return this.roomMap[roomId];
  }

  getRoomData(roomId) {
    return this.roomMap[roomId];
  }
}

module.exports = new Rooms();
