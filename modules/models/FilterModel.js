const { DataTypes } = require("sequelize");
const postgres = require("../postgres");

async function FilterModel() {
  let filter = postgres.define("filter", {
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    filter: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  });

  await postgres.sync();

  return filter;
}

async function newFilter(chat_id, word) {
  let model = await FilterModel();
  let filter = await model.findOne({
    where: {
      chat_id,
    },
  });

  if (!filter) {
    filter = await model.create({ chat_id, filter: [] });
  }
  filter = filter.dataValues;
  if (!filter) {
    let arr = filter.filter;
    arr.push(word);
    return await model.create({ chat_id, filter: [arr] });
  } else {
    let arr = filter.filter;
    if (!arr.includes(word)) arr.push(word);
    return await model.update(
      { filter: arr },
      {
        where: {
          chat_id,
        },
      }
    );
  }
}

async function getFilter(chat_id) {
  let model = await FilterModel();
  return await model.findOne({
    where: {
      chat_id,
    },
  });
}

async function removeFilter(chat_id, word) {
  let model = await FilterModel();
  let filter = await model.findOne({
    where: {
      chat_id,
    },
  });
  let arr = filter.dataValues.filter;
  arr.splice(arr.indexOf(word), 1);
  return await model.update(
    { filter: arr },
    {
      where: {
        chat_id,
      },
    }
  );
}

async function removeAllFilter(chat_id) {
  let model = await FilterModel();
  return await model.destroy({
    where: {
      chat_id,
    },
  });
}

module.exports = {
  newFilter,
  getFilter,
  removeAllFilter,
  removeFilter,
};
