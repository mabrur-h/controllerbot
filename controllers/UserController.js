const { newUser } = require("../modules/models/UserModel");
const { BOT_USERNAME } = require("../config");
const { getBlock, removeBlock } = require("../modules/models/BlockModel");

async function NewUserPrivate(bot, message) {
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "Chatga qo'shish",
          url: `http://t.me/${BOT_USERNAME}?startgroup=botstart`,
        },
      ],
    ],
  };
  try {
    let block = await getBlock(message.from.id);
    if (block) {
      await removeBlock(message.from.id);
    }
    await newUser(message.from.id);

    if (message?.text === '/start') {
      await bot.sendMessage(
          message.from.id,
          `Salom! Qitmircholga nima xizmatlar bor? - Men guruhingizni boshqarishga yordam bera olaman. Imkoniyatlarim haqida to'liq ma'umot olish uchun /help buyrug'ini kiriting.\n\nKo'proq ma'lumot olish uchun <a href='https://t.me/QITMIRCHOL'>kanalimga</a> ulanishni unutmang.`,
          {
            parse_mode: "HTML",
            reply_markup: keyboard,
            disable_web_page_preview: true
          }
      );
    }
    if (message?.text === '/help2') {
      let instruction = `<b>Buyruqlar* ro'yxati</b>:\n\n1. /mute vaqt - Xabar yozishni cheklash (qaysi foydalanuvchi cheklanishi kerak bo'lsa shu foydalanuvchi yozgan xabarga javob tariqasida yoziladi (<i>vaqt: 1m, 40s, 1h, 1d ...</i>)\n2. /unmute - Xabar yozishi cheklangan odamni cheklovlarini olib tashlash)\n3. /delete - Javob qilingan xabarni o'chirish\n4. /pin - Xabarni qadab qo'yish\n5. /unpin - Xabarni qadalganlar ro'yxatidan chiqarish\n5. /ban - Javob qilib yozilgan xabar egasini guruhdan haydash\n6. /unban - Foydalanuvchini qora ro'yxatdan chiqarish\n6. /filters - Taqiqlangan so'zlar ro'yxati\n7. /filter <i>so'z</i> - "<i>so'z</i>"ni taqiqlangan so'zlar ro'yxatiga qo'shish\n8. /unfilter <i>so'z</i> - "<i>so'z</i>"ni taqiqlangan so'zlar ro'yxatidan o'chirish\n9. /unfilterall - Taqiqlangan so'zlar ro'yxatini tozalash\n10. /warn - Foydalanuvchi yozgan xabariga javob qilib yozilganida foydalanuvchiga ogohlantirish berish\n10. /unwarn - Foydalanuvchi ogohlantirishlarini bittaga kamaytirish\n11. /allowlink - Guruhga tashlangan link larni ochirmayman\n12. /banlink - Link larni o'chirish\n13. /allowgreeting - Guruhga qo'shilganlar bilan salomlashish va captcha jo'natish\n14. /bangreeting - Captcha va salomlashishni taqiqlash\n15. /hideparticipation - Guruhga kirgan chiqqanlarni o'chirish\n16. /showparticipation - Guruhga kirgan chiqqanlarni o'chirishni taqiqlash\n\n<b>* - Bu buyruqlardan faqat admin foydalana oladi</b>`;
      await bot.sendMessage(message.from.id, instruction, {
        parse_mode: 'HTML'
      })
    }
    if (message?.text === '/help') {
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
      await bot.sendMessage(message.from.id, instruction, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
    }
  } catch (e) {
  }
}

module.exports = { NewUserPrivate };
