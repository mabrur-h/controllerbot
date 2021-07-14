const { checkToken } = require("../modules/jwt");

module.exports = async (req, res, next) => {
    let token = req.cookies?.token;
    token = checkToken(token);
    if(token) {
        req.user = token
    }

    next();
}