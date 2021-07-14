const { DataTypes, Op } = require("sequelize");
const postgres = require("../postgres");

async function WarnModel() {
  let warn = postgres.define("warn", {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    warn: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
  });

  await postgres.sync();

  return warn;
}

async function newWarn(user_id, chat_id) {
  let model = await WarnModel();
  let warn = await model.findOne({
    where: {
      [Op.and]: {
        user_id,
        chat_id,
      },
    },
  });

  if (!warn) {
    return await model.create({
      user_id: Number(user_id),
      chat_id: Number(chat_id),
      warn: 1,
    });
  } else {
    warn = warn.dataValues;
    if (warn.warn < 6) {
      return await model.update(
        { warn: warn.warn + 1 },
        {
          where: {
            [Op.and]: {
              user_id,
              chat_id,
            },
          },
        }
      );
    }
  }
}

async function minusWarn(user_id, chat_id) {
  let model = await WarnModel();
  let warns = await model.findAll();
  let warn = await model.findOne({
    where: {
      [Op.and]: {
        user_id: String(user_id),
        user_id: String(chat_id),
      },
    },
  });
  warn = warn.dataValues;
  if (warn.warn === 1) {
    return await model.destroy({
      where: {
        [Op.and]: {
          chat_id,
          user_id,
        },
      },
    });
  }
  const oldWarn = warn.warn;
  warn = await model.update(
    { warn: oldWarn - 1 },
    {
      where: {
        [Op.and]: {
          user_id: String(user_id),
          user_id: String(chat_id),
        },
      },
    }
  );
  return warn;
}

async function getWarn(chat_id, user_id) {
  let model = await WarnModel();

  return await model.findOne({
    where: {
      [Op.and]: {
        chat_id,
        user_id,
      },
    },
  });
}

async function delWarn(chat_id, user_id) {
  let model = await WarnModel();

  return await model.destroy({
    where: {
      [Op.and]: {
        chat_id,
        user_id,
      },
    },
  });
}

module.exports = { newWarn, minusWarn, getWarn, delWarn };
