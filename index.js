require('dotenv').config();
const sequelize = require('./src/db');
const initBot = require('./src/bot');

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await initBot();
  } catch(e) {
    console.error(e);
  }
};

start();

module.exports = start;
