const { getChat, removeChat } = require("../modules/models/ChatModel");
const { MYID } = require("../config");
const { AddBlock } = require("../modules/models/BlockModel");
const { removeAllFilter } = require("../modules/models/FilterModel");
module.exports = async (message, bot) => {
  const messageId = message.message_id;
  const chatId = message.chat.id;
  let chat = await getChat(chatId);

  if (message.new_chat_members || message.left_chat_member) {
    let newMembers = message.new_chat_members;

    if (chat) {
      if (message.new_chat_members && chat?.dataValues?.allowGreeting) {
        for (const element of newMembers) {
          let keyboard = {
            inline_keyboard: [
              [
                {
                  text: "Tasdiqlash",
                  callback_data: `verify#${element.id}`,
                },
              ],
            ],
          };

          await bot.restrictChatMember(chatId, element.id, {
            can_send_message: false,
          });

          await bot.sendMessage(
            chatId,
            `Assalomu alaykum <b><a href="tg://user?id=${element.id}">${element.first_name}</a></b>, guruhimizga xush kelibsiz!\n\nBot emasligingizni tasdiqlash uchun quyidagi tugmani bosing`,
            {
              parse_mode: "HTML",
              reply_markup: keyboard,
            }
          );
        }
      }
    }

    if (chat?.dataValues?.allowDeleteParticipation) {
      await bot.deleteMessage(chatId, messageId);
    }
  }
};
