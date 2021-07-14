const { DataTypes } = require("sequelize");
const postgres = require("../postgres");

async function ChatModel() {
  let chat = postgres.define("chat", {
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    chat_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allowLink: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    allowShowParticipation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    allowGreeting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    allowDeleteParticipation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    allowDeleteArabic: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    allowMention: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  await postgres.sync();

  return chat;
}

async function newChat(chat_id, chat_title) {
  let model = await ChatModel();
  let chat = await model.findOne({
    where: { chat_id },
  });
  if (!chat) {
    chat = await model.create({
      chat_id,
      chat_title,
      allowLink: true,
      allowShowParticipation: false,
      allowGreeting: false,
      allowDeleteParticipation: true,
      allowDeleteArabic: false,
      allowMention: false
    });
  }
  return chat;
}

async function getChat(chat_id) {
  let model = await ChatModel();
  let chat = await model.findOne({ where: { chat_id } });
  return chat;
}

async function getChats() {
  let model = await ChatModel();
  let chat = await model.findAll();
  return chat;
}

async function removeChat(chat_id) {
  let model = await ChatModel();
  let chat = await model.destroy({
    where: {
      chat_id,
    },
  });
  return chat;
}

async function allowLink(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
    {
      allowLink: true,
    },
    {
      where: {
        chat_id,
      },
    }
  );
  return chat;
}

async function banLink(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
    { allowLink: false },
    {
      where: {
        chat_id,
      },
    }
  );
  return chat;
}

async function allowGreeting(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
    {
      allowGreeting: true,
    },
    {
      where: {
        chat_id,
      },
    }
  );
  return chat;
}

async function banGreeting(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
    { allowGreeting: false },
    {
      where: {
        chat_id,
      },
    }
  );
  return chat;
}

async function allowDeleteParticipation(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
    {
      allowDeleteParticipation: true,
    },
    {
      where: {
        chat_id,
      },
    }
  );
  return chat;
}

async function banDeleteParticipation(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
    { allowDeleteParticipation: false },
    {
      where: {
        chat_id,
      },
    }
  );
  return chat;
}


async function allowDeleteArabic(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
      {
        allowDeleteArabic: true,
      },
      {
        where: {
          chat_id,
        },
      }
  );
  return chat;
}

async function banDeleteArabic(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
      {
        allowDeleteArabic: false,
      },
      {
        where: {
          chat_id,
        },
      }
  );
  return chat;
}

async function onMention(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
      {
        allowMention: true,
      },
      {
        where: {
          chat_id,
        },
      }
  );
  return chat;
}

async function banMention(chat_id) {
  let model = await ChatModel();
  let chat = await model.update(
      { allowMention: false },
      {
        where: {
          chat_id,
        },
      }
  );
  return chat;
}


module.exports = {
  newChat,
  getChat,
  getChats,
  removeChat,
  allowLink,
  banLink,
  allowGreeting,
  banGreeting,
  allowDeleteParticipation,
  banDeleteParticipation,
  banDeleteArabic,
  allowDeleteArabic,
  onMention,
  banMention
};
