const { getChats } = require("./models/ChatModel");
const bot = require("../main");

module.exports = async () => {
  let chats = await getChats();
  chats = chats.map((chat) => chat.dataValues);
  let groups = [];
  chats.forEach(async (chat) => {
    let count = await bot.getChatMembersCount(chat.chat_id);
    groups.push({
      ...chat,
      members: count,
    });
  });
  return groups;
};
