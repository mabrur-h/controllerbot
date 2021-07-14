const fetch = require("node-fetch");
const { TOKEN } = require("../../../config");

module.exports = async (chats) => {
    let groups = [];

    for(chat of chats) {
        let response = await fetch(
            `https://api.telegram.org/bot${TOKEN}/getChatMembersCount?chat_id=${chat.chat_id}`
        );
        response = await response.json();
        groups.push({
            name: chat.chat_title,
            count: response.result,
        });
    }

    return groups;
};
