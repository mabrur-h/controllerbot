const { verify, sign } = require("jsonwebtoken");
const { SECRET_WORD } = require("../../../config");

function genereteJWTToken(data) {
  return sign(data, SECRET_WORD);
}

function checkToken(token) {
  try {
    return verify(token, SECRET_WORD);
  } catch (e) {
    return false;
  }
}

module.exports = {
  genereteJWTToken,
  checkToken,
};
