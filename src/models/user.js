const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Workout = require('./workout');
const WORKOUT_TYPES = require('../enum/workout-types');

const User = sequelize.define('user', {
  chatId: { type: DataTypes.INTEGER, primaryKey: true },
  workoutsOrder: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [...Object.values(WORKOUT_TYPES)],
    allowNull: false
  }
});

User.hasMany(Workout, {
  foreignKey: 'chatId',
  as: 'workouts',
  onDelete: 'CASCADE'
});

Workout.belongsTo(User);

module.exports = User;
