const {getChat} = require("../models/ChatModel");
const { minusWarn } = require("../models/WarnModel");

module.exports = async function (bot, message) {
  let isAdmin;
  const adminsList = [];
  const chatId = message.message.chat.id;


    if (message.message.chat.type !== "private") {
    const admins = await bot.getChatAdministrators(message.message.chat.id);
    admins.map((el) => adminsList.push(el.user.id));
    admins.forEach((el) => {
      if (el.user.id === message.from.id) {
        isAdmin = true;
      }
    });
  }

  let command = message.data.split("#")[0];
  try {
    if (command === "unban") {
      if (isAdmin) {
        await bot.unbanChatMember(
          Number(message.data.split("#")[1]),
          Number(message.data.split("#")[2])
        );
        await bot.deleteMessage(
            message.message.chat.id,
            message.message.message_id
        )
      } else {
        await bot.answerCallbackQuery(
            message.id,
            `Siz admin emassiz`,
            {
              show_alert: true,
            }
        );
      }
    } else if (command === "unwarn") {
      if (isAdmin) {
        let warn = await minusWarn(
          Number(message.data.split("#")[1]),
          Number(message.data.split("#")[2])
        );
        await bot.deleteMessage(
            message.message.chat.id,
            message.message.message_id
        )
      } else {
        await bot.answerCallbackQuery(
          message.id,
          `Siz admin emassiz`,
          {
            show_alert: true,
          }
        );
      }
    } else if (command === "verify") {
      if (message.from.id === Number(message.data.split("#")[1])) {
        await bot.restrictChatMember(
          message.message.chat.id,
          Number(message.data.split("#")[1]),
          {
            can_send_messages: true,
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true
          }
        );
        await bot.deleteMessage(
          message.message.chat.id,
          message.message.message_id
        );
      }
    }

    if (message?.data === 'a2') {
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: "Orqaga",
                        callback_data: 'a1000',
                    }
                ],
            ],
        };
        await bot.editMessageText(`<b>Banlar</b>

Spamchilar, trollar, qitmirlar va qoidabuzarlarni guruhdan ban qilish kerak bo'lib qoladi.

Bu modul orqali siz osongina ban qilishingiz mumkin bo'ladi. 

- /ban: Reply qilingan foydalanuvchini guruhdan chiqarib yuborish.

- /ban <code>sabab</code>: Reply qilingan foydalanuvchini guruhdan chiqarib yuborish va sababini yozish.

- /dban: Reply qilingan foydalanuvchini guruhdan chiqarib yuborish va so'ngi yozgan xabarini o'chirish.

- /dban <code>sabab</code>: Reply qilingan foydalanuvchini guruhdan chiqarib yuborish, so'ngi yozgan xabarini o'chirish va sababini yozish.

- /unban: Reply qilingan foydalanuvchini bandan chiqarish.`, {
            parse_mode: 'HTML',
            message_id: message.message.message_id,
            chat_id: message.from.id,
            reply_markup: keyboard
        })
    } else if (message?.data === 'a1') {
          const keyboard = {
              inline_keyboard: [
                  [
                      {
                          text: "Orqaga",
                          callback_data: 'a1000',
                      }
                  ],
              ],
          };
          await bot.editMessageText(`<b>Xabarlar</b>

Ba'zi xabarlarni buyruqlar yordamida o'chirish va nima uchun o'chirilganini sababni keltirib berish kerak bo'lib qoladi.

Yoki ba'zi xabarni pin qilish va pindan olish kerak bo'lsa ushbu buyruqlar orqali oson bajarishingiz mumkin.

- /delete: Reply qilingan xabarni o'chirish.

- /delete <code>sabab</code>: Reply qilingan xabarni o'chirish va sababini yozish.

- /pin: Reply qilingan xabarni pin qilish.

- /unpin: Pinda turgan so'ngi xabarni olish.

- /unpinall: Pinda turgan barcha xabarlarni tozlash.`, {
              parse_mode: 'HTML',
              message_id: message.message.message_id,
              chat_id: message.from.id,
              reply_markup: keyboard
          })
      } else if (message?.data === 'a3') {
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: "Orqaga",
                        callback_data: 'a1000',
                    }
                ],
            ],
        };
        await bot.editMessageText(`<b>Cheklovlar</b>

Guruhda qoidabuzarlarni yoza olmaydigan qilib qo'yish muhim. Bu buyruqlar yordamida kerakli vaqtga foydalanuvchini ovozini o'chirishingiz mumkin.

- /mute: Repy qilingan foydalanuvchini yoza olmaydigan qilish.

- /mute <b>vaqt</b>: Reply qilingan foydalanuvchini ma'lum vaqtga yoza olmaydigan qilib qo'yish. 

<i>Misol uchun: </i>
<code>/mute 40s - 40 soniyaga.
/mute 10m - 10 daqiqaga.
/mute 2h - 2 soatga.
/mute 1d - 1 kunga.
/mute - umrbodga.</code>

- /unmute: Reply qilingan foydalanuvchini yoza olmaslik rejimidan chiqarish.

Vaqtni belgilash uchun formulalar: 
bloklash vaqti 30 soniyadan ko'p bo'lishi kerak.
<code>
30s - 30 soniya.
1m - 1 daqiqa.
1h - 1 soat.
1d - 1 kun.
</code>
`, {
            parse_mode: 'HTML',
            message_id: message.message.message_id,
            chat_id: message.from.id,
            reply_markup: keyboard
        })
    } else if (message?.data === 'a4') {
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: "Orqaga",
                        callback_data: 'a1000',
                    }
                ],
            ],
        };
        await bot.editMessageText(`<b>Ta'qiqlar</b>

Guruhda so'kinadiganlar, joiz bo'lmagan so'zlarni ishlatadiganlarga qarshi mahsus himoya. U yordamida ta'qiqlangan so'zlar ro'yhatini hosil qilib, ishlatganlarga 3 daqiqagacha yoza olmaydigan qilib qo'yishingiz mumkin.

- /addblocklist <code>so'z</code>: Buyruqdan so'ng yozilgan so'zni ta'qiqlangan so'zlar ro'yhatiga qo'shib qo'yish.

<i>Misol uchun: </i>
<code>/addblocklist qimor</code> - <i>qimor so'zi qatnashgan gap o'chirib tashlanadi.</i>

- /unblocklist <code>so'z</code>: Buyruqdan so'ng yozilgan so'zni ta'qiqlangan so'zlar ro'yhatidan olib tashlash.

<i>Misol uchun:</i> 
<code>/unblocklist qimor</code> - <i>endi qimor so'zini yozish mumkin bo'ladi.</i>

- /unblocklistall : Barcha ta'qiqlangan so'zlarni tozalash.

- /blocklist: Guruhda ta'qiqlangan so'zlar ro'yhatini ko'rish.
`, {
            parse_mode: 'HTML',
            message_id: message.message.message_id,
            chat_id: message.from.id,
            reply_markup: keyboard
        })
    } else if (message?.data === 'a5') {
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: "Orqaga",
                        callback_data: 'a1000',
                    }
                ],
            ],
        };
        await bot.editMessageText(`<b>Ogohlantirishlar</b>

Bu buyruqlar yordamida qoidabuzarlarni ogohlantirish va 6 ta ogohlantirishdan so'ng, avtomatik ban berib yuborish mumkin.

- /warn: Reply qilingan foydalanuvchiga ogohlantirish berish. 

- /warn <code>sabab</code>: Reply qilingan foydalanuvchiga ogohlantirish berish va sababini yozish.

- /dwarn: Reply qilingan foydalanuvchiga ogohlantirish berish va belgilangan xabarini o'chirish.

- /dwarn <code>sabab</code>: Reply qilingan foydalanuvchiga ogohlantirish berish, belgilangan xabarini o'chirish va sababini yozish.
`, {
            parse_mode: 'HTML',
            message_id: message.message.message_id,
            chat_id: message.from.id,
            reply_markup: keyboard
        })
    } else if (message?.data === 'a6') {
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: "Orqaga",
                        callback_data: 'a1000',
                    }
                ],
            ],
        };
        await bot.editMessageText(`<b>Ogohlantirishlar</b>

Guruh huquqlarini nazorat qilish. Buyruqlar adminlarga turli qo'shimcha imkoniyatlarni taqdim qiladi.

- /link: Guruhda reklama va linklar tarqatishga ruhsat berish.

- /nolink: Guruhdan reklama va linklar tarqatishni ta'qiqlash.

- /noarabic: Guruhda arabcha so'z qatnashgan gaplarni o'chirish.

- /allowarabic: Guruhda arabcha so'z qatnashgan gaplarga ruhsat berish.

- /nojoined: Guruhga kirgan-chiqqanlar haqidagi xabarni o'chirish.

- /showjoined: Guruhga kirgan-chiqqanlar haqidagi xabarni yoqish.

- /mention: Guruhda kuchukcha (<code>@</code>) bilan yozilgan xabarlarga ruhsat berish.

- /nomention: Guruhda kuchukcha (<code>@</code>) bilan yozilgan xabarlarni o'chirish.
`, {
            parse_mode: 'HTML',
            message_id: message.message.message_id,
            chat_id: message.from.id,
            reply_markup: keyboard
        })
    } else if (message?.data === 'a1000') {
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: "Xabarlar",
                        callback_data: 'a1',
                    },
                    {
                        text: "Ban",
                        callback_data: 'a2',
                    }
                ],
                [
                    {
                        text: "Cheklovlar",
                        callback_data: 'a3',
                    },
                    {
                        text: "Ta'qiqlar",
                        callback_data: 'a4',
                    }
                ],
                [
                    {
                        text: "Ogohlantirishlar",
                        callback_data: 'a5',
                    },
                    {
                        text: "Huquqlar",
                        callback_data: 'a6',
                    }
                ],
            ],
        };
        let instruction = `<b>Qo'llanma!</b>

Salom! Men Qitmir Cholman. Guruhdan qitmirlik qilganlarni chopaman, reklamalarni o'chiraman. Guruhingizni menga bemalol ishonsangiz bo'ladi.
Yana, floodlarni nazorat qilish, ogohlantirishlar, botlarga qarshi himoya va boshqa ko'plab ishlar qo'limdan keladi. 

<b>Foydali buyruqlar:</b>
- /start: Meni ishga tushiradi. Guruhga admin qilishni unutmang.
- /help: Bu xabarni jo'natsangiz, o'zim haqimda gapirib beraman.
- /settings: Mening guruhdagi sozlamalarimni tekshirishingiz mumkin. 

Ko'proq ma'lumot - @BuQitmir`;
        await bot.editMessageText(instruction, {
            parse_mode: 'HTML',
            message_id: message.message.message_id,
            chat_id: message.from.id,
            reply_markup: keyboard
        })
    } else if (message?.data === 'perms') {
        let chat = await getChat(chatId);
        chat = chat?.dataValues;
        let permissions
        if (adminsList.includes(message.from.id)) {
            permissions = `Botning guruhdagi huquqlari:\n\n`;
            permissions += !chat.allowLink
                ? `☑️ Linklarni o'chirish\n`
                : `️✖️Linklarni o'chirish\n`;
            permissions += chat.allowDeleteParticipation
                ? `☑️ Kirgan/Chiqqanlarni o'chirish\n`
                : `️✖️Kirgan/Chiqqanlarni o'chirish\n`
            permissions += chat.allowDeleteArabic
                ? `☑️ Arabcha simvollarni o'chirish\n`
                : `✖️ Arabcha simvollarni o'chirish\n`
            permissions += chat.allowMention
                ? `☑️ @ bilan belgilashga ruhsat\n`
                : `✖️ @ bilan belgilashga ruhsat\n`

        } else {
            permissions = `Siz admin emassiz!`
        }
        await bot.answerCallbackQuery(message.id, {
            text: (permissions),
            show_alert: true,
        })
    }

  } catch (e) {
    console.log(e);
  }
};
