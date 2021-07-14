const { DataTypes } = require("sequelize");
const postgres = require("../postgres");

async function BlockModel() {
  let block = postgres.define("blocks", {
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: DataTypes.BOOLEAN,
    },
  });

  await postgres.sync();

  return block;
}

async function AddBlock(chat_id) {
  let model = await BlockModel();

  return await model.create({
    chat_id,
  });
}

async function getBlocks() {
  let model = await BlockModel();

  return await model.findAll();
}

async function getBlock(chat_id) {
  let model = await BlockModel();

  return await model.findOne({
    where: {
      chat_id,
    },
  });
}

async function removeBlock(chat_id) {
  let model = await BlockModel();

  return await model.destroy({
    where: {
      chat_id,
    },
  });
}

module.exports = { AddBlock, getBlocks, getBlock, removeBlock };
