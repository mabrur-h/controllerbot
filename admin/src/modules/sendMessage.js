const { AddBlock } = require("../../../modules/models/BlockModel");
const { removeUser } = require("../../../modules/models/UserModel");

module.exports = async (bot, chats, message_type, message_text, media_src, keyboard_src, keyboard_text) => {
  let keyboard_url = keyboard_src.replace(/['"]+/g, '');
  let interval = (1 / 15) * 1000;
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }
  let count = 0;

  for (let i = 0; i < chats.length; i++) {
    let chat = chats[i];
    let id = chat.chat_id ? chat.chat_id : chat.user_id;
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: keyboard_text,
            url: keyboard_src,
          },
        ],
      ],
    };
    id = Number(id);
    let run = setTimeout(async function () {
      if (message_type === "text") {
        try {
          await bot.sendMessage(id, message_text, {
            parse_mode: "HTML",
            reply_markup: keyboard,
          });
          count += 1;
        } catch (e) {
          console.log(e);
          if (String(e).includes("bot was blocked by the user")) {
            await removeUser(id);
            await AddBlock(id);
          }
        }
      } else if (message_type === "image") {
        try {
          await bot.sendPhoto(id, media_src, {
            caption: message_text,
            parse_mode: "HTML",
            reply_markup: keyboard,
          });
          count += 1;
        } catch (e) {
          if (String(e).includes("Bot was blocked by the user")) {
            await removeUser(id);
            await AddBlock(id);
          }
        }
      } else if (message_type === "audio") {
        try {
          await bot.sendAudio(id, media_src, {
            caption: message_text,
            parse_mode: "HTML",
            reply_markup: keyboard,
          });
          count += 1;
        } catch (e) {
          if (String(e).includes("Bot was blocked by the user")) {
            await removeUser(id);
            await AddBlock(id);
          }
        }
      } else if (message_type === "video") {
        try {
          await bot.sendVideo(id, media_src, {
            caption: message_text,
            parse_mode: "HTML",
            reply_markup: keyboard,
          });
          count += 1;
        } catch (e) {
          if (String(e).includes("Bot was blocked by the user")) {
            await removeUser(id);
            await AddBlock(id);
          }
        }
      }
      localStorage.setItem("sentMessage", count);
      // if (count === chats.length) {
      //   localStorage.setItem("sentMessage", "*");
      // }
    }, interval);
  }

  /*     if (error) {
      localStorage.setItem("hasError", error);
    } else {
      let date = new Date();
      let time = moment(date).locale("uz-latn").format("LLL");
      localStorage.setItem(
        "isFinished",
        `${increment - 1} ta xabar ${time} gacha yuborishga ulgurildi`
      );
    } */
};
