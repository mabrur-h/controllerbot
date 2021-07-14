const HomeGetController = require("../controllers/HomeGetController");
const HomePostController = require("../controllers/HomePostController");

const router = require("express").Router();

try {
  router.get("/", HomeGetController);
  router.post("/", HomePostController);
} catch (e) {
  console.log(e);
}

module.exports = {
  path: "/",
  router: router,
};
