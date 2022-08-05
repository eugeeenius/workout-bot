const WorkoutBot = require('../src/bot');

let bot;

async function startBot() {
  await stopBot();
  bot = new WorkoutBot(process.env.API_TOKEN);
  await bot.init();
  await bot.startPolling({ restart: true });
  return bot;
}

async function stopBot() {
  if (bot) {
    await bot.disconnect();
    bot = null;
  }
}

module.exports = {
  startBot,
  stopBot
}
