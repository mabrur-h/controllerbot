const ms = require("ms");
const axios = require("axios");
const moment = require("moment");
const {MYID} = require("../config");
const {
  newFilter,
  getFilter,
  removeFilter,
  removeAllFilter,
} = require("../modules/models/FilterModel");
const { newWarn, getWarn, delWarn } = require("../modules/models/WarnModel");
const { allowSendLink, banSendLink } = require("./AllowLInkController");
const { BOT_USERNAME } = require("../config");
const { newChat, getChat } = require("../modules/models/ChatModel");
const {
  allowSendGreeting,
  banSendGreeting,
} = require("./AllowGreetingController");
const {
  showParticipation,
  hideParticipation,
  allowArabic,
  deleteArabic,
    allowMention,
    disallowMention,
    updateWarnModel
} = require("./AllowDeleteParticipation");
const { getBlock, removeBlock } = require("../modules/models/BlockModel");

module.exports = async (message, bot, TOKEN) => {
  const adminsList = [];
  const text = message.text ? message.text.toLowerCase() : "";
  const messageId = message.message_id;
  const chatId = message.chat.id;
  const userId = message.from.id;

  if (message.reply_to_message) {
    var target = message.reply_to_message.from.id;
    var targetName = message.reply_to_message.from.first_name;
    var targetMessage = message.reply_to_message.message_id;
  }

  if (!message.entities) {
    return 0;
  }

  if (message.entities[0].type === "bot_command") {
    var firstWord = text.replace(/ .*/, "");
    var nextWord = text.replace(/^\S+\s+/, "");
  }

  let isAdmin;

  const myID = Number(MYID);

  if (message.chat.type !== "private") {
    const admins = await bot.getChatAdministrators(chatId);
    admins.map((el) => adminsList.push(el.user.id));
    if (message.from.username === 'GroupAnonymousBot') {
      adminsList.push(message.from.id)
    }
    admins.forEach((el) => {
      if (el.user.id === myID) {
        isAdmin = true;
      }
    });
  }

  let tgChat = await bot.getChat(chatId);
  if (!tgChat.permissions.can_send_messages) {
    await bot.leaveChat(chatId);
  }

  if (!isAdmin) {
    await bot.sendMessage(
      chatId,
      `Guruhga admin qilib, /start buyrug'ini bosing. Xizmatingizda bo'laman😎`
    );
  }

  let chat;

  if (text === `/start` || text === `/start@${BOT_USERNAME}`) {
    if (isAdmin) {
      try {
        await bot.sendChatAction(chatId, "typing")
        let block = await getBlock(chatId);
        if (block) {
          await removeBlock(chatId);
        }
        chat = await newChat(chatId, message.chat.title);
        await bot.sendMessage(chatId, `Salom :) Savollar bo'lsa lichkaga o'ting, javob beraman😎`, {
          parse_mode: "HTML",
          reply_to_message_id: messageId
        })
      } catch (e) {
        throw new Error(e);
      }
      return;
    }
  } else if (text === `/settings`) {
    await bot.sendChatAction(chatId, "typing");
    // let chat = await getChat(chatId);
    // chat = chat?.dataValues;
    // let permissions = `<b>Botning guruhdagi huquqlari:</b>\n\n`;
    // permissions += chat.allowGreeting
    //     ? `✅ Captcha\n`
    //     : `❌ Captcha\n`;
    // permissions += !chat.allowLink
    //     ? `✅ Linklarni o'chirish\n`
    //     : `❌ Linklarni o'chirish\n`;
    // permissions += chat.allowDeleteParticipation
    //     ? `✅ Kirgan/Chiqqanlarni o'chirish\n`
    //     : `❌ Kirgan/Chiqqanlarni o'chirish\n`;
    // permissions += chat.allowDeleteArabic
    //     ? `✅ Arabcha simvollarni o'chirish`
    //     : `❌ Arabcha simvollarni o'chirish`
    let keyboard = {
      inline_keyboard: [
        [
          {
            text: "Bot huquqlari (admin)",
            callback_data: `perms`,
          },
        ],
      ],
    };
    let permissions = `Botning guruhdagi sozlamalarini ko'rish uchun pastdagi tugmachani bosing.`
    await bot.sendMessage(chatId, permissions, {
      parse_mode: "HTML",
      reply_markup: keyboard,
      reply_to_message_id: messageId
    });
  } else if (firstWord === "/ban" && adminsList.includes(userId)) {
    try {
      if (target) {

        if (adminsList.includes(target)) {
          await bot.sendMessage(
              chatId,
              "Nega adminni chatdan haydayman? Bu yaxshi fikrga o'xshamaydi.",
              {
                parse_mode: "HTML",
                reply_to_message_id: messageId
              }
          );
        } else {
          let msg = await bot.getChatMember(chatId, target);
          if (msg.status === "kicked") {
            await bot.sendMessage(
                chatId,
                `<a href="tg://user?id=${target}">${targetName}</a> guruhda mavjud emas.`,
                {
                  parse_mode: "HTML",
                  reply_to_message_id: messageId
                }
            );
            await bot.deleteMessage(chatId, messageId);
          } else {
            let keyboard = {
              inline_keyboard: [
                [
                  {
                    text: "Bandan olish (admin)",
                    callback_data: `unban#${chatId}#${target}`,
                  },
                ],
              ],
            };
            await bot.kickChatMember(chatId, target);
            await bot.sendMessage(
                chatId,
                nextWord !== "/ban"
                    ? `<a href="tg://user?id=${target}">${targetName}</a> ni guruhdan chiqarib yubordim.
<b>Sabab:</b> ${nextWord}`
                    : `<a href="tg://user?id=${target}">${targetName}</a> ni guruhdan chiqarib yubordim.`,
                {
                  parse_mode: "HTML",
                  reply_markup: keyboard,
                  reply_to_message_id: messageId
                }
            );
            await delWarn(chatId, target);
          }
        }
      } else {
        await bot.sendMessage(chatId, `Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!`, {
          reply_to_message_id: messageId
        })
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (firstWord === '/dban') {
    if (adminsList.includes(target)) {
      await bot.sendMessage(
          chatId,
          "Nega adminni chatdan haydayman? Bu yaxshi fikrga o'xshamaydi.",
          {
            parse_mode: "HTML",
            reply_to_message_id: messageId
          }
      );
    } else {
      if (target) {
        let keyboard = {
          inline_keyboard: [
            [
              {
                text: "Bandan olish (admin)",
                callback_data: `unban#${chatId}#${target}`,
              },
            ],
          ],
        };
        await bot.kickChatMember(chatId, target)
        await bot.deleteMessage(chatId, targetMessage)
        await bot.sendMessage(
            chatId,
            nextWord !== "/dban"
                ? `<a href="tg://user?id=${target}">${targetName}</a> guruhdan chiqarib yuborildi va so'ngi yozgan xabari o'chirildi.
<b>Sabab:</b> ${nextWord}`
                : `<a href="tg://user?id=${target}">${targetName}</a> guruhdan chiqarib yuborildi va so'ngi yozgan xabari o'chirildi.`,
            {
              parse_mode: "HTML",
              reply_markup: keyboard,
              reply_to_message_id: messageId
            }
        );
      } else {
        await bot.sendMessage(chatId, "Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!", {
          reply_to_message_id: messageId
        })
      }
    }
  } else if (firstWord === "/unban" && adminsList.includes(userId)) {
    if (target) {
      let member = await bot.getChatMember(chatId, target)
      if (member.status === 'left') {
        await bot.unbanChatMember(chatId, target);
        await bot.sendMessage(
            chatId,
            `<a href="tg://user?id=${target}">${targetName}</a> guruhga qaytishi mumkin.`,
            {
              parse_mode: "HTML",
              reply_to_message_id: messageId
            }
        );
      } else {
        await bot.sendMessage(chatId, `<a href="tg://user?id=${target}">${targetName}</a> ban bo'lmagan. U yoza olishi mumkin.`, {
          reply_to_message_id: messageId,
          parse_mode: "HTML"
        })
      }
    } else {
      await bot.sendMessage(chatId, `Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!`, {
        reply_to_message_id: messageId
      })
    }
  } else if (firstWord === "/delete" && adminsList.includes(userId)) {
    try {
      if (target) {
        await bot.deleteMessage(chatId, targetMessage);
        await bot.sendMessage(
            chatId,
            nextWord !== "/delete"
                ? `<a href="tg://user?id=${target}">${targetName}</a> sizning xabaringiz o'chirildi.
<b>Sabab:</b> ${nextWord}`
                : `<a href="tg://user?id=${target}">${targetName}</a> sizning xabaringiz o'chirildi.`,
            {
              parse_mode: "HTML",
              reply_to_message_id: messageId
            }
        );
      } else {
        await bot.sendMessage(chatId, `Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!`, {
          reply_to_message_id: messageId
        })
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (text === "/pin" && adminsList.includes(userId)) {
    try {
      await bot.pinChatMessage(chatId, targetMessage);
    } catch (e) {
      throw new Error(e);
    }
  } else if (text === "/unpin" && adminsList.includes(userId)) {
    try {
      await bot.unpinChatMessage(chatId);
    } catch (e) {
      throw new Error(e);
    }
  } else if (text === "/unpinall" && adminsList.includes(userId)) {
    try {
      await bot.unpinAllChatMessages(chatId);
    } catch (e) {
      throw new Error(e);
    }
  } else if (firstWord === "/mute" && adminsList.includes(userId)) {
    try {
      if (target) {

        // ms('2 days')  // 172800000
        // ms('1d')      // 86400000
        // ms('10h')     // 36000000
        // ms('2.5 hrs') // 9000000
        // ms('2h')      // 7200000
        // ms('1m')      // 60000
        // ms('5s')      // 5000

        let num = nextWord.replace(/\D/g,'');
        let type = nextWord.replace(/[0-9]/g, '');
        let dateText;

        if (num < 30 && type === 's') {
          num = 30
          nextWord = '30s'
        }

        if (type === 's') {
          dateText = `${num} soniyaga`
        } else if (type === 'm') {
          dateText = `${num} daqiqaga`
        } else if (type === 'd') {
          dateText = `${num} kunga`
        } else if (type === 'h') {
          dateText = `${num} soatga`
        } else {
          dateText = `umrbod`
        }

        let time = Math.round((Date.now() + ms(nextWord)) / 1000);
        axios
            .get(`https://api.telegram.org/bot${TOKEN}/restrictChatMember`, {
              params: {
                chat_id: chatId,
                user_id: target,
                can_send_messages: false,
                until_date: time,
              },
            })
            .then(function () {
              bot.sendMessage(
                  chatId,
                  `Tsss, og'zingni yum!🤫
<a href="tg://user?id=${target}">${targetName}</a> ${dateText} xabar yoza olmaslik rejimiga tushdi!`,
                  {
                    parse_mode: "HTML",
                    reply_to_message_id: messageId
                  }
              );
            })
            .catch(function (error) {
            });
      } else {
        await bot.sendMessage(chatId, `Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!`, {
          reply_to_message_id: messageId
        })
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (firstWord === "/unmute") {
    try {
      if (target) {
        const permissions = {
          can_send_messages: true,
          can_send_media_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
          can_change_info: true,
          can_invite_users: true,
          can_pin_messages: true
        };

        await bot.restrictChatMember(chatId, target, permissions);
        await bot.sendMessage(
            chatId,
            `<a href="tg://user?id=${target}">${targetName}</a> endi xabar yozishi mumkin!`,
            {
              parse_mode: "HTML",
              reply_to_message_id: messageId
            }
        );
      } else {
        await bot.sendMessage(chatId, `Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!`, {
          reply_to_message_id: messageId
        })
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (firstWord === "/addblocklist" && adminsList.includes(userId)) {
    try {
      await newFilter(chatId, nextWord);
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {
    }
  } else if (firstWord === "/unblocklist" && adminsList.includes(userId)) {
    try {
      await removeFilter(chatId, nextWord);
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {
    }
  } else if (firstWord === "/unblocklistall" && adminsList.includes(userId)) {
    try {
      await removeAllFilter(chatId);
      await bot.deleteMessage(chatId, messageId)
    } catch (e) {
    }
  } else if (firstWord === "/blocklist" && adminsList.includes(userId)) {
    try {
      const filteredWords = await getFilter(chatId);

      if (!filteredWords) {
        await bot.sendMessage(chatId, `Ta'qiqlangan so'z to'pilmadi!`, {
          reply_to_message_id: messageId
        });
        return 0;
      }

      const {dataValues} = filteredWords;

      await bot.sendMessage(
          chatId,
          `<b>Guruhda o'chirilishi kerak bo'lgan so'zlar ro'yhati:</b> \n<i>${dataValues.filter.join(
              ", "
          )}</i>`,
          {
            parse_mode: "HTML",
            reply_to_message: messageId,
          }
      );
    } catch (e) {
    }
  } else if (
      firstWord === "/warn" &&
      adminsList.includes(userId) &&
      !adminsList.includes(target)
  ) {
    try {
      let chat = await getChat(chatId);
      chat = chat?.dataValues;
      if (target) {
        let msg = await bot.getChatMember(chatId, target);
        if (msg.status !== 'kicked') {
          let warn = await newWarn(target, chatId);
          let sabab;
          if (nextWord === '/warn') {
            sabab = '';
          } else {
            sabab = `<b>Sabab:</b> ${nextWord}`
          }
          warn = await getWarn(chatId, target);

          if (warn.dataValues.warn == chat.warnCount) {
            await bot.kickChatMember(chatId, target);
            await delWarn(chatId, target);
            let keyboard = {
              inline_keyboard: [
                [
                  {
                    text: "Bandan olish (admin)",
                    callback_data: `unban#${chatId}#${target}`,
                  },
                ],
              ],
            };
            await bot.sendMessage(
                chatId,
                `<a href="tg://user?id=${target}">${targetName}</a> da ogohlantirishlar soni ${chat.warnCount} taga yetgani uchun guruhdan chiqarib yubordim.`,
                {
                  parse_mode: "HTML",
                  reply_to_message_id: messageId,
                  reply_markup: keyboard
                }
            );
          } else {
            let keyboard = {
              inline_keyboard: [
                [
                  {
                    text: "Ogohlantirishni olish (faqat admin)",
                    callback_data: `unwarn#${chatId}#${target}`,
                  },
                ],
              ],
            };

            await bot.sendMessage(
                chatId,
                `<a href="tg://user?id=${target}">${targetName}</a> da ogohlantirish mavjud, ehtiyot bo'ling. ${warn.dataValues.warn}/${chat.warnCount}\n\n${nextWord ? sabab : ''}`,
                {
                  parse_mode: "HTML",
                  reply_markup: keyboard,
                  reply_to_message_id: messageId
                }
            );
          }
        } else {
          await bot.sendMessage(chatId, `Foydalanuvchi guruhda mavjud emas!`, {
            reply_to_message_id: messageId
          })
        }
      } else {
        await bot.sendMessage(chatId, `Kimni nazarda tutayotganingizni bilmadim, kerakli foydalanuvchini belgilang!`, {
          reply_to_message_id: messageId
        })
      }
    } catch (e) {

    }
  } else if (
      firstWord === "/dwarn" &&
      adminsList.includes(userId) &&
      !adminsList.includes(target)
  ) {
    try {
      let chat = await getChat(chatId);
      chat = chat?.dataValues;
      if (target) {
        let msg = await bot.getChatMember(chatId, target);
        if (msg.status !== 'kicked') {
          let warn = await newWarn(target, chatId);
          let sabab;
          if (nextWord === '/dwarn') {
            sabab = '';
          } else {
            sabab = `<b>Sabab:</b> ${nextWord}`
          }
          await bot.deleteMessage(chatId, message.reply_to_message.message_id)
          warn = await getWarn(chatId, target);
          if (warn.dataValues.warn == chat.warnCount) {
            await bot.kickChatMember(chatId, target);
            await delWarn(chatId, target);
            await bot.sendMessage(
                chatId,
                `<a href="tg://user?id=${target}">${targetName}</a> da ogohlantirishlar soni ${chat.warnCount} taga yetgani uchun guruhdan chiqarib yubordim.`,
                {
                  parse_mode: "HTML",
                  reply_to_message_id: messageId
                }
            );
          } else {
            let keyboard = {
              inline_keyboard: [
                [
                  {
                    text: "Ogohlantirishni olish (admin)",
                    callback_data: `unwarn#${chatId}#${target}`,
                  },
                ],
              ],
            };

            await bot.sendMessage(
                chatId,
                `<a href="tg://user?id=${target}">${targetName}</a> da ogohlantirish mavjud, ehtiyot bo'ling. ${warn.dataValues.warn}/${chat.warnCount}\n\n${nextWord ? sabab : ''}`,
                {
                  parse_mode: "HTML",
                  reply_markup: keyboard,
                  reply_to_message_id: messageId
                }
            );
          }
        } else {
          await bot.sendMessage(chatId, `Foydalanuvchi guruhdan topilmadi!`, {
            reply_to_message_id: messageId
          })
        }
      }
    } catch (e) {

    }
  } else if (firstWord === "/link" && adminsList.includes(userId)) {
    try {
      await allowSendLink(bot, message);
      await bot.sendMessage(chatId, `Guruhda link tarqatish mumkin.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (firstWord === "/nolink" && adminsList.includes(userId)) {
    try {
      await banSendLink(bot, message);
      await bot.sendMessage(chatId, `Guruhda turli linklarni tarqatish mumkin emas.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (firstWord === "/noarabic" && adminsList.includes(userId)) {
    try {
      await deleteArabic(bot, message);
      await bot.sendMessage(chatId, `Guruhdan arabcha simvollarni o'chirishni boshlayman.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (firstWord === "/allowarabic" && adminsList.includes(userId)) {
    try {
      await allowArabic(bot, message);
      await bot.sendMessage(chatId, `Guruhda arabcha simvollar ishlatish mumkin.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (firstWord === "/mention" && adminsList.includes(userId)) {
    try {
      await allowMention(bot, message);
      await bot.sendMessage(chatId, `Guruhda turli kanallar reklamalari va foydalanuvchilarni teg yordamida chaqirish mumkin`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (firstWord === "/nomention" && adminsList.includes(userId)) {
    try {
      await disallowMention(bot, message);
      await bot.sendMessage(chatId, `Guruhda turli kanallar reklamalari va foydalanuvchilarni teg yordamida chaqirish mumkin emas.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (
      firstWord === "/nojoined" &&
      adminsList.includes(userId)
  ) {
    try {
      await hideParticipation(bot, message);
      await bot.sendMessage(chatId, `Guruhdan kirgan-chiqqanlarni o'chiraman.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (
      firstWord === "/showjoined" &&
      adminsList.includes(userId)
  ) {
    try {
      await showParticipation(bot, message);
      await bot.sendMessage(chatId, `Guruhdan kirgan-chiqqanlarni o'chirmayman.`, {
        reply_to_message_id: messageId
      })
    } catch (e) {
    }
  } else if (firstWord === "/setwarn") {
    try {
      if (Number(nextWord)) {
        let num = Math.abs(Number(nextWord))
        if (num < 2 || num > 20) {
          await bot.sendMessage(chatId, "Ogohlantirishlar soni eng kami 2 ta, ko'pi bilan 20 ta bo'lishi mumkin. Qaytadan urining.", {
            reply_to_message_id: messageId
          })
        } else {
          await updateWarnModel(bot, message, num);
          await bot.sendMessage(chatId, `Ogohlantirish berishlar soni ${num} tagacha oshirildi!`, {
            reply_to_message_id: messageId
          });
        }
      } else {
        await bot.sendMessage(chatId, "Buyruqdan so'ng raqam kiriting!", {
          reply_to_message_id: messageId
        })
      }
    } catch (e) {

    }
  }
};
