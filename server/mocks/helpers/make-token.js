module.exports = function makeToken() {
  return Math.random().toString(36).substring(10);
}
