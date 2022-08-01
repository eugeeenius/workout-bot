const TelegramBot = require('node-telegram-bot-api');
const UserService = require('./services/user-service');
const COMMANDS = require('./enum/commands');
const MESSAGES = require('./messages');
const BOT_EVENTS = require('./enum/bot-events');

class WorkoutBot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
    this.init();
  }

  async init() {
    await this.setMyCommands([
      { command: COMMANDS.START_WORKOUT, description: 'Начать тренировку' }
    ]);

    this.on('message', async (msg) => {
      switch (msg.text) {
        case COMMANDS.START_WORKOUT:
          await this.onStartWorkout();
          break;
      }
    });

    this.emit(BOT_EVENTS.READY);
  }

  async onStartWorkout(msg) {
    const chatId = msg.chat.id
    const user = await UserService.getUser(chatId);
    if (!user) {
      await this.sendMessage(chatId, MESSAGES.MUSCLE_GROUP_CHOICE);
      return;
    }
  }

  async sendMessage(chatId, message) {
    if (typeof chatId !== 'number' || !message) return;
    const args = [chatId, message.text, message.form].filter(arg => arg !== undefined);
    await super.sendMessage(...args);
  }
}

module.exports = WorkoutBot;
