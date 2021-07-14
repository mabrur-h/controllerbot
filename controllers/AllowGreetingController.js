const { allowGreeting, banGreeting } = require("../modules/models/ChatModel");

async function allowSendGreeting(bot, message) {
  try {
    await allowGreeting(message.chat.id);
  } catch (e) {
  }
}

async function banSendGreeting(bot, message) {
  try {
    await banGreeting(message.chat.id);
  } catch (e) {
  }
}

module.exports = { allowSendGreeting, banSendGreeting };
