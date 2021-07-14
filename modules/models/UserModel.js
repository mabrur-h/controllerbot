const { DataTypes } = require("sequelize");
const postgres = require("../postgres");

async function UserModel() {
  let user = postgres.define("user", {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  await postgres.sync();
  return user;
}

async function newUser(user_id) {
  let model = await UserModel();
  let user = await model.findOne({
    where: {
      user_id,
    },
  });
  if (!user) {
    return await model.create({ user_id });
  }
}

async function getUsers() {
  let model = await UserModel();
  let user = await model.findAll();
  return user;
}

async function removeUser(user_id) {
  let model = await UserModel();
  return await model.destroy({
    where: {
      user_id,
    },
  });
}

module.exports = { newUser, getUsers, removeUser };
