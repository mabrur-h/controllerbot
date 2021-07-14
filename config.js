require("dotenv").config();

const { env } = process;

module.exports = {
  PGURL: env.PGURL,
  TOKEN: env.TOKEN,
  ADMIN_PASSWORD: env.ADMIN_PASSWORD,
  BOT_USERNAME: env.BOT_USERNAME,
  EMAIL: env.EMAIL,
  PASSWORD: env.PASSWORD,
  PORT: env.PORT,
  SECRET_WORD: env.SECRET_WORD,
  MYID: env.MYID,
};
