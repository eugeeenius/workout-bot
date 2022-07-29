const TelegramBot = require("node-telegram-bot-api");
const { START_COMMAND } = require("./const/commands");
const messages = require("./messages");
const getChatId = require("./utils/getChatId");

const init = async () => {
  const bot = new TelegramBot(process.env.API_TOKEN, { polling: true });

  await bot.setMyCommands([
    { command: START_COMMAND, description: 'Начать тренировку' }
  ]);

  bot.on('message', async (msg) => {
    const { text } = msg;
    const chatId = getChatId(msg);

    if (text === START_COMMAND) {
      await bot.sendMessage(chatId, messages.muscleGroupChoice.text, messages.muscleGroupChoice.form);
    }
  });
};

module.exports = init;
