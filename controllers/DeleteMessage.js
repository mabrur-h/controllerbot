const moment = require("moment");
const ms = require("ms");
const axios = require("axios");
const { getChat, newChat } = require("../modules/models/ChatModel");
const { getFilter } = require("../modules/models/FilterModel");

module.exports = async (message, bot, TOKEN) => {
  const adminsList = [];
  const text = message.text ? message.text.toLowerCase() : "";
  const messageId = message.message_id;
  const chatId = message.chat.id;
  const user = message.from;

  let arRegEx = /[\u0600-\u06FF]/;
  let chatData = await getChat(chatId);

  if (message.chat.type !== "private") {
    const admins = await bot.getChatAdministrators(chatId);
    admins.map((el) => adminsList.push(el.user.id));
    if (message.from.username === 'GroupAnonymousBot') {
      adminsList.push(message.from.id)
    }


    const filteredWords = await getFilter(chatId);
    function checkFilter(text, filters) {
      if (filteredWords) {
        let flag = false;
        text.split(" ").forEach((word) => {
          if (filters.includes(word)) {
            flag = true;
          }
        });
        return flag;
      }
    }

    if (chatData?.dataValues?.allowDeleteArabic && arRegEx.test(text) && !adminsList.includes(user.id)) {
      await bot.deleteMessage(chatId, messageId)
    }

    if (filteredWords) {
      let flag = checkFilter(text, filteredWords.dataValues.filter);
      if (flag && !adminsList.includes(user.id)) {
        let time = Math.round((Date.now() + ms("3m")) / 1000);
        let date = moment(Date.now() + ms("3m"))
          .locale("uz-latn")
          .format("HH:mm");
        axios
          .get(`https://api.telegram.org/bot${TOKEN}/restrictChatMember`, {
            params: {
              chat_id: chatId,
              user_id: user.id,
              can_send_messages: false,
              until_date: time,
            },
          })
          .then(function () {
            bot.sendMessage(
              chatId,
              `<a href="tg://user?id=${user.id}">${user.first_name}</a> ta'qiqlangan so'z ishlatgani uchun, 3 daqiqa xabar yoza olmaydi!`,
              {
                parse_mode: "HTML",
              }
            );
          })
          .catch(function (error) {
          });
        await bot.deleteMessage(chatId, messageId);
      }
    }

    if (!message.entities) {
      return 0;
    }

    if ((message.entities[0].type === "bot_command" &&
          !adminsList.includes(user.id))) {
      try {
        await bot.deleteMessage(chatId, messageId)
      } catch (e) {

      }
    }

    if (!chatData?.dataValues?.allowMention && !adminsList.includes(user.id)) {
      await bot.deleteMessage(chatId, messageId)
    }

    if ((message.entities[0].type === "url" && !adminsList.includes(user.id))) {
      try {
        let chat = await getChat(chatId);
        let isAllowedLink = chat.dataValues.allowLink;
        if (!isAllowedLink) {
          await bot.deleteMessage(chatId, messageId);
          if (message.entities[0].type !== "bot_command") {
            await bot.sendMessage(
              chatId,
              `<a href="tg://user?id=${user.id}">${user.first_name}</a> guruhda reklama tarqatmang!\n`,
              {
                parse_mode: "HTML",
              }
            );
          }
        }
      } catch (e) {
      }
    }
    // let filterResponse = '';
    // filterResponse = filteredWords.dataValues.filter ? filterResponse = filteredWords.dataValues.filter : '';
  }
};
