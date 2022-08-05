const COMMANDS = require('./commands');

module.exports = Object.freeze({
  [COMMANDS.START]: { command: COMMANDS.START, description: 'Start' },
  [COMMANDS.START_WORKOUT]: { command: COMMANDS.START_WORKOUT, description: 'Начать тренировку' },
})
