const WORKOUT_TYPES = require('../src/enum/workout-types');
const MUSCLE_GROUPS = require('../src/enum/muscle-group');

module.exports = () => ({
  id: 12,
  chatId: 228,
  type: WORKOUT_TYPES.MAX_AMOUNT,
  muscleGroup: MUSCLE_GROUPS.CHEST,
  approaches: [14, 10, 8, 6],
  done: true
});
