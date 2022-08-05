require('dotenv').config();
const sequelize = require('./src/db');
const WorkoutBot = require('./src/bot');

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const bot = new WorkoutBot(process.env.API_TOKEN);
    await bot.init();
  } catch(e) {
    console.error(e);
  }
};

start();
