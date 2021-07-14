require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");
const Commands = require("./controllers/Commands");
const DeleteMessage = require("./controllers/DeleteMessage");
const DeleteParticipations = require("./controllers/DeleteParticipations");
const { NewUserPrivate } = require("./controllers/UserController");
const { removeChat } = require("./modules/models/ChatModel");
const { removeAllFilter } = require("./modules/models/FilterModel");
const queries = require("./modules/queries/queries");
const express = require("express");
const glob = require("glob");
const { PORT } = require("./config");
const path = require("path");
const app = express();
const CookieParser = require("cookie-parser");
const { AddBlock } = require("./modules/models/BlockModel");
const { removeUser } = require("./modules/models/UserModel");
const cors = require("cors");

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.on("message", async (message) => {
  if (message.text === "start" || message.chat.type === "private") {
    await NewUserPrivate(bot, message);
    return;
  }
  try {
    await DeleteMessage(message, bot, TOKEN);
    await DeleteParticipations(message, bot);
    await Commands(message, bot, TOKEN);
  } catch (e) {
    console.log(e);
    if (String(e).includes("bot was kicked")) {
      await removeChat(message.chat.id);
      await removeAllFilter(message.chat.id);
      await AddBlock(message.chat.id);
    }
  }
});

bot.on("callback_query", async (message) => {
  await queries(bot, message);
});

app.listen(PORT, 'localhost', function(err) {
  if (err) return console.log(err);
  console.log("Listening at http://localhost:", PORT);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(cors())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "admin", "src", "views"));

app.use(express.static(path.join(__dirname, "admin", "src", "public")));

try {
  glob("admin/src/routes/*Route.js", (err, files) => {
    files.forEach((file) => {
      const Route = require(path.join(__dirname, file));
      if (Route.path && Route.router) app.use(Route.path, Route.router);
    });
  });
} catch (e) {
  console.log(e)
}


module.exports = bot;
