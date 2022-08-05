const sequelize = require('../db');
const WORKOUT_TYPES = require('../enum/workout-types');
const MUSCLE_GROUP = require('../enum/muscle-group');
const { DataTypes } = require('sequelize');

const Workout = sequelize.define('workout', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.INTEGER, foreignKey: true },
  type: { type: DataTypes.ENUM(Object.values(WORKOUT_TYPES)), allowNull: false },
  muscleGroup: { type: DataTypes.ENUM(Object.values(MUSCLE_GROUP)), allowNull: false },
  approaches: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] }
});

module.exports = Workout;
