const { EMAIL, PASSWORD } = require("../../../config");
const { genereteJWTToken } = require("../modules/jwt");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  if (email !== EMAIL) {
    res.redirect("/login");
    return;
  }

  if (password !== PASSWORD) {
    res.redirect("/login");
    return;
  }

  let token = genereteJWTToken({ email: EMAIL });

  res.cookie("token", token).redirect("/");
};
