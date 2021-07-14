const { BOT_USERNAME } = require("../../../config");
const { getBlocks } = require("../../../modules/models/BlockModel");
const { getChats } = require("../../../modules/models/ChatModel");
const { getUsers } = require("../../../modules/models/UserModel");
const { checkToken } = require("../modules/jwt");
const group = require("../modules/group");

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}

module.exports = async (req, res) => {
    let token = req.cookies?.token;
    token = checkToken(token);

    if (!token) {
        res.redirect("/login");
        return 0;
    }

    req.user = token;

    let allGroups = await getChats();
    allGroups = allGroups.map((group) => {
        let gr = group.dataValues;
        return gr;
    });
    let groups = await group(allGroups);
    let users = await getUsers();

    let blocks = await getBlocks();

    users = users.map((user) => user.dataValues);
    chats = [...groups, ...users];
    blocks = blocks.map((block) => block.dataValues);
    let sentMessage = localStorage.getItem("sentMessage");
    let hasError = localStorage.getItem("hasError");
    let isFinished = localStorage.getItem("isFinished");
    let blocksCount = blocks.length;

    await res.render("index", {
        sentMessage,
        hasError,
        isFinished,
        groupsCount: allGroups.length,
        blocksCount,
        usersCount: users.length,
        bot_username: BOT_USERNAME,
        groups: groups,
    });
};
