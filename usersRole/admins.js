
    async function isAdmin(message, bot) {
        const chatId = message.chat.id;
        const userId = message.from.id;
        const admins = await bot.getChatAdministrators(chatId)

        let adminsList = []
        admins.map(el => adminsList.push(el.user.id))

        return adminsList.includes(userId)
    }

    module.exports = isAdmin
