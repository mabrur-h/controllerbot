const LoginGetController = require("../controllers/LoginGetController");
const LoginPostController = require("../controllers/LoginPostController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = require("express").Router();

router.use(AuthMiddleware);

router.get("/", LoginGetController);
router.post("/", LoginPostController);

module.exports = {
  path: "/login",
  router,
};
