const {
  allowDeleteParticipation,
  banDeleteParticipation,
  allowDeleteArabic,
  banDeleteArabic,
    onMention,
    banMention
} = require("../modules/models/ChatModel");

async function hideParticipation(bot, message) {
  try {
    await allowDeleteParticipation(message.chat.id);
  } catch (e) {
  }
}

async function showParticipation(bot, message) {
  try {
    await banDeleteParticipation(message.chat.id);
  } catch (e) {
  }
}

async function deleteArabic(bot, message) {
  try {
    await allowDeleteArabic(message.chat.id);
  } catch (e) {
  }
}

async function allowArabic(bot, message) {
  try {
    await banDeleteArabic(message.chat.id);
  } catch (e) {
  }
}

async function allowMention(bot, message) {
  try {
    await onMention(message.chat.id)
  } catch (e) {
  }
}

async function disallowMention(bot, message) {
  try {
    await banMention(message.chat.id)
  } catch (e) {
  }
}


module.exports = { showParticipation, hideParticipation, allowArabic, deleteArabic, allowMention, disallowMention };
