const COMMANDS = require('../enum/commands')

module.exports = {
  text: 'Начать тренировку',
  form: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Поехали!',
            callback_data: COMMANDS.START_WORKOUT
          },
        ]
      ]
    }
  }
};
