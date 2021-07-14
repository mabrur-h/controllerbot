const { allowLink, banLink } = require("../modules/models/ChatModel");

async function allowSendLink(bot, message) {
  try {
    await allowLink(message.chat.id);
  } catch (e) {
  }
}

async function banSendLink(bot, message) {
  try {
    await banLink(message.chat.id);
  } catch (e) {
  }
}

module.exports = { allowSendLink, banSendLink };
