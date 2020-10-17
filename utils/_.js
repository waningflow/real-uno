const genId = (n) => {
  const s = 'abcdefghijklmnpqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < n; i++) {
    result += String(s[Math.floor(Math.random() * s.length)]);
  }
  return result;
};

const randomArr = (arr) => {
  let result = arr.slice();
  result.sort(function () {
    return Math.random() - 0.5;
  });
  return result;
};

module.exports = {
  genId,
  randomArr,
};
