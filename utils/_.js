const genId = (n) => {
  const s = 'abcdefghijklmnpqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < n; i++) {
    result += String(s[Math.floor(Math.random() * s.length)]);
  }
  return result;
};

module.exports = {
  genId,
};
