const WORKOUT_TYPES = require('./workout-types');

module.exports = Object.freeze({
  [WORKOUT_TYPES.MAX_AMOUNT]: 'с максимальным количеством повторений',
  [WORKOUT_TYPES.SHORT_PAUSES]: 'с перерывами по 15 секунд',
  [WORKOUT_TYPES.DELAYS]: 'с задержками'
});
