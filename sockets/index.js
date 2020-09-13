const init = (io) => {
  io.on('connection', (socket) => {
    console.log(socket);
  });
};

module.exports = {
  init,
};
