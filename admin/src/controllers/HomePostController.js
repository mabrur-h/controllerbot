// import BOT, CHATS
const { getChats } = require("../../../modules/models/ChatModel");
const bot = require("../../../main");
const sendMessage = require("../modules/sendMessage");
const { getUsers } = require("../../../modules/models/UserModel");
module.exports = async (req, res) => {
  let chats = await getChats();
  let users = await getUsers();
  users = users.map((user) => user.dataValues);
  chats = chats.map((chat) => chat.dataValues);

  chats = [...chats, ...users];

  const { message_type, message_text, media_src, keyboard_text, keyboard_src } = req.body;

  res.redirect("/");

  try {
    let result = await sendMessage(
      bot,
      chats,
      message_type,
      message_text,
      media_src,
      keyboard_src,
      keyboard_text
    );
  } catch (e) {
    console.log(e);
  }
};
