require('dotenv').config();
const sequelize = require('./src/db');
const WorkoutBot = require('./src/bot');

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    new WorkoutBot(process.env.API_TOKEN, { polling: true });
  } catch(e) {
    console.error(e);
  }
};

start();
