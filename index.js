const messages = require('./src/messages')
const TelegramBot = require('node-telegram-bot-api');
const getChatId = require("./src/utils/getChatId");
const { START_COMMAND } = require("./src/const/commands");
require('dotenv').config();

const start = async () => {
  try {
    const bot = new TelegramBot(process.env.API_TOKEN, { polling: true });

    await bot.setMyCommands([
      { command: START_COMMAND, description: 'Начать тренировку' },
    ]);

    bot.on('message', async (msg) => {
      const { text } = msg;
      const chatId = getChatId(msg);

      if (text === START_COMMAND) {
        await bot.sendMessage(chatId, messages.muscleGroupChoice.text, messages.muscleGroupChoice.form);
      }
    });

    bot.on('callback_query', (msg) => {
      console.log(msg);
    });
  } catch(e) {
    console.error(e);
  }
};

start();
